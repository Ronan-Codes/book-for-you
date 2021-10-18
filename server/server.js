const path = require('path');
const express = require('express');

// Apollo-GQL related
const { ApolloServer } = require('apollo-server-express')
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const db = require('./config/connection');

// delete at the end
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Apollo cont... 
const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: authMiddleware 
  });
  // so they know what our API looks like and how it resolves requests

  // Start the Apollo server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets (build folder in production only)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
  // wildcard GET route: if request is invalid, respond with production ready React front-end code
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
