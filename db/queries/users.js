// Users represents a table "users" in database
class Users {
  // insert inserts user into database
  insert() {
    return `INSERT INTO public."users" (email, first_name, last_name, avatar)
        VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING
        RETURNING *;`;
  }
  getByFirstName() {
    return `SELECT * FROM public."users" WHERE first_name=$1;`;
  }
  getByLastName() {
    return `SELECT * FROM public."users" WHERE last_name=$1;`;
  }
  getByFullName() {
    return `SELECT * FROM public."users" WHERE first_name=$1 AND last_name=$2;`;
  }
}

module.exports = new Users();
