import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

def run(cmd):
    print(f"=== {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print("STDOUT:\n" + out)
    if err:
        print("STDERR:\n" + err)
    return out

# Check where images are in pedidos container
run("docker exec 6kgxc7ryamlr0laws3n3x7xm-20261015T185550 find /app -name 'edamame*' 2>/dev/null")
run("docker exec zewrjgso0upy02y4kxkpymzr-20261015T150833 find /app -name 'edamame*' 2>/dev/null")
run("docker exec jiusnsj4kd4oovocygxu6wbn-20261015T224429 find /app -name 'edamame*' 2>/dev/null")
run("docker exec zsuvpy7jxl2j14kzhcx4csi4-20261014T175759 find /app -name 'edamame*' 2>/dev/null")

# Also check server.js or index.js in pedidos container
run("docker exec 6kgxc7ryamlr0laws3n3x7xm-20261015T185550 cat /app/server/index.js | grep -E 'static|express'")

ssh.close()
