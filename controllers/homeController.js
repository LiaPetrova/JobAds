//TODO replace

const { getThree } = require('../services/adService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    
    const ads = await getThree();
    console.log(ads);
    res.render('home', {
        title: 'Home',
        ads
    });
});

module.exports = homeController;