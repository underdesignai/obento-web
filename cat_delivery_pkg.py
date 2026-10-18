import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker exec acqysi7u0qqvjnkhp2i5mhux-20261015T161755 cat /app/package.json')
print(stdout.read().decode())

ssh.close()
