const { Schema, model, Document: MongoDocument } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

/**
 * @description This is instance method of update a particular product. 
 * It will only update the fields that are defined in the payload
 * @param  {object} payload - object including name, description and price.
 * @returns {MongoDocument} - mongo document updated instance
 */
productSchema.methods.updateProduct = async function ({
  name,
  description,
  price,
}) {
  if (name) this.name = name;

  if (description) this.description = description;

  if (price) this.price = price;

  await this.save();

  return this;
};

module.exports = model("Product", productSchema);
