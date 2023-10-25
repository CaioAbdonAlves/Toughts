const User = require('../models/User.js');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
    
    static login(req, res) {
        res.render('auth/login')
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
    }
}