const router = require("express").Router(),
  { registerUser, loginUser } = require("../controllers/users");

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

module.exports = router;
