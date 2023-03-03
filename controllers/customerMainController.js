const { Customer, Barber, Item, Transaction, Chat, ServicesTransantion, Service } = require("../models/index");

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
  static async postTransaction(req, res, next){
    try {
      // let { barberId } = req.params
      let { status, cutRating, totalPrice, duration, date, servicesId  } = req.body

      // const getService = await ServicesTransantion.findOne({
      //   where : {}
      // })
      if(date){

      }

      const newTransaction = await Transaction.create({
        status : 'pending',
        cutRating : null,
        totalPrice : null,
        duration : null,
        date : null
      })

      let looping = [];

      looping = servicesId.map((el) => {
        return { 
          servicesId: el,
          TransactionId : newTransaction.id
         };
      });
      
      const ServiceTransaction = await ServicesTransantion.bulkCreate(looping);

      const getTransaction = await ServicesTransantion.findOne({
        where : {
          TransactionId : newTransaction.id
        }
      })
       // calcukasi harga


      // let ingredientResult = [];
      // if (nameIngredient) {
      //   ingredientResult = nameIngredient.map((el) => {
      //     return {
      //       itemId: newItem.id,
      //       name: el,
      //     };
      //   });
      // }

      // const ingredient = await Ingredient.bulkCreate(ingredientResult, {
      //   transaction: t,
      //   validate: true,
      // });
      // await t.commit();




    } catch (error) {
      
    }
  }
}

module.exports = customerMainController;
