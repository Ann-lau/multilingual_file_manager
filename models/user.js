const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
username: String,
password: String,
});
userSchema.methods.hashPassword = function (password) {
return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
userSchema.methods.comparePassword = function (password, hash) {
return bcrypt.compareSync(password, hash);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
