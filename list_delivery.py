import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501')

stdin, stdout, stderr = ssh.exec_command('docker ps --filter name=acqysi7u0qqvjnkhp2i5mhux --format "{{.Names}}"')
cname = stdout.read().decode().strip()

stdin, stdout, stderr = ssh.exec_command(f'docker exec {cname} find /app/app -type f')
print("Delivery app files:\n", stdout.read().decode('utf-8', errors='replace'))

stdin, stdout, stderr = ssh.exec_command(f'docker exec {cname} cat /app/middleware.ts')
print("Delivery middleware.ts:\n", stdout.read().decode('utf-8', errors='replace'))

ssh.close()
