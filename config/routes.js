const adController = require("../controllers/adController");
const authController = require("../controllers/authController");
const defaultController = require("../controllers/defaultController");
const homeController = require("../controllers/homeController")

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/ad', adController);
    app.all('*', defaultController);
};