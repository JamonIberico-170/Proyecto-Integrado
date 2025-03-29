const db = require('../../DB/mysql');

const TABLA = 'video';


function todos(){
    return db.todos(TABLA);
}
module.exports = {
    todos
}