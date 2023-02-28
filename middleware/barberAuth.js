const { decodeToken } = require("../helpers/jwt");
const { Barber } = require("../models/index");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "invalid-token" };
    }

    const dataToken = decodeToken(access_token);

    const dataBarber = await Barber.findByPk(dataToken.id);

    if (!dataBarber) {
      throw { name: "invalid-token" };
    }

    req.barber = dataBarber;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { authentication };
