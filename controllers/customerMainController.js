const { Customer, Barber, Item, Transaction, Chat } = require("../models/index");

class customerMainController {
  static async getAllBarber(req, res, next) {
    try {
      const dataListBarber = await Barber.findAll({
        where: {
          activityStatus: ["cutting", "standby"],
        },
        attributes: { exclude: ["password"] },
      });

      console.log(dataListBarber);
      res.status(200).json(dataListBarber);
    } catch (err) {
      console.log(err);
      next();
    }
  }

  static async getBarberById(req, res, next) {
    try {
      const { barberId } = req.params;
      const dataBarber = await Barber.findOne({
        where: {
          id: barberId,
        },
        attributes: { exclude: ["password"] },
      });

      console.log(dataBarber);
      res.status(200).json(dataBarber);
    } catch (err) {
      console.log(err);
      next();
    }
  }
}

module.exports = customerMainController;
