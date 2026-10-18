import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

stdin, stdout, stderr = ssh.exec_command('ls -la /data/coolify/applications/rw5ulk9vgw439djnk6ga7dhi 2>/dev/null')
print(stdout.read().decode())

ssh.close()
