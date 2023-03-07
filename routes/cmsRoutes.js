const express = require("express");
const CmsController = require("../controllers/cmsMainController");
const { cmsAuthentication } = require("../middleware/cmsAuth");
const router = express();

router.post("/register", CmsController.register);
router.post("/login", CmsController.login);
router.use(cmsAuthentication);
router.get("/customer", CmsController.getAllCustomer);
router.delete("/customer/:customerId", CmsController.deleteCustomer);
router.patch("/customer/isStudent/:customerId", CmsController.patchCustomerIsStudent);

router.get("/barber", CmsController.getAllBarber);
router.post("/barber", CmsController.postBarber);
router.get("/barber/:barberId", CmsController.getBarberId);
router.put("/barber/:barberId", CmsController.editBarber);
router.delete("/barber/:barberId", CmsController.deleteBarber);

router.get("/catalogue", CmsController.getAllCatalogue);
router.post("/catalogue", CmsController.addCatalogue);
router.delete("/catalogue/:catalogueId", CmsController.deleteCatalogueById);

module.exports = router;
