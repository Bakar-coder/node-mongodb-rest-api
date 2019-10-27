const router = require("express").Router(),
  auth = require("../middlewares/auth"),
  {
    getProducts,
    updateProduct,
    deleteProduct
  } = require("../controllers/products");

router.route("/").get(getProducts);
router.route("/update/:id").put(auth, updateProduct);
router.route("/delete/:id").delete(auth, deleteProduct);

module.exports = router;
