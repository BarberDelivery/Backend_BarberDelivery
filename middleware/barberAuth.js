const { decodeToken } = require("../helpers/jwt");
const { Barber } = require("../models/index");

const barberAuthentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "invalid-token" };
    }
    const dataToken = decodeToken(access_token);

    const dataBarber = await Barber.findByPk(dataToken.id);
    console.log(dataBarber.id, "?????????????????????????????????/");

    if (!dataBarber) {
      throw { name: "invalid-token" };
    }

    req.barber = {
      id: dataBarber.id,
      username: dataBarber.username,
    };

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { barberAuthentication };
