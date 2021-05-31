const axios = require("axios");
const user = require("../db/user");

const apiURL = "https://reqres.in/api/users";

// fetch users from axios api
function fetchUsers() {
  return axios
    .get(apiURL)
    .then((resp) => {
      console.log("getting users list");
      return resp.data.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

// add users from axios api to db
function addUsersToDB(usersList) {
  user.createMany(usersList).catch((err) => {
    throw new Error(err);
  });
}

// start the client and fetch users every 1 minutes,
// then add them to db if they don't exist
module.exports.start = async () => {
  try {
    const usersList = await fetchUsers();
    addUsersToDB(usersList);
  } catch (err) {
    console.log(err);
  }
};
