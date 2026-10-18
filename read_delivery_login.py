import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501')

cname = 'acqysi7u0qqvjnkhp2i5mhux-20261015T183458'
stdin, stdout, stderr = ssh.exec_command(f'docker exec {cname} find /app/app -type f')
files = stdout.read().decode('utf-8', errors='replace').splitlines()
for f in files:
    if 'login' in f or 'auth' in f:
        print("Delivery File:", f)
        stdin2, stdout2, stderr2 = ssh.exec_command(f'docker exec {cname} cat {f}')
        print(stdout2.read().decode('utf-8', errors='replace'))

ssh.close()
