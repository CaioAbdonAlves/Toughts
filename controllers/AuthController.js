const User = require('../models/User.js');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
    
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body;

        // find user
        const userExists = await User.findOne({where: {email: email}});

        if(!userExists) {
            req.flash("message", "O usuário informado não existe!");
            res.render('auth/login');
            return;
        }

        // check if passwords match
        const passwordMatch = bcrypt.compareSync(password, userExists.password);

        if(!passwordMatch) {
            req.flash("message", "Senha incorreta!");
            res.render('auth/login');
            return;
        }

        req.session.userid = userExists.id;

        req.flash("message", "Autenticado com sucesso!");

        req.session.save(() => {
            res.redirect('/');
        });
        
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body;

        // password match validation
        if(password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!');
            res.render('auth/register');

            return;
        }

        //check if user exists
        const checkIfUserExists = await User.findOne({where: {email: email}});

        if(checkIfUserExists) {
            req.flash("message", "Já existe um usuário com este e-mail!");
            res.render('auth/register');

            return;
        }

        // create a password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user);

            // initialize session
            req.session.userid = createdUser.id;

            req.flash("message", "Cadastro realizado com sucesso!");

            req.session.save(() => {
                res.redirect('/');
            })
        } catch(error) {
            console.log(`Ocorreu um erro ao registrar o usuário: ${error}`);
        }
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }
}