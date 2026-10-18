import paramiko
import time
import base64

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

# Esperar a que ID 54 termine si sigue in_progress
while True:
    _, stdout, _ = ssh.exec_command("""docker exec coolify php -r '
    require "/var/www/html/vendor/autoload.php";
    $app = require_once "/var/www/html/bootstrap/app.php";
    $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
    $kernel->bootstrap();
    $d = App\\Models\\ApplicationDeploymentQueue::find(54);
    echo $d ? $d->status : "none";
    '""")
    st = stdout.read().decode('utf-8').strip()
    if st not in ["in_progress", "queued"]:
        print(f"ID 54 terminado con: {st}")
        break
    print(f"Esperando que finalice ID 54 (estado: {st})...")
    time.sleep(5)

# Ahora encolar Obento Monitor
print("\n[*] Encolando despliegue de Obento Monitor (rw5ulk9vgw439djnk6ga7dhi)...")
php_script = """<?php
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

if (!$id) {
    $latest = App\\Models\\ApplicationDeploymentQueue::where('application_name', 'Obento Monitor')->orderBy('id', 'desc')->first();
    if ($latest) $id = $latest->id;
}

echo "DEPLOY_ID:" . $id;
"""

b64 = base64.b64encode(php_script.encode()).decode()
cmd = f"echo '{b64}' | base64 -d | docker exec -i coolify php"
stdin, stdout, stderr = ssh.exec_command(cmd)
res = stdout.read().decode('utf-8').strip()
print("Respuesta trigger Monitor:", res)

deploy_id = res.split("DEPLOY_ID:")[1].strip()
print(f"Monitoreando Obento Monitor (ID {deploy_id})...")

while True:
    time.sleep(6)
    _, stdout, _ = ssh.exec_command(f"""docker exec coolify php -r '
    require "/var/www/html/vendor/autoload.php";
    $app = require_once "/var/www/html/bootstrap/app.php";
    $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
    $kernel->bootstrap();
    $d = App\\Models\\ApplicationDeploymentQueue::find({deploy_id});
    echo $d ? $d->status : "none";
    '""")
    st = stdout.read().decode('utf-8').strip()
    print(f"[Obento Monitor] ID {deploy_id} -> {st}")
    if st == "finished":
        print(f"[OK] Obento Monitor desplegado con EXITO!")
        break
    elif st in ["failed", "cancelled", "killed"]:
        print(f"[FAIL] Obento Monitor finalizo con estado: {st}")
        break

ssh.close()
