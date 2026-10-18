import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501')

containers = {
    'Dashboard': 'jiusnsj4kd4oovocygxu6wbn',
    'Monitor': 'rw5ulk9vgw439djnk6ga7dhi',
    'Delivery': 'acqysi7u0qqvjnkhp2i5mhux',
    'Pedidos': '6kgxc7ryamlr0laws3n3x7xm',
    'Web': 'zewrjgso0upy02y4kxkpymzr'
}

for name, uuid in containers.items():
    print(f"\n==================== {name} ({uuid}) ====================")
    # Find full container name
    stdin, stdout, stderr = ssh.exec_command(f'docker ps --filter name={uuid} --format "{{{{.Names}}}}"')
    cname = stdout.read().decode().strip()
    print(f"Container: {cname}")
    if not cname:
        continue
    
    # Check env vars
    stdin, stdout, stderr = ssh.exec_command(f'docker exec {cname} env')
    env_lines = stdout.read().decode().splitlines()
    auth_envs = [line for line in env_lines if any(k in line.lower() for k in ['pass', 'user', 'auth', 'pin', 'login', 'admin', 'secret'])]
    print("Auth Env Vars:", auth_envs)

    # Search for login/auth files in app
    stdin, stdout, stderr = ssh.exec_command(f'docker exec {cname} find /app -maxdepth 3 -type f \\( -name "*auth*" -o -name "*login*" -o -name "*user*" -o -name "*config*" \\) 2>/dev/null')
    files = stdout.read().decode().strip()
    print("Auth Files found:\n", files)

ssh.close()
