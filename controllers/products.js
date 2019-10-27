const { Product } = require("../models/Product");

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.updateProduct = async (req, res) => {
  const { title, description, price } = req.body;
  const productFields = {};
  if (title) productFields.title = title;
  if (description) productFields.description = description;
  if (price) productFields.price = price;

  let product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ success: false, msg: "Product not found." });

  if (product.user.toString() !== req.user.id)
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorized access." });

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: productFields
    },
    { new: true }
  );

  res.json({ success: true, msg: "updated product successfully.", product });
};

exports.deleteProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ success: false, msg: "Product not found." });

  if (product.user.toString() !== req.user.id)
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorized access." });
  await Product.findByIdAndRemove(req.params.id);
  return res.json({
    success: true,
    msg: "Successfully deleted product"
  });
};
