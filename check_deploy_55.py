import paramiko
import json

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

cmd = """docker exec coolify php -r '
require "/var/www/html/vendor/autoload.php";
$app = require_once "/var/www/html/bootstrap/app.php";
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$d = App\\Models\\ApplicationDeploymentQueue::find(55);
if ($d) {
    echo $d->logs;
}
'"""

stdin, stdout, stderr = ssh.exec_command(cmd)
logs = stdout.read().decode('utf-8')
data = json.loads(logs)
for item in data[-20:]:
    print(item.get("output", "").strip())

ssh.close()
