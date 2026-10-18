import paramiko
import time
import base64

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

app_uuid = "acqysi7u0qqvjnkhp2i5mhux"
app_name = "Obento Delivery"

print(f"[*] Buscando despliegue activo o encolado para {app_name}...")

php_check = """<?php
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

use App\\Models\\ApplicationDeploymentQueue;
$d = ApplicationDeploymentQueue::where('application_name', 'Obento Delivery')
    ->orderBy('id', 'desc')
    ->first();

if ($d) {
    echo "LATEST_ID:" . $d->id . ":" . $d->status;
} else {
    echo "NONE";
}
"""
b64 = base64.b64encode(php_check.encode()).decode()
cmd = f"echo '{b64}' | base64 -d | docker exec -i coolify php"
stdin, stdout, stderr = ssh.exec_command(cmd)
res = stdout.read().decode('utf-8').strip()
print("Estado actual:", res)

if "LATEST_ID:" not in res:
    print("No se encontró despliegue.")
    exit(1)

parts = res.split("LATEST_ID:")[1].split(":")
deploy_id = parts[0]
status = parts[1]

print(f"Monitoreando Obento Delivery (ID {deploy_id})...")

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
    print(f"[{app_name}] ID {deploy_id} -> {st}")
    if st == "finished":
        print(f"[OK] {app_name} desplegado con EXITO!")
        break
    elif st in ["failed", "cancelled", "killed"]:
        print(f"[FAIL] {app_name} finalizo con estado: {st}")
        break

ssh.close()
