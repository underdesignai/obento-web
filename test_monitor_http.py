import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

stdin, stdout, stderr = ssh.exec_command('curl -s -I https://monitor.obentojapanesefood.es')
print("CURL HEADERS:\n" + stdout.read().decode('utf-8'))

stdin, stdout, stderr = ssh.exec_command('curl -s http://127.0.0.1:3630/api/heartbeat')
print("HEARTBEAT:\n" + stdout.read().decode('utf-8'))

ssh.close()
