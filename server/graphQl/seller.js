const { gql } = require("apollo-server-express");
const Product = require("../models/product.model");
const Seller = require("../models/seller.model");
exports.typeDefs = gql`
  extend type Query {
    getAllSeller: [Seller]
    getseller(id: String!): Seller
  }

  type Seller {
    id: String!
    sellername: String
    product: [Product]
  }
  type Product {
    id: String!
    productname: String
    price: Int
  }
  # Mutation
  type Mutation {
    createSeller(sellername: String, product: [String!]): Seller
    updateSeller(id: String, name: String): Seller
    addProduct(id: String, product: [String!]): Seller
    addNewProduct(
      id: String
      newProductName: String!
      newProductPrice: Int!
    ): Seller
  }
`;

exports.resolvers = {
  Query: {
    getAllSeller: async () => {
      const seller = await Seller.find();
      return seller;
    },
    getseller: async (par, args, context, info) => {
      console.log(args.id);
      const seller = await Seller.findById(args.id).populate("product");
      console.log(seller);
      return seller;
    },
  },
  Mutation: {
    createSeller: async (par, args, ctx, info) => {
      const { sellername, product } = args;
      const seller = new Seller({ sellername, product });
      await seller.save();
      return seller;
    },
    updateSeller: async (par, args, ctx, info) => {
      const { id, name } = args;
      const seller = await Seller.findByIdAndUpdate(id, { sellername: name });
      return seller;
    },
    //already created Product-Add by Id
    addProduct: async (par, args, ctx, info) => {
      const { id, product } = args;
      const seller = await Seller.findByIdAndUpdate(
        id,
        {
          $push: {
            product: {
              $each: product,
            },
          },
        },
        { new: true }
      );
      return seller;
    },
    //add new product by name and Price
    addNewProduct: async (par, args, ctx, info) => {
      const { id, product, newProductName, newProductPrice } = args;
      const newProduct = await new Product({
        productname: newProductName,
        price: newProductPrice,
      }).save();
      const newProductId = newProduct._id;
      console.log(newProduct._id);
      const seller = await Seller.findByIdAndUpdate(
        id,
        {
          $push: {
            product: newProductId,
          },
        },
        { new: true }
      );
      console.log(seller);
      return seller;
    },
  },
};
