const express = require("express");
const customerMainController = require("../controllers/customerMainController");
const CustomerProfileController = require("../controllers/customerProfileController");
const { customerAuthentication } = require("../middleware/customersAuth");
const router = express();
const multer = require("multer");
const upload = multer({ dest: "./public/uploads/" });

const token_payment = "js9s8fd9sdf994ijn7ydf";

router.post("/register", CustomerProfileController.register);
router.post("/login", CustomerProfileController.login);

router.post(`/success-payment`, customerMainController.successPaymentCb);
// router.get(`failed-payment/:transactionId`, customerMainController.failedPaymentCb);

router.use(customerAuthentication);
router.get("/detail", customerMainController.getCustomerById); //
router.post(
  "/upload-image",
  upload.single("image"),
  customerMainController.uploadImage
); //
router.get("/order/services", customerMainController.getAllService);
router.get("/order/barber", customerMainController.getAllBarber);
router.get("/order/barber/:barberId", customerMainController.getBarberById);
router.get("/order/transaction", customerMainController.getAllTransaction);
router.post("/order/transaction", customerMainController.postTransaction);
router.get(
  "/order/transaction/:transactionId",
  customerMainController.getTransactionById
);
router.patch("/order/payment", customerMainController.successPayment);
router.patch("/rate", customerMainController.rateBarber);
router.get("/order/schedule", customerMainController.getAllSchedule);
router.get("/catalogue", customerMainController.getAllCatalogue);
router.post(
  "/payment/:transactionId",
  customerMainController.paymentByCustomerId
); 

module.exports = router;
