const { isGuest, hasUser } = require('../middlewares/guards');
const { register, verifyToken, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router();

authController.get('/register', isGuest (), (req, res) => {
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', isGuest(), async (req, res) => {
    try {

        if(req.body.email == '' || req.body.password == '' || req.body.skills == '') {
            throw new Error ('All fields are required');
        }

        if(req.body.password.length < 5) {
            throw new Error ('Password must be at least 5 characters long');
        }

        if(req.body.password !== req.body.rePassword) {
            throw new Error ('Passwords don\'t match');
        }
    
        const token = await register(req.body.email, req.body.skills, req.body.password);

        //TODO check if register creates session 
        res.cookie('token', token);
        res.redirect('/');
    } catch(error) {
        const errors = parseError(error);
        // TODO error display and replace with actual template
        res.render('register', {
            title: 'Register Page',
            email: req.body.email,
            skills: req.body.skills,
            errors
        })

    }
});

authController.get('/login', isGuest(), (req, res) => {
    // TODO error display and replace with actual template
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login', isGuest(), async (req, res) => {

    try {
        if(req.body.email == '' || req.body.password == '') {
            throw new Error ('All fields are required');
        }
        const token = await login(req.body.email, req.body.password);
        res.cookie('token', token);
        res.redirect('/');

    }catch(error) {

        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            email: req.body.email,
            errors
        }); 
    }
});

authController.get('/logout', hasUser(), (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})


module.exports = authController;