const { compare } = require("bcrypt");
const { hash } = require("../helpers/bcrypt");
const { encodeToken } = require("../helpers/jwt");
const { Customer, Barber, Item, Transaction, Chat } = require("../models/index");
const Admin = require("../modelsMongo/adminModel");
const Catalogue = require("../modelsMongo/catalogModel");
class CmsController {
  static async register(req, res, next) {
    // res.status(201).json("Berhasil");
    try {
      const { username, email, password } = req.body;

      // if (!username) {
      //   throw { name: "username-required" };
      // }

      // if (!email) {
      //   throw { name: "email-required" };
      // }

      // if (!password) {
      //   throw { name: "password-required" };
      // }

      // const encrypPass = hash(password);
      // console.log(encrypPass);

      const addDataAdmin = await Admin.addAdmin({
        username,
        email,
        password,
      });

      res.status(201).json({
        _id: addDataAdmin.insertedId,
        username,
        email,
        password,
      });
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, email, password } = req.body;
      console.log(email, "<<<<<<<<<<<<<<<");

      const adminLogin = await Admin.getByUsernameEmail(username, email);
      if (!username) {
        throw { name: "username-required" };
      }

      if (!adminLogin) {
        throw { name: "invalid-login" };
      }

      let compareResult = await compare(password, adminLogin.password);
      if (!compareResult) {
        throw { name: "invalid-login" };
      }
      // console.log(adminLogin._id);
      let access_token = encodeToken({
        id: adminLogin._id,
      });
      // console.log(token);
      let sendUsernameForClient = adminLogin.username;

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
      const dataCustomer = await Customer.findOne({
        where: {
          id: customerId,
        },
      });
      console.log(dataCustomer);

      if (!dataCustomer) {
        throw { name: "data-not-found" };
      }
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
      res.status(200).json({ message: "Update isStudent Successfuly" });
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
          message: `Delete successfully`,
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
      res.status(200).json(dataEditBarber[1][0]);
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

  static async getAllCatalogue(req, res, next) {
    try {
      const dataCatalogue = await Catalogue.getAllCatalogue();
      console.log(dataCatalogue);

      res.status(200).json(dataCatalogue);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async addCatalogue(req, res, next) {
    try {
      const { image } = req.body;
      const addDataAdmin = await Catalogue.addCatalogue({
        image,
      });

      res.status(201).json({
        _id: addDataAdmin.insertedId,
        image,
      });
    } catch (err) {
      console.log(err);

      next(err);
    }
  }

  static async deleteCatalogueById(req, res, next) {
    try {
      const { catalogueId } = req.params;

      const dataCatalogue = await Catalogue.getByCatalogueId(catalogueId);

      if (!dataCatalogue) {
        throw { name: "data-not-found" };
      }

      const deleteCatalogue = await Catalogue.deleteCatalogueById(catalogueId);

      res.status(200).json({ message: "Delete Catalogue Successfuly" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = CmsController;
