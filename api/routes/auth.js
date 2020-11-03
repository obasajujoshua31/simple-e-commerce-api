const { Router } = require("express");
const { validateSignup, validateLogin } = require("../middlewares/validate");
const { signUpUser, loginUser } = require("../controllers/auth");

const router = Router();

router.post("/signup", validateSignup, signUpUser);
router.post("/signin", validateLogin, loginUser);

module.exports = router;
