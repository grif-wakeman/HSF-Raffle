const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('names.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY, name TEXT)");
});

app.post('/add-name', (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO names (name) VALUES (?)", [name], function(err) {
    if (err) return res.status(500).send('Error saving name');
    res.send({ success: true });
  });
});

app.get('/all-names', (req, res) => {
  db.all("SELECT name FROM names", [], (err, rows) => {
    if (err) return res.status(500).send('Error fetching names');
    const names = rows.map(row => row.name);
    res.send({ names });
  });
});


app.get('/random-name', (req, res) => {
  db.all("SELECT name FROM names", [], (err, rows) => {
    if (err) return res.status(500).send('Error fetching names');
    if (rows.length === 0) return res.status(404).send('No names yet');
    const random = rows[Math.floor(Math.random() * rows.length)];
    res.send({ name: random.name });
  });
});

app.listen(port, () => {
  console.log(`HSF-Raffle backend running on port ${port}`);
});
