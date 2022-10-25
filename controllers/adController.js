const { hasUser } = require('../middlewares/guards');
const { createAd, getAll } = require('../services/adService');
const { parseError } = require('../util/parser');

const adController = require('express').Router();

adController.get('/catalog', async (req, res) => {

    const ads = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        ads
    });
});

adController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Job Ad'
    });
});

adController.post('/create', hasUser(), async (req, res) => {
    const ad = req.body;

    try {

        ad.owner = req.user._id;
        await createAd(ad);
        res.redirect('/ad/catalog');
    } catch (error) {
        res.render('create', {
            title: 'Create Job Ad',
            ad,
            errors: parseError(error)
        });
    }
});



module.exports = adController;