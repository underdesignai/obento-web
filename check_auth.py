import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501')

stdin, stdout, stderr = ssh.exec_command('''docker exec coolify-db psql -U coolify -d coolify -c "SELECT id, name, uuid, fqdn FROM applications;"''')
print("--- Coolify Applications UUIDs ---")
print(stdout.read().decode('utf-8', errors='replace'))

ssh.close()
