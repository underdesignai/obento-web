import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker top 3dc00771-3297-4ec3-b72a-a3c0916ff3fc')
print("TOP:\n" + stdout.read().decode())

ssh.close()
