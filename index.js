const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();
const conn = require('./db/conn.js')

// Models
const Tought = require('./models/Tought.js');
const User = require('./models/User.js');

//Routes
const thoughtsRoutes = require('./routes/toughtsRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

// import Controller
const ToughtController = require('./controllers/ToughtController.js');

const port = 3000;

// session middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
);

// set session to response
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }
    next();
});

// flash messages
app.use(flash());

// configurando handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// receber resposta do body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));

app.use('/toughts', thoughtsRoutes);
app.use('/', authRoutes);

app.get('/', ToughtController.showToughts);

conn.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`O servidor está rodando na porta: ${port}`);
        });
    })
    .catch((error) => console.log(`Ocorreu um erro ao sincronizar o banco de dados: ${error}`));