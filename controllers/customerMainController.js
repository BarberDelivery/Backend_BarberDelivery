const { Customer, Barber, Item, Transaction, Service, ServicesTransaction, Schedule } = require("../models/index");
const { getDistance } = require("geolib");

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

  static async postTransaction(req, res, next) {
    try {
      const { BarberId, priceBarber, date, servicesId, timeEstimate, longLatCustomer, longLatBarber } = req.body;

      // let loopFindService = [];

      const firstCreateTransaction = await Transaction.create({
        CustomerId: req.customer.id,
        BarberId: BarberId,
        status: "pending",
        cutRating: null,
        totalPrice: null,
        duration: null,
        date: null,
        longLatCustomer: "",
      });

      let loopingIdService = [];

      loopingIdService = servicesId.map((el) => {
        return { ServiceId: +el, TransactionId: firstCreateTransaction.id };
      });

      const newServiceTransaction = await ServicesTransaction.bulkCreate(loopingIdService);
      const getDataService = await ServicesTransaction.findAll({
        where: {
          TransactionId: newServiceTransaction[0].TransactionId,
        },
        include: {
          model: Service,
        },
      });

      // // Calculate Distance
      // console.log(longLatCustomer, "Customer LongLat");
      // console.log(longLatBarber, "Barber LongLat");

      const longLatCust = longLatCustomer.split(",");
      const longLatBar = longLatBarber.split(",");

      const dis = getDistance({ latitude: longLatCust[1], longitude: longLatCust[0] }, { latitude: longLatBar[1], longitude: longLatBar[0] });
      // console.log(dis);
      const priceDistance = Math.floor(dis / 1000) * 7000;
      // console.log(priceDistance, "}}}}}}}}}}}}}}}}}");

      // Calculation For Total Price
      const priceService = getDataService.map((el) => {
        return el.Service.price;
      });

      let sumArrayPrice = priceService.reduce(function (a, b) {
        return a + b;
      }, 0);

      let totalPrice = +sumArrayPrice + +priceBarber + priceDistance;

      // Calculation For Duration
      const durationService = getDataService.map((el) => {
        return el.Service.duration;
      });

      let sumArrayDuration = durationService.reduce(function (a, b) {
        return a + b;
      }, 0);

      let totalDuration = +sumArrayDuration + +timeEstimate;

      const createTransaction = await Transaction.update(
        {
          CustomerId: req.customer.id,
          BarberId: BarberId,
          status: "pending",
          cutRating: null,
          totalPrice: totalPrice,
          duration: totalDuration,
          date: date,
          longLatCustomer: longLatCustomer,
        },
        {
          where: {
            id: getDataService[0].TransactionId,
          },
        }
      );

      // console.log(date);
      const timeConvert = new Date(date);
      const timeConvertEnd = new Date(date);
      timeConvertEnd.setMinutes(timeConvertEnd.getMinutes() + totalDuration);
      console.log(timeConvert);
      console.log(timeConvertEnd);
      console.log("2023-03-07 19:05:00.000 +0700");

      const createSchedule = await Schedule.create({
        BarberId: BarberId,
        timeStart: timeConvert,
        timeEnd: timeConvertEnd,
        status: "unfinished",
      });

      console.log(createSchedule);

      res.status(201).json(createTransaction);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = customerMainController;
