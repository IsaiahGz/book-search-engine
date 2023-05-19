const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {},
  },
  Mutation: {
    login: async (parent, { email, password }) => {},
  },
};

module.exports = resolvers;
