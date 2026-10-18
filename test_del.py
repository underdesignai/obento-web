import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

cmd = """docker exec coolify php -r '
require "/var/www/html/vendor/autoload.php";
$app = require_once "/var/www/html/bootstrap/app.php";
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$a = App\\Models\\Application::where("uuid", "acqysi7u0qqvjnkhp2i5mhux")->first();
$res = queue_application_deployment(
    application: $a,
    deployment_uuid: (string) Illuminate\\Support\\Str::uuid(),
    force_rebuild: true
);
var_dump($res);
'"""

stdin, stdout, stderr = ssh.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
