import paramiko
import time
import base64
import sys

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

app_uuid = sys.argv[1] if len(sys.argv) > 1 else "zewrjgso0upy02y4kxkpymzr"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

print(f"[*] Lanzando despliegue en Coolify para UUID {app_uuid}...")

launch_php = f"""<?php
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

use App\\Models\\Application;
$a = Application::where('uuid', '{app_uuid}')->first();
if (!$a) {{
    echo "ERROR: APP NOT FOUND";
    exit;
}}

$activity = queue_application_deployment(
    application: $a,
    deployment_uuid: (string) \\Illuminate\\Support\\Str::uuid(),
    force_rebuild: false
);

$id = null;
if (is_array($activity)) {{
    if (isset($activity['existing_deployment'])) {{
        $id = $activity['existing_deployment']->id;
    }} elseif (isset($activity['deployment_uuid'])) {{
        $found = App\\Models\\ApplicationDeploymentQueue::where('deployment_uuid', $activity['deployment_uuid'])->first();
        if ($found) $id = $found->id;
    }}
}} elseif (is_object($activity)) {{
    $id = $activity->id;
}}
echo "DEPLOY_ID:" . $id;
"""

b64 = base64.b64encode(launch_php.encode()).decode()
cmd = f"echo '{b64}' | base64 -d | docker exec -i coolify php"
stdin, stdout, stderr = ssh.exec_command(cmd)
res = stdout.read().decode('utf-8').strip()
print("Respuesta Coolify:", res)

if "DEPLOY_ID:" in res:
    dep_id = res.split("DEPLOY_ID:")[1].strip()
    print(f"Monitoreando despliegue ID {dep_id}...")
    while True:
        time.sleep(6)
        _, stdout, _ = ssh.exec_command(f"""docker exec coolify php -r '
        require "/var/www/html/vendor/autoload.php";
        $app = require_once "/var/www/html/bootstrap/app.php";
        $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
        $kernel->bootstrap();
        $d = App\\Models\\ApplicationDeploymentQueue::find({dep_id});
        echo $d ? $d->status : "none";
        '""")
        st = stdout.read().decode('utf-8').strip()
        print(f"[{app_uuid}] ID {dep_id} -> {st}")
        if st == "finished":
            print(f"[OK] Despliegue {dep_id} finalizado con EXITO!")
            break
        elif st in ["failed", "cancelled", "killed"]:
            print(f"[FAIL] Despliegue {dep_id} finalizó con estado: {st}")
            _, stdout, _ = ssh.exec_command(f"""docker exec coolify php -r '
            require "/var/www/html/vendor/autoload.php";
            $app = require_once "/var/www/html/bootstrap/app.php";
            $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
            $kernel->bootstrap();
            $d = App\\Models\\ApplicationDeploymentQueue::find({dep_id});
            echo substr($d ? $d->logs : "", -2500);
            '""")
            print("LOGS:", stdout.read().decode())
            break

ssh.close()
