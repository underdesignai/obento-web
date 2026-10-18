import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('75.119.132.90', username='root', password='45014501', timeout=10)

sql = "SELECT id, numero_pedido, tipo_entrega, estado_pedido, cliente_notificado, repartidor_nombre, fecha_salida_reparto, updated_at FROM pedidos WHERE numero_pedido = 'OB-6393';"
cmd = f'docker exec 9o9j8hjhp91koubkwcnjazqp psql -U postgres -d obento_db -c "{sql}"'

stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode('utf-8'))

ssh.close()
