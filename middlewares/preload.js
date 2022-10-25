const { getById, getByIdRaw } = require("../services/adService"); //TODO

module.exports = (lean) => async (req, res, next) => {
    if (lean) {
        res.locals.ad = await getById(req.params.id);
    } else {
        res.locals.ad = await getByIdRaw(req.params.id);
    }

    next();
};