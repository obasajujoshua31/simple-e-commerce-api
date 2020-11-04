const Product = require("../../db/models/product");
const { tryHandler } = require("../controllers/helper");
const { notFound } = require("../responses");


/**
 * @description This is responsible for searching for product by id, 
 * it will add product to the request obejct id coming from params
 * @param  {Response} res - response object
 * @param  {NextFunction} next - next function
 * @param {Request} req - request object
 */
module.exports.findProduct = tryHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return notFound(res, "product cannot be found");
  }

  req.product = product;
  return next();
});
