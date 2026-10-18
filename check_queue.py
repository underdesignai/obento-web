import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

cmd = """docker exec coolify php -r '
require "/var/www/html/vendor/autoload.php";
$app = require_once "/var/www/html/bootstrap/app.php";
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$items = App\\Models\\ApplicationDeploymentQueue::orderBy("id", "desc")->take(5)->get();
foreach ($items as $item) {
    echo "ID: " . $item->id . " | Status: " . $item->status . " | App: " . ($item->application ? $item->application->name : "N/A") . " | Created: " . $item->created_at . "\\n";
}
'"""

stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())
ssh.close()
