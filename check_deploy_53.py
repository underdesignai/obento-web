import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

cmd = """docker exec coolify php -r '
require "/var/www/html/vendor/autoload.php";
$app = require_once "/var/www/html/bootstrap/app.php";
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$d = App\\Models\\ApplicationDeploymentQueue::find(53);
if ($d) {
    echo "STATUS:" . $d->status . "###LOGS:" . $d->logs;
}
'"""

stdin, stdout, stderr = ssh.exec_command(cmd)
out = stdout.read().decode('utf-8')
if "STATUS:" in out:
    parts = out.split("###LOGS:")
    header = parts[0]
    raw_logs = parts[1] if len(parts) > 1 else ""
    print(header)
    import json
    try:
        data = json.loads(raw_logs)
        for item in data[:30]:
            print(item.get("output", "").strip())
    except Exception as e:
        print("Raw:", raw_logs[:1000])
ssh.close()
