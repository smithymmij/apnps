const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const Usuario = require('./model/usuario');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', async function (req, res) {
    res.render('index.ejs', {});
});

app.get('/add', function (req, res) {
    res.render('adiciona.ejs');
});

app.post('/add', async function (req, res) {
    try {
        const usuario = new Usuario({
            nome: req.body.txtNome,
            email: req.body.txtEmail,
            senha: req.body.txtSenha,
            foto: req.body.txtFoto
        });
        await usuario.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

app.listen(3000, function () {
    console.log("Conexão inicializada");
});
