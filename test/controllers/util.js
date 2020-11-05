const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app");

chai.use(chaiHttp);

const getLoginToken = async (username, password) => {
  const response = await chai
    .request(app)
    .post(`/auth/signin`)
    .send({ username, password });

  return response.body.token;
};

module.exports = getLoginToken;
