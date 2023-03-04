const express = require("express");
const router = express();

// ====== Example of naming variables in routing =======
const customerRoutes = require("./customerRoutes");
const barberRoutes = require("./barberRoutes");
const adminRoutes = require("./cmsRoutes");
router.use("/customer", customerRoutes);
router.use("/barber", barberRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
