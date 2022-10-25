const { model, Schema, Types } = require('mongoose');

const EMAIL_PATTERN = /^[A-Za-z]+@[a-zA-z]+\.[a-zA-Z]+$/i;
//TODO
const userSchema = new Schema({
    email: { type: String, validate: {
        validator: (value) => (EMAIL_PATTERN.test(value)),
        message: 'Invalid Email' 
    }},
    skills: { type: String, maxLength: [40, 'Description of skils can be maximum 40 charakters long'], required: true},
    ads: { type: [Types.ObjectId], default: [], ref: 'Ad'},
    hashedPassword: { type: String, required: true }
});

userSchema.index({ email : 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;