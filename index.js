const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Habilita o parser de JSON (Express 4.16+ já inclui)
app.use(express.json());

// Configurando o SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pedidos.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

// Cria a tabela de pedidos, se não existir
db.run(`CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido TEXT,
  precoTotal REAL,
  dataPedido DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Endpoint para salvar o pedido
app.post('/api/salvarPedido', (req, res) => {
  const { pedido, precoTotal } = req.body;
  if (!pedido || !precoTotal) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }
  const sql = 'INSERT INTO pedidos (pedido, precoTotal) VALUES (?, ?)';
  db.run(sql, [pedido, precoTotal], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Servir arquivos estáticos (front-end) a partir da pasta "public"
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});