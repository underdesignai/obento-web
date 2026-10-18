import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

apps = [
    ("Web Principal", "http://127.0.0.1:3650"),
    ("Web Pedidos", "http://127.0.0.1:3651"),
    ("Monitor Cocina", "http://127.0.0.1:3630"),
    ("App Delivery", "http://127.0.0.1:3640"),
]

for name, url in apps:
    stdin, stdout, stderr = ssh.exec_command(f'curl -s -o /dev/null -w "%{{http_code}}" {url}')
    code = stdout.read().decode('utf-8').strip()
    print(f"[{name}] {url} -> HTTP {code}")

ssh.close()
