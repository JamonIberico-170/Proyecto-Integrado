const app = require('./app');
const { createPool } = require('mysql2/promise');
const video = require('./modulos/videos/route');
const user = require('./modulos/users/route');
const config = require('./config');

const bodyParser = require('body-parser');
const auth = require('./auth/auth');
const pool = createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  port: 3306,
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api/user', user);
app.use('/api/video', video);

app.get('/world',(req, res) => {
  res.send('Hello World');
});

app.get('/time', async (req, res) => {
  const result = await pool.query('SELECT NOW() ');
  res.json(result[0]);
});

app.get('/login', (req, res)=>{
  auth.authenticateToken(req, res);
});

app.get('/token', (req, res)=>{
  auth.createToken(res,req);
});

//Puerto en el cual la app permanece en escucha.
app.listen(app.get('port'), () => {
  console.log('Servidor en escucha por el puerto', app.get('port'));
});