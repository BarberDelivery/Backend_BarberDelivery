function errorHandler(err, req, res, next) {
  if (err.name === "username-required") {
    res.status(401).json({ message: "Username Required" });
  } else if (err.name === "email-required") {
    res.status(401).json({ message: "Email Required" });
  } else if (err.name === "password-required") {
    res.status(401).json({ message: "Password Required" });
  } else if (err.name === "email-notNull") {
    res.status(401).json(err.message);
  } else if (err.name === "password-notNull") {
    res.status(401).json(err.message);
  } else if (err.name === "image-notNull") {
    res.status(400).json(err.message);
  } else if (err.name === "SequelizeValidationError") {
    let errorData = err.errors.map((el) => {
      return el.message;
    });
    res.status(400).json({ message: errorData });
  } else if (err.name === "data-not-found") {
    res.status(404).json({
      message: "Data not found",
    });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    let errorUniqueEmail = err.errors[0].message;
    res.status(400).json({
      message: errorUniqueEmail,
    });
  } else if (err.name === "not-double-barber") {
    res.status(400).json({
      message: "This barber Has Been In Your Favorite List",
    });
  } else if (err.name === "forbidden") {
    res.status(403).json({ message: "This action is only for the admin role" });
  } else if (err.name === "invalid-login") {
    res.status(401).json({ message: "Email/Password Invalid" });
  } else if (err.name === "invalid-token" || err.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Invalid Token" });
  } else {
    res.status(500).json({
      message: "Fixing 500 Internal Server Error Problems on Your Own Site",
    });
  }
}
// err.message = File too big

module.exports = errorHandler;
