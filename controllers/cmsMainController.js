const { compare } = require("bcrypt");
const { encodeToken } = require("../helpers/jwt");
const { Customer, Barber, Item, Transaction, Chat, Admin } = require("../models/index");
class CmsController {
  static async register(req, res, next) {
    // res.status(201).json("Berhasil");
    try {
      const { username, email, password } = req.body;
      console.log(req.body);
      let customerRegisterData = await Admin.create({
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
      const { username, email, password } = req.body;
      console.log(email, "<<<<<<<<<<<<<<<");

      let customerLogin = await Admin.findOne({
        where: {
          username: username,
          email: email,
        },
      });

      if (!customerLogin) {
        throw { name: "invalid-login" };
      }

      let compareResult = compare(password, customerLogin.password);
      if (!compareResult) {
        throw { name: "invalid-login" };
      }

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

  static async getAllCustomer(req, res, next) {
    try {
      const dataCustomer = await Customer.findAll();

      res.status(200).json(dataCustomer);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async patchCustomerIsStudent(req, res, next) {
    try {
      const { customerId } = req.params;
      const patchCustomer = await Customer.update(
        {
          isStudent: true,
        },
        {
          where: {
            id: customerId,
          },
        }
      );
      res.status(201).json({ message: "Update isStudent Successfuly" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteCustomer(req, res, next) {
    try {
      const { customerId } = req.params;
      // console.log(customerId);
      const findCustomerId = await Customer.findOne({
        where: {
          id: customerId,
        },
      });
      console.log(findCustomerId);

      if (findCustomerId) {
        const destroyCustomerId = await Customer.destroy({
          where: {
            id: customerId,
          },
        });
        res.status(200).json({
          message: `${findCustomerId.username} delete successfully`,
        });
      } else {
        throw { name: "data-not-found" };
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async postBarber(req, res, next) {
    try {
      const { username, email, password, yearOfExperience, price, description, longLatBarber, profileImage } = req.body;
      const dataPostBarber = await Barber.create({
        username,
        email,
        password,
        activityStatus: "standBy",
        yearOfExperience,
        rating: 0,
        price,
        description,
        longLatBarber,
        profileImage,
      });
      res.status(201).json(dataPostBarber);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllBarber(req, res, next) {
    try {
      const dataBarber = await Barber.findAll();

      res.status(200).json(dataBarber);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getBarberId(req, res, next) {
    try {
      const { barberId } = req.params;
      const barberById = await Barber.findOne({
        where: {
          id: barberId,
        },
      });

      if (barberById) {
        res.status(200).json(barberById);
      } else {
        throw { name: "data-not-found" };
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async editBarber(req, res, next) {
    try {
      const { barberId } = req.params;
      const { username, email, password, yearOfExperience, price, description, longLatBarber, profileImage } = req.body;
      const dataEditBarber = await Barber.update(
        {
          username,
          email,
          password,
          yearOfExperience,
          price,
          description,
          longLatBarber,
          profileImage,
        },
        {
          where: {
            id: barberId,
          },
          returning: true,
        }
      );
      res.status(201).json(dataEditBarber[1][0]);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteBarber(req, res, next) {
    try {
      const { barberId } = req.params;
      // console.log(barberId);
      const findBarberId = await Barber.findOne({
        where: {
          id: barberId,
        },
      });
      console.log(findBarberId);

      if (findBarberId) {
        const destroybarberId = await Barber.destroy({
          where: {
            id: barberId,
          },
        });
        res.status(200).json({
          message: `${findBarberId.username} delete successfully`,
        });
      } else {
        throw { name: "data-not-found" };
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = CmsController;
