const express = require("express");
const customerMainController = require("../controllers/customerMainController");
const CustomerProfileController = require("../controllers/customerProfileController");
const { customerAuthentication } = require("../middleware/customersAuth");
const router = express();

router.post("/register", CustomerProfileController.register);
router.post("/login", CustomerProfileController.login);

router.use(customerAuthentication);
router.get("/order/barber", customerMainController.getAllBarber);
router.get("/order/barber/:barberId", customerMainController.getBarberById);
router.get("/order/transaction", customerMainController.getAllTransaction);
router.post("/order/transaction", customerMainController.postTransaction);
router.get("/order/transaction/:transactionId", customerMainController.getTransactionById);
router.patch("/order/payment", customerMainController.successPayment);
router.patch("/rate", customerMainController.rateBarber);
router.get("/catalogue", customerMainController.getAllCatalogue);

module.exports = router;
