const express = require("express");
const router = express();

// ====== Example of naming variables in routing =======
const customerRoutes = require("./customerRoutes");
const barberRoutes = require('./barberRoutes')
router.use("/customer", customerRoutes);
router.use("/barber", barberRoutes );

module.exports = router;
