const { hasUser, isOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');
const { createAd, getAll, getById, apply, editAd, deleteAd, getByEmail } = require('../services/adService');
const { parseError } = require('../util/parser');

const adController = require('express').Router();

adController.get('/catalog', async (req, res) => {

    const ads = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        ads
    });
});

adController.get('/:id/details', async (req, res) => {

    const ad = await getById(req.params.id);
    ad.isOwner = ad.owner._id.toString() == req.user?._id.toString();
    ad.hasApplied = ad.candidates.some(c => c._id.toString() == req.user?._id.toString());

    res.render('details', {
        title: ad.headline,
        ad
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

adController.get('/:id/edit', preload(true), isOwner(), async (req, res) => {
    const ad = res.locals.ad;
    
    res.render('edit', {
        title: `Edit ${ad.headline}`,
        ad
    });
});

adController.post('/:id/edit', preload(), isOwner(), async (req, res) => {
    
    const ad = req.body;

    try {
        await editAd(req.params.id, ad);
        res.redirect(`/ad/${req.params.id}/details`);

    } catch (error) {
        ad._id = req.params.id;
        res.render('edit', {
        title: `Edit ${ad.headline}`,
        errors: parseError(error),
        ad
    });
    }
    
});

adController.get('/:id/delete', preload(), isOwner(), async (req, res) => {

    await deleteAd(req.params.id);
    res.redirect('/ad/catalog');
});

adController.get('/:id/apply', hasUser(), preload(true), async (req, res) => {
    const ad = res.locals.ad;

    try {

        if(ad.candidates.some(c => c._id == req.user._id)) {
            ad.hasApplied = true;
            throw new Error('You cannot apply for the same Job twice');
        }

        if(ad.owner._id == req.user._id) {
            ad.isOwner = true;
            throw new Error('You cannot apply for your own Job');
        }

        await apply(req.user._id, ad._id);
        res.redirect(`/ad/${ad._id}/details`);

    } catch (error){
        res.render('details', {
            title: ad.headline,
            ad,
            errors: parseError(error)
        });
    }
});

adController.get('/search', hasUser(), async (req, res) => {
    const search = req.query.search;
    const result = await getByEmail(search);
    
    res.render('search', {
        title: 'Search results',
        result
    });
});



module.exports = adController;