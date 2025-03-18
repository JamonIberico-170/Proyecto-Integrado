/**const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.sendFile('./static/index.html')
})

app.listen(3000)
console.log(`Server on port ${3000}`) */

const app = require('./app');
const {createPool} = require('mysql2/promise');
const pool = createPool({
    host : 'database',
    user : 'root',
    password : 'root',
    port : 3306
});
app.get('/world', (req,res) => {
    res.send("Hello World");
});
app.get('/time', async (req,res) => {
    const result= await pool.query('SELECT NOW()');
    res.json(result[0]);
});
app.listen(app.get('port'), () => {
    console.log("Servidor en escucha por el puerto", app.get("port"));
});

