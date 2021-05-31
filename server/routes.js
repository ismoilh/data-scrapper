const router = require("express").Router();
const controller = require("./controller");

router.get("/search", controller.search);

module.exports = router;
