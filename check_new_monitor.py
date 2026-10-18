import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker logs --tail 25 rw5ulk9vgw439djnk6ga7dhi-20261015T172532')
print("CONTAINER LOGS:\n" + stdout.read().decode('utf-8'))

ssh.close()
