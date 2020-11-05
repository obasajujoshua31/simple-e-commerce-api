const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const {
  BADREQUEST,
  CREATED,
  OK,
  NOCONTENT,
} = require("../../api/constants/constants");
const app = require("../../app");
const getLoginToken = require("./util");

chai.use(chaiHttp);

const baseUrl = "/auth";
const signUpUrl = `${baseUrl}/signup`;
const signInUrl = `${baseUrl}/signin`;
const signOutUrl = `${baseUrl}/signout`;

describe("Auth Routes", () => {
  describe("/auth/signup", () => {
    it("should return bad request with invalid data", async () => {
      const response = await chai.request(app).post(signUpUrl);
      expect(response.status).to.equal(BADREQUEST);
    });

    it("should signup successfully with good request body", async () => {
      const response = await chai.request(app).post(signUpUrl).send({
        name: "joshua",
        username: "joshua",
        password: "password",
        lastname: "lastname",
        age: 45,
      });

      expect(response.status).to.eq(CREATED);
      expect(response.body.expiresIn).to.eq("24h");
    });

    it("should return 409 for signup for existing user", async () => {
      const response = await chai.request(app).post(signUpUrl).send({
        name: "joshua",
        username: "joshua",
        password: "password",
        lastname: "lastname",
        age: 45,
      });

      expect(response.status).to.eq(409);
    });
  });

  describe("/auth/signin", () => {
    it("should return bad request with invalid data", async () => {
      const response = await chai.request(app).post(signInUrl);
      expect(response.status).to.equal(BADREQUEST);
    });

    it("should signin successfully with good request body", async () => {
      const response = await chai.request(app).post(signInUrl).send({
        username: "joshua",
        password: "password",
      });

      expect(response.status).to.eq(OK);
      expect(response.body.expiresIn).to.eq("24h");
    });

    it("should return 400 for invalid login credentials(good username bad password)", async () => {
      const response = await chai.request(app).post(signInUrl).send({
        username: "joshua",
        password: "pass",
      });

      expect(response.status).to.eq(400);
      expect(response.text).to.eq("invalid login credentials");
    });

    it("should return 400 for invalid login credentials(bad username", async () => {
      const response = await chai.request(app).post(signInUrl).send({
        username: "josh",
        password: "password",
      });

      expect(response.status).to.eq(400);
      expect(response.text).to.eq("invalid login credentials");
    });
  });

  describe("/auth/signout", () => {
    let token;
    it("should return 401 for request without token", async () => {
      const response = await chai.request(app).get(signOutUrl);
      expect(response.status).to.equal(401);
    });

    it("should signout successfully", async () => {
      token = await getLoginToken("joshua", "password");
      const response = await chai
        .request(app)
        .get(signOutUrl)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).to.eq(NOCONTENT);
    });

    it("should return 401  when user has already signout when attempting to signout again", async () => {
      const response = await chai
        .request(app)
        .get(signOutUrl)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).to.eq(401);
    });
  });
});
