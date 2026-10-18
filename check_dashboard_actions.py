import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

def run(cmd):
    print(f"=== {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print("STDOUT:\n" + out)
    if err:
        print("STDERR:\n" + err)
    return out

# Dashboard logs
run("docker logs --tail 50 jiusnsj4kd4oovocygxu6wbn-20261015T224429")

# Look at routes in Dashboard
run("docker exec jiusnsj4kd4oovocygxu6wbn-20261015T224429 find /app/app -type f")

# Look at routes in Pedidos
run("docker exec 6kgxc7ryamlr0laws3n3x7xm-20261015T185550 find /app/app -type f")

ssh.close()
