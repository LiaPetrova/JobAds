const Ad = require("../models/Ad");
const User = require("../models/User");

async function getThree () {
    return Ad.find({}).limit(3).lean();
}

async function getAll () {  
    return Ad.find({}).lean();
}

async function getById (id) {
    return Ad.findById(id).populate('owner').populate('candidates').lean();
}

async function getByIdRaw (id) {
    return Ad.findById(id);

}

async function createAd(ad) {
    return Ad.create(ad);
}

async function editAd(adId, data) {
    const existing = await Ad.findById(adId);

    existing.headline = data.headline;
    existing.location = data.location;
    existing.companyName = data.companyName;
    existing.companyDescription = data.companyDescription;

    return existing.save();
}

async function deleteAd (adId) {
    return Ad.findByIdAndRemove(adId);
}

async function apply(userId, adId) {
    const ad = await Ad.findById(adId);
    ad.candidates.push(userId);
    ad.candidatesCount++;

    await ad.save();
}

async function getByEmail (email) {
    email = new RegExp(email, 'i');
    const user = await User.find({ 'email': email });

    return Ad.find({ 'owner' : user }).lean();
}

module.exports = {
    getThree,
    getAll,
    getById,
    getByIdRaw,
    createAd,
    editAd,
    deleteAd,
    apply,
    getByEmail
}