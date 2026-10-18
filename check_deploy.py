import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

php_code = """<?php
require '/var/www/html/vendor/autoload.php';
$app = require_once '/var/www/html/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$d = App\\Models\\ApplicationDeploymentQueue::find(75);
echo $d ? $d->status : "none";
"""

while True:
    stdin, stdout, stderr = ssh.exec_command("docker exec -i coolify php")
    stdin.write(php_code)
    stdin.channel.shutdown_write()
    st = stdout.read().decode('utf-8').strip()
    print("STATUS:", st, flush=True)
    if st in ["finished", "failed", "cancelled", "killed"]:
        break
    time.sleep(5)

ssh.close()
