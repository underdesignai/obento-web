import paramiko
import time
import base64

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

# Stop duplicate helper container 65ae87e02332 if running
ssh.exec_command('docker stop 65ae87e02332 2>/dev/null; docker rm -f 65ae87e02332 2>/dev/null')

# Mark 54 as cancelled
cancel_php = """docker exec coolify php -r '
require "/var/www/html/vendor/autoload.php";
$app = require_once "/var/www/html/bootstrap/app.php";
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();
$d = App\\Models\\ApplicationDeploymentQueue::find(54);
if ($d && $d->status == "in_progress") {
    $d->status = "cancelled";
    $d->save();
    echo "CANCELLED_54\\n";
}
'"""
stdin, stdout, stderr = ssh.exec_command(cancel_php)
print("Cancel 54:", stdout.read().decode())

# Now launch Obento Monitor
print("[*] Lanzando despliegue de Obento Monitor (rw5ulk9vgw439djnk6ga7dhi)...")
launch_php = """<?php
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

use App\\Models\\Application;
$a = Application::where('uuid', 'rw5ulk9vgw439djnk6ga7dhi')->first();
$activity = queue_application_deployment(
    application: $a,
    deployment_uuid: (string) \\Illuminate\\Support\\Str::uuid(),
    force_rebuild: true
);

$id = null;
if (is_array($activity)) {
    if (isset($activity['existing_deployment'])) {
        $id = $activity['existing_deployment']->id;
    } elseif (isset($activity['deployment_uuid'])) {
        $found = App\\Models\\ApplicationDeploymentQueue::where('deployment_uuid', $activity['deployment_uuid'])->first();
        if ($found) $id = $found->id;
    }
} elseif (is_object($activity)) {
    $id = $activity->id;
}
echo "MONITOR_DEPLOY_ID:" . $id;
"""

b64 = base64.b64encode(launch_php.encode()).decode()
cmd = f"echo '{b64}' | base64 -d | docker exec -i coolify php"
stdin, stdout, stderr = ssh.exec_command(cmd)
res = stdout.read().decode('utf-8').strip()
print("Respuesta trigger Monitor:", res)

if "MONITOR_DEPLOY_ID:" in res:
    mon_id = res.split("MONITOR_DEPLOY_ID:")[1].strip()
    print(f"Monitoreando Obento Monitor ID {mon_id}...")
    while True:
        time.sleep(6)
        _, stdout, _ = ssh.exec_command(f"""docker exec coolify php -r '
        require "/var/www/html/vendor/autoload.php";
        $app = require_once "/var/www/html/bootstrap/app.php";
        $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
        $kernel->bootstrap();
        $d = App\\Models\\ApplicationDeploymentQueue::find({mon_id});
        echo $d ? $d->status : "none";
        '""")
        st = stdout.read().decode('utf-8').strip()
        print(f"[Obento Monitor] ID {mon_id} -> {st}")
        if st == "finished":
            print("[OK] Obento Monitor desplegado con EXITO!")
            break
        elif st in ["failed", "cancelled", "killed"]:
            print(f"[FAIL] Obento Monitor finalizo con estado: {st}")
            _, stdout, _ = ssh.exec_command(f"""docker exec coolify php -r '
            require "/var/www/html/vendor/autoload.php";
            $app = require_once "/var/www/html/bootstrap/app.php";
            $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
            $kernel->bootstrap();
            $d = App\\Models\\ApplicationDeploymentQueue::find({mon_id});
            echo substr($d ? $d->logs : "", -2000);
            '""")
            print("LOGS:", stdout.read().decode())
            break

ssh.close()
