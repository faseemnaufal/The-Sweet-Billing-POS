const billModel = require("./../models/billModel");



// //add items
const addBillsController = async (req, res) => {
  try {
    const newBill = new billModel(req.body);
    await newBill.save();
    res.status(201).send("Bill Created Successfully!");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//get bills data
const getBillsController = async (req, res) => {
  try {
    const bills = await billModel.find();
    res.status(200).send(bills);
  } catch (error) {
    console.log(error);
  }
};



module.exports = {addBillsController, getBillsController};