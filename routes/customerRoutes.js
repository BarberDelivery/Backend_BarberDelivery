const express = require("express");
const CustomerProfileController = require("../controllers/customerProfileController");
const router = express();

router.post("/register", CustomerProfileController.register);
router.post("/login", CustomerProfileController.login);

module.exports = router;
