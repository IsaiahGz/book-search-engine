const { gql } = require('apollo-server-express');

// Edit the product typedef

const typeDefs = gql`
  type Book {
    _id: ID!
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]!
  }

  type Auth {
    token: ID!
    user: User!
  }

  type Query {
    getSingleUser: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    deleteBook(bookId: String!): User
    login(email: String, username: String, password: String!): Auth
  }
`;

module.exports = typeDefs;
