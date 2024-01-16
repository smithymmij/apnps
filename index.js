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

// Rota inicial
app.get('/', async function (req, res) {
    try {
        const usuarios = await Usuario.find({}).exec();
        res.render('index.ejs', { Usuarios: usuarios });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

// Rota para exibir o formulário de adição de usuário
app.get('/add', function (req, res) {
    res.render('adiciona.ejs');
});

// Rota para processar a adição de um novo usuário
app.post('/add', async function (req, res, next) {
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
        next(err);
    }
});

// Rota para deletar um usuário
app.get('/del/:id', async function(req, res, next) {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

// Rota para editar um usuário
app.get('/edit/:id', async function(req, res, next) {
    try {
        const usuario = await Usuario.findById(req.params.id).exec();
        res.render('edita.ejs', { Usuario: usuario });
    } catch (err) {
        next(err);
    }
});

// Rota para processar a edição de um usuário
app.post('/edit/:id', async function (req, res) {
    try {
        const updatedUsuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            {
                nome: req.body.txtNome,
                email: req.body.txtEmail,
                senha: req.body.txtSenha,
                foto: req.body.txtFoto
            },
            { new: true }
        ).exec();

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erro interno do servidor');
});

// Inicialização do servidor
app.listen(3000, function () {
    console.log("Conexão inicializada");
});
