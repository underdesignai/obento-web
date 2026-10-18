import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501')

for cname, label in [
    ('jiusnsj4kd4oovocygxu6wbn-20261015T091317', 'Dashboard'),
    ('rw5ulk9vgw439djnk6ga7dhi-20261015T182631', 'Monitor'),
    ('acqysi7u0qqvjnkhp2i5mhux-20261015T183458', 'Delivery')
]:
    stdin, stdout, stderr = ssh.exec_command(f'docker exec {cname} cat /app/app/api/auth/login/route.ts')
    res = stdout.read().decode('utf-8', errors='replace')
    print(f"=== {label} route.ts ===")
    print(res[:1200] if res else "Not found")

ssh.close()
