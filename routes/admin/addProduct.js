const router = require("express").Router(),
  auth = require("../../middlewares/auth"),
  { addProduct } = require("../../controllers/admin/addProduct");

router.route("/add-product").post(auth, addProduct);

module.exports = router;
