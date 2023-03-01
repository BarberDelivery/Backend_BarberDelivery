const { compare } = require("bcrypt");
const { encodeToken } = require("../helpers/jwt");
const { Customer, Barber, Item, Transaction, Chat } = require("../models/index");
class CustomerProfileController {
  static async register(req, res, next) {
    // res.status(201).json("Berhasil");
    try {
      const { username, email, password } = req.body;
      console.log(req.body);
      let customerRegisterData = await Customer.create({
        username,
        email,
        password,
      });
      res.status(201).json({ message: "Register Successfully", customerRegisterData });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = CustomerProfileController;
