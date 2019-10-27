const { Product, validateProduct } = require("../../models/Product");


exports.addProduct = async (req, res) => {
  if (!req.user.isAdmin)
    return res
      .status(400)
      .json({ success: false, msg: "Access denied, Admins only." });

  const { title, description, price } = req.body;
  const { image } = req.files;

  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  if (!image)
    return res
      .status(400)
      .json({ success: false, msg: "Image field is not allowed empty!" });

  const maxSize = 1024 * 1024;

  if (image.size > maxSize)
    return res.status(400).json({
      success: false,
      msg: "Image size must be less than or equal to 1mb."
    });

  if (
      image.mimetype !== "image/png" &&
      image.mimetype !== "image/jpg" &&
      image.mimetype !== "image/jpeg"
  )
    return res
        .status(400)
        .json({ success: false, msg: "Unsupported file upload." });

  image.name = `${Date.now()}-${image.name}`;

  let product = await Product.findOne({ title });
  if (product)
    return res
      .status(400)
      .json({ success: false, msg: "product already exists.", product });

  await image.mv(`./uploads/images/products/${image.name}`);

  product = new Product({
    title,
    description,
    price,
    image: image.name,
    user: req.user.id
  });

  await product.save();
  res.json({ success: true, msg: "add product successfully." });
};
