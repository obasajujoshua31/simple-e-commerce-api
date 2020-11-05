const Product = require("../../db/models/product");
const logger = require("../../pkg/logger");
const {
  createdResponse,
  notFound,
  sendNoContent,
  successResponse,
} = require("../responses");
const {
  tryHandler,
  requestPaginationQuery,
  paginationOption,
} = require("./helper");

// Helper map to remove created_by if user is a client
const restrictedFieldsMap = {
  client: "-created_by",
  admin: "",
};

/**
 * @description This is  responsible for creating new product.
 * This handler is only available for admin role
 * it will create a new product record in the database
 * @param  {Request} req - request object
 * @param {Response} res - response object
 */
module.exports.createProduct = tryHandler(async (req, res) => {
  const {
    body: { name, description, price },
    user: { decodedToken },
  } = req;

  const product = await Product.create({
    name,
    description,
    price,
    created_by: decodedToken._id,
  });

  logger.info("created new product record ...");
  return createdResponse(res, { product: product._doc });
});

/**
 * @description This is responsible for deleting product by id
 * This handler is only available to admin
 * It will get the product doc object from the request and
 * delete the product instance.
 * @param  {Request} req
 * @param  {Response} res
 */
module.exports.deleteProduct = tryHandler(async (req, res) => {
  const { product } = req;

  await product.deleteOne();
  return sendNoContent(res);
});

/**
 * @description This is responsible for updating product details by id
 * This handler is only available to admin
 * It will get the product doc object from the request and
 * update the product instance from the data coming from request body
 * @param  {Request} req
 * @param  {Response} res
 */
module.exports.updateProduct = tryHandler(async (req, res) => {
  const { product } = req;

  const updatedProduct = await product.updateProduct(req.body);
  logger.info("product updated successfully ...");
  return successResponse(res, { product: updatedProduct });
});

/**
 * @description This is responsible for getting product details by id
 * It will include the created_by user object along with the product object
 * It will remove created_by object if the role of the user is client
 * @param  {Request} req
 * @param  {Response} res
 */
module.exports.getProductDetails = tryHandler(async (req, res) => {
  const {
    params: { id },
    user: { decodedToken },
  } = req;

  // restrict non admin users from viewing created_by fields
  const product = await Product.findById(id)
    .populate("created_by", "-password")
    .select(restrictedFieldsMap[decodedToken.role]);

  if (!product) {
    logger.warn("product not found ..");
    return notFound(res, "product is not found");
  }

  logger.info("product details found successfully ...");
  return successResponse(res, { product });
});

/**
 * @description This is responsible for getting all products
 * It will paginate the products that is returned.
 * It will remove created_by if the role of the user is client
 * @param  {Request} req
 * @param  {Response} res
 */
module.exports.getAllProducts = tryHandler(async (req, res) => {
  const {
    user: { decodedToken },
  } = req;

  const { limit, offset } = requestPaginationQuery(req);


  // restrict non admin users from viewing created_by fields
  let products = Product.find({})
    .select(restrictedFieldsMap[decodedToken.role])
    .skip(offset)
    .limit(limit)
    .exec();

  let productCount = Product.countDocuments({}).exec();

  [products, productCount] = await Promise.all([products, productCount]);

  const pageOptions = paginationOption(req, productCount);

  return successResponse(res, { products, ...pageOptions });
});
