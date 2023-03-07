const { compare } = require("bcrypt");
const { encodeToken } = require("../helpers/jwt");
const { Customer, Barber, Item, Transaction, Service, ServicesTransaction, Schedule } = require("../models/index");

class barberMainController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      //   console.log(email, "<<<<<<<<<<<<<<<");

      if (!email) {
        throw { name: "email-required" };
      }

      if (!password) {
        throw { name: "password-required" };
      }

      let barberLogin = await Barber.findOne({
        where: {
          email: email,
        },
      });

      if (!barberLogin) {
        throw { name: "invalid-login" };
      }

      let barberResult = await compare(password, barberLogin.password);
      if (!barberResult) {
        throw { name: "invalid-login" };
      }

      // const { id } = customerLogin;
      let access_token = encodeToken({
        id: barberLogin.id,
      });
      // console.log(token);
      let sendUsernameForBarber = barberLogin.username;

      res.status(200).json({
        access_token,
        sendUsernameForBarber,
      });
      // res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  // BARBER
  static async patchActivityStatus(req, res, next) {
    try {
      const { activityStatus } = req.body;

      await Barber.update(
        {
          activityStatus,
        },
        {
          where: {
            id: req.barber.id,
          },
        }
      );

      res.status(201).json({ message: "Success Updated Activity Status" });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  //   TRANSACTION
  static async getAllTransaction(req, res, next) {
    try {
      const transactions = await Transaction.findAll({
        where: {
          BarberId: req.barber.id,
        },
      });

      res.status(200).json(transactions);
    } catch (err) {
      next(err);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      let { transactionId } = req.params;

      const transactionById = await Transaction.findOne({
        where: {
          id: transactionId,
          BarberId: req.barber.id,
        },
        include: [{ model: Customer, attributes: { exclude: ["password"] } }],
      });

      if (!transactionById) {
        throw { name: "data-not-found" };
      }

      res.status(200).json(transactionById);
    } catch (err) {
      next(err);
    }
  }

  static async patchTransactionStatus(req, res, next) {
    try {
      let { transactionId } = req.params;
      const { status } = req.body;

      const dataTrasaction = await Transaction.findOne({
        where: {
          id: transactionId,
        },
      });

      if (!dataTrasaction) {
        throw { name: "data-not-found" };
      }

      const changeStatusTransaction = await Transaction.update(
        {
          status,
        },
        {
          where: {
            id: transactionId,
            BarberId: req.barber.id,
          },
        }
      );

      res.status(201).json({ message: "Success Change Status Transaction" });
    } catch (err) {
      next(err);
    }
  }

  //   SHEDULES

  static async getSchedule(req, res, next) {
    try {
      const schedules = await Schedule.findAll({
        where: { BarberId: req.barber.id, status: "unfinished" },
      });
      res.status(200).json(schedules);
    } catch (err) {
      next(err);
    }
  }

  static async patchSchedule(req, res, next) {
    try {
      const { scheduleId } = req.params;
      const { status } = req.body;
      const findSchedules = await Schedule.findOne({
        where: {
          id: scheduleId,
          BarberId: req.barber.id,
        },
      });
      // console.log(scheduleId);
      if (!findSchedules) {
        throw { name: "data-not-found" };
      }

      const updatedSchedule = await Schedule.update(
        {
          status,
        },
        {
          where: {
            id: scheduleId,
            BarberId: req.barber.id,
          },
        }
      );

      res.status(201).json({ message: "Success Updated Schedule Status" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = barberMainController;
