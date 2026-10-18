import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

cmd = """docker exec coolify php -r '
require "/var/www/html/vendor/autoload.php";
$app = require_once "/var/www/html/bootstrap/app.php";
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

use App\\Models\\EnvironmentVariable;
use App\\Models\\Application;

$monitor = Application::where("uuid", "rw5ulk9vgw439djnk6ga7dhi")->first();
if ($monitor) {
    foreach ($monitor->environment_variables as $env) {
        if ($env->key === "DATABASE_URL") {
            $env->value = "postgresql://postgres:ObentoPassword2026!@9o9j8hjhp91koubkwcnjazqp:5432/obento_db";
            $env->save();
            echo "UPDATED_MONITOR_DATABASE_URL\\n";
        }
    }
}

$delivery = Application::where("uuid", "acqysi7u0qqvjnkhp2i5mhux")->first();
if ($delivery) {
    foreach ($delivery->environment_variables as $env) {
        if ($env->key === "DATABASE_URL") {
            $env->value = "postgresql://postgres:ObentoPassword2026!@9o9j8hjhp91koubkwcnjazqp:5432/obento_db";
            $env->save();
            echo "UPDATED_DELIVERY_DATABASE_URL\\n";
        }
    }
}
'"""

stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
ssh.close()
