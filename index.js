const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();
const conn = require('./db/conn.js')
const port = 3000;

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));

conn.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`O servidor está rodando na porta: ${port}`);
        });
    })
    .catch((error) => console.log(`Ocorreu um erro ao sincronizar o banco de dados: ${error}`));