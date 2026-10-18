import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501')

cname = 'jiusnsj4kd4oovocygxu6wbn-20261015T091317'
stdin, stdout, stderr = ssh.exec_command(f'docker exec {cname} find /app -maxdepth 4 -not -path "*/node_modules/*" -not -path "*/.next/*"')
print(stdout.read().decode('utf-8', errors='replace'))

ssh.close()
