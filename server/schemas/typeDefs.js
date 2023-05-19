const { gql } = require('apollo-server-express');

// Edit the product typedef

const typeDefs = gql`
  type Query {
    me: String
  }

  type Mutation {
    login(email: String!, password: String!): String
  }
`;

module.exports = typeDefs;
