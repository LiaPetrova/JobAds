const { model, Schema, Types } = require('mongoose');

const adSchema = new Schema({
    headline: { type: String, minLength: [4, 'Headline must be at least 4 characters long']},
    location: { type: String, minLength: [8, 'Location must be at least 8 characters long']},
    companyName: { type: String, minLength: [3, 'Company name must be at least 3 characters long']},
    companyDescription: { type: String, required: [true, 'Description of the company is required'], maxLength: [40, 'Company description can be maximum characters long']},
    owner: { type: Types.ObjectId, ref: 'User', required: true},
    candidates: { type: [Types.ObjectId], ref: 'User', default: []},
    candidatesCount: { type: Number, default: 0 }
});

const Ad = model('Ad', adSchema);

module.exports = Ad;