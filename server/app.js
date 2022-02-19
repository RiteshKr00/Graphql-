const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
require("dotenv").config();

//DB
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//to connect to database
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});
mongoose.connection.on("error", () => {
  console.log("error connecting to mongo");
  //exit
  process.exit(1);
});

async function startserver() {
  const app = express();

  const server = new ApolloServer({
    modules: [require("./graphQl/seller")],
  });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}
startserver();

