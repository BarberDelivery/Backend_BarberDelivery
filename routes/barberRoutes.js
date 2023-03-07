const express = require("express");
const barberMainController = require("../controllers/barberMainController");
const { barberAuthentication } = require("../middleware/barberAuth");
const router = express();

router.post("/login", barberMainController.login);

router.use(barberAuthentication);
router.get("/transaction", barberMainController.getAllTransaction); //
router.get("/schedule", barberMainController.getSchedule);
router.get("/transaction/:transactionId", barberMainController.getTransactionById); //
router.patch("/activitystatus", barberMainController.patchActivityStatus);
router.patch("/transaction/:transactionId", barberMainController.patchTransactionStatus);
router.patch("/schedule/:scheduleId", barberMainController.patchSchedule);
router.get("/barber-profile", barberMainController.getBarberById);

module.exports = router;
