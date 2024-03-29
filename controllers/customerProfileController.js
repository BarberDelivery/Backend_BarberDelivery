const { compare } = require("bcrypt");
const { encodeToken } = require("../helpers/jwt");
const { Customer, Barber, Item, Transaction, Chat } = require("../models/index");
class CustomerProfileController {
  static async register(req, res, next) {
    // res.status(201).json("Berhasil");
    try {
      const { username, email, password } = req.body;
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

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "email-required" };
      }

      if (!password) {
        throw { name: "password-required" };
      }

      let customerLogin = await Customer.findOne({
        where: {
          email: email,
        },
      });
      // console.log(customerLogin.password, "llll");

      if (!customerLogin) {
        throw { name: "invalid-login" };
      }

      let compareResult = await compare(password, customerLogin.password);
      console.log(compareResult);
      if (!compareResult) {
        console.log("masuk");
        throw { name: "invalid-login" };
      }
      console.log("lewat");
      // const { id } = customerLogin;
      let access_token = encodeToken({
        id: customerLogin.id,
      });
      // console.log(token);
      let sendUsernameForClient = customerLogin.username;

      res.status(200).json({
        access_token,
        sendUsernameForClient,
      });
      // res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = CustomerProfileController;
