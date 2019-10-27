const bcrypt = require("bcryptjs");
const { User, validateLogin, validateRegister } = require("../models/User");

// register user api end point
exports.registerUser = async (req, res) => {
  const { name, username, email, password, isAdmin } = req.body;
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  let user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .json({ success: false, msg: "User already exists." });
  user = new User({
    name,
    username,
    email,
    password,
    isAdmin
  });
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  return res.json({ success: true, msg: "registration successful" });
};

// Login user api end point
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, msg: "Invalid email or password" });
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ success: false, msg: "Invalid email or password" });
  const token = user.generateAuthToken();
  return res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .json({ success: true, msg: "login successful." });
};
