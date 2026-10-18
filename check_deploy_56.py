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

$d = App\\Models\\ApplicationDeploymentQueue::find(56);
if ($d) {
    echo "STATUS:" . $d->status . "###LOGS:" . $d->logs;
}
'"""

stdin, stdout, stderr = ssh.exec_command(cmd)
out = stdout.read().decode('utf-8')
if "STATUS:" in out:
    parts = out.split("###LOGS:")
    status = parts[0].replace("STATUS:", "").strip()
    raw_logs = parts[1] if len(parts) > 1 else ""
    print(f"DEPLOYMENT 56 STATUS: {status}")
    try:
        data = json.loads(raw_logs)
        for item in data[-20:]:
            print(item.get("output", "").strip())
    except Exception as e:
        print("Raw logs tail:", raw_logs[-1000:])
ssh.close()
