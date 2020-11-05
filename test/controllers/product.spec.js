const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const {
  BADREQUEST,
  CREATED,
  OK,
  NOCONTENT,
  NOTFOUND,
} = require("../../api/constants/constants");
const app = require("../../app");
const getLoginToken = require("./util");

chai.use(chaiHttp);

const baseUrl = "/products";

describe("Product Routes", async () => {
  let products;
  const adminToken = await getLoginToken("admin", "admin");
  const clientToken = await getLoginToken("client", "client");

  describe("Create products", async () => {
    it("should return 401 with no token", async () => {
      const response = await chai.request(app).post(baseUrl);
      expect(response.status).to.equal(401);
    });

    it("should create product when user is admin", async () => {
      const response = await chai
        .request(app)
        .post(baseUrl)
        .send({
          name: "product",
          description: "product description",
          price: 34,
        })
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).to.eq(CREATED);
      expect(response.body.product.name).to.eq("product");
      expect(response.body.product.price).to.eq(34);
    });

    it("should fail validation with empty price for admin", async () => {
      const response = await chai
        .request(app)
        .post(baseUrl)
        .send({
          name: "product",
          description: "product description",
        })
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).to.eq(BADREQUEST);
    });

    it("should return 404 when user is not admin", async () => {
      const response = await chai
        .request(app)
        .post(baseUrl)
        .send({
          name: "product",
          description: "product description",
          price: 34,
        })
        .set("Authorization", `Bearer ${clientToken}`);

      expect(response.status).to.eq(NOTFOUND);
    });
  });

  describe("Get all products", () => {
    it("should return 401 without token ", async () => {
      const response = await chai.request(app).get(baseUrl);
      expect(response.status).to.equal(401);
    });

    it("should return all products with admin", async () => {
      const response = await chai
        .request(app)
        .get(baseUrl)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).to.eq(OK);
      expect(response.body.products.length).to.eq(1);
      products = response.body.products;
    });

    it("should return all products with client", async () => {
      const response = await chai
        .request(app)
        .get(baseUrl)
        .set("Authorization", `Bearer ${clientToken}`);

      const receivedProd = response.body.products;
      expect(response.status).to.eq(OK);
      expect(receivedProd.length).to.eq(1);
      expect(receivedProd[0].created_by).to.be.undefined;
    });
  });

  describe("Get Product Details", () => {
    it("should return 401 without token ", async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/${products[0]._id}`);

      expect(response.status).to.equal(401);
    });

    it("should return product details with admin", async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/${products[0]._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).to.eq(OK);
      expect(response.body.product.name).to.equal(products[0].name);

      expect(response.body.product.created_by.username).to.equal("admin");
    });

    it("should return product details with client", async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/${products[0]._id}`)
        .set("Authorization", `Bearer ${clientToken}`);

      expect(response.status).to.eq(OK);
      expect(response.body.product.name).to.equal(products[0].name);
      expect(response.body.product.created_by).to.be.undefined;
    });
  });

  describe("Update Product", () => {
    it("should return 401 without token ", async () => {
      const response = await chai
        .request(app)
        .put(`${baseUrl}/${products[0]._id}`);

      expect(response.status).to.equal(401);
    });

    it("should update product  with admin", async () => {
      const response = await chai
        .request(app)
        .put(`${baseUrl}/${products[0]._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "updated product" });

      expect(response.status).to.eq(OK);
      expect(response.body.product.name).to.equal("updated product");
    });

    it("should not update product  with client", async () => {
      const response = await chai
        .request(app)
        .put(`${baseUrl}/${products[0]._id}`)
        .set("Authorization", `Bearer ${clientToken}`)
        .send({ name: "updated product" });

      expect(response.status).to.eq(NOTFOUND);
    });
  });

  describe("Delete Product", () => {
    it("should return 401 without token ", async () => {
      const response = await chai
        .request(app)
        .delete(`${baseUrl}/${products[0]._id}`);

      expect(response.status).to.equal(401);
    });

    it("should not delete product  with client", async () => {
      const response = await chai
        .request(app)
        .delete(`${baseUrl}/${products[0]._id}`)
        .set("Authorization", `Bearer ${clientToken}`);

      expect(response.status).to.eq(NOTFOUND);
    });

    it("should delete product with admin", async () => {
      const response = await chai
        .request(app)
        .delete(`${baseUrl}/${products[0]._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).to.eq(NOCONTENT);
    });

    it("should return not found for deleted product", async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/${products[0]._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).to.eq(NOTFOUND);
    });
  });
});
