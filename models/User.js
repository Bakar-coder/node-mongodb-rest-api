const mongoose = require("mongoose"),
  Joi = require("joi"),
  config = require("config"),
  Jwt = require("jsonwebtoken"),
  Schema = mongoose.Schema,
  userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, min: 3 },
    email: { type: String, required: true, unique: true, toLowerCase: true },
    avatar: String,
    password: { type: String, required: true, min: 8, max: 16 },
    isAdmin: { type: Boolean, default: false }
  });

const validateRegister = user => {
  const schema = {
    name: Joi.string().required(),
    username: Joi.string()
      .required()
      .min(3),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8)
      .max(16),
    isAdmin: Joi.boolean()
  };

  return Joi.validate(user, schema);
};

const validateLogin = user => {
  const schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  };

  return Joi.validate(user, schema);
};

userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    isAdmin: this.isAdmin
  };

  return Jwt.sign(payload, config.get("jwtPrivateKey"), { expiresIn: 3600 });
};

userSchema.methods.addToCart = function(product) {};

exports.User = mongoose.model("User", userSchema);
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;
