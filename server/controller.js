const user = require("../db/user");

class Controller {
  async search(req, res) {
    try {
      const { first_name, last_name } = req.query;
      let u;
      if (first_name && last_name) {
        u = await user.findByFullName(first_name, last_name);
      } else if (first_name) {
        u = await user.findByFirstName(first_name);
      } else if (last_name) {
        u = await user.findByLastName(last_name);
      } else {
        throw new Error("Bad Request");
      }

      const users = u.rows;
      res.render("html/user", { users });
    } catch (err) {
      res.render("html/error", { err });
    }
  }
}

module.exports = new Controller();
