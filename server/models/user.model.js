const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const config = require("../config/db.config");

const UserSchema = mongoose.Schema({
    email: { type: String, required:true, unique:true },
    name: { type: String, required:true },
    password: { type: String },
    createdAt:  { type: String, default: Date.now() }
});
UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}
UserSchema.methods.generateJWT = function () {
	const today = new Date(); 
	const expirationDate = new Date(today);
	expirationDate.setDate(today.getDate() + 60);
	return jwt.sign({
		email:this.email,
		id:this._id,
		exp:parseInt(expirationDate.getTime()/1000, 10),
	}, config.secret);
}

//User.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);