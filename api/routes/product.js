const { Router } = require("express");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProductDetails,
  getAllProducts,
} = require("../controllers/product");
const { isAdmin } = require("../middlewares/auth");
const { findProduct } = require("../middlewares/product");
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("../middlewares/validate");

const router = Router();

router
  .route("/")
  .post(isAdmin, validateCreateProduct, createProduct)
  .get(getAllProducts);

router
  .route("/:id")
  .delete(isAdmin, findProduct, deleteProduct)
  .put(isAdmin, validateUpdateProduct, findProduct, updateProduct)
  .get(getProductDetails);

module.exports = router;
