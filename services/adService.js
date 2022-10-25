const Ad = require("../models/Ad");

async function getThree () {
    return Ad.find({}).limit(3).lean();
}

async function getAll () {
    return Ad.find({}).lean();
}

async function getById (id) {
    return Ad.findById(id).lean();
}

async function getByIdRaw (id) {
    return Ad.findById(id);

}

async function createAd(ad) {
    return Ad.create(ad);
}

module.exports = {
    getThree,
    getAll,
    getById,
    getByIdRaw,
    createAd
}