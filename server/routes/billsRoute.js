const express = require("express");
const {
    addBillsController, getBillsController
} = require("./../controllers/billsController");

const router = express.Router();

//routes
//MEthod - POST
router.post("/add-bills", addBillsController);

//MEthod - GEt
router.get("/get-bills", getBillsController);

module.exports = router;