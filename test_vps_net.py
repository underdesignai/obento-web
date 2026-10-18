import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

stdin, stdout, stderr = ssh.exec_command('curl -s -w "%{time_total}\n" -o /dev/null https://registry.npmjs.org/next')
print("NPM registry next latency:", stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command('curl -s -w "%{time_total}\n" -o /dev/null https://registry.npmmirror.com/next')
print("NPM mirror next latency:", stdout.read().decode())

ssh.close()
