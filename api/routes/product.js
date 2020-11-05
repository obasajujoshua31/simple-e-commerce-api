const { Router } = require("express");
const { ADMINROLE, ROLE } = require("../constants/constants");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProductDetails,
  getAllProducts,
} = require("../controllers/product");
const { isAdmin, authRole } = require("../middlewares/auth");
const { findProduct } = require("../middlewares/product");
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("../middlewares/validate");

const router = Router();

router
  .route("/")
  .post(authRole(ROLE.ADMIN), validateCreateProduct, createProduct)
  .get(getAllProducts);

router
  .route("/:id")
  .delete(authRole(ROLE.ADMIN), findProduct, deleteProduct)
  .put(authRole(ROLE.ADMIN), validateUpdateProduct, findProduct, updateProduct)
  .get(getProductDetails);

module.exports = router;
