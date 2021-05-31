const pool = require("./postgres");
const users = require("./queries/users");

// User is an interface for interacting with database users
class User {
  // createMany creates many users in database
  async createMany(usersList) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      usersList.forEach(async (i) => {
        await client.query(users.insert(), [
          i.email,
          i.first_name,
          i.last_name,
          i.avatar,
        ]);
      });

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(error);
    } finally {
      client.release();
    }
  }

  // findByFirstName searches db and if user with such first name exists,
  // then it's returned
  async findByFirstName(firstName) {
    const client = await pool.connect();
    try {
      const u = await client.query(users.getByFirstName(), [firstName]);

      return u;
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  }

  // findByLastName searches db and if user with such last name exists,
  // then it's returned
  async findByLastName(lastName) {
    const client = await pool.connect();
    try {
      const u = await client.query(users.getByLastName(), [lastName]);

      return u;
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  }

  // findByFullName searches db and if user with such first name and last name exists,
  // then it's returned
  async findByFullName(firstName, lastName) {
    const client = await pool.connect();
    try {
      const u = await client.query(users.getByFullName(), [
        firstName,
        lastName,
      ]);

      return u;
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  }
}

module.exports = new User();
