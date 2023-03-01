const express = require("express");
const router = express();

// ====== Example of naming variables in routing =======
const customerRoutes = require("./customerRoutes");
router.use("/customer", customerRoutes);

module.exports = router;
