const { signToken } = require('../utils/auth');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { User } = require('../models');

// type Query {
//   getSingleUser(userId: ID, username: String): User
// }

// type Mutation {
//   createUser(username: String!, email: String!, password: String!): Auth
//   saveBook(user: ID!, bookData: BookInput!): User
//   deleteBook(user: ID!, bookId: String!): User
//   login(email: String!, password: String!): Auth
// }

const resolvers = {
  Query: {
    getSingleUser: async (parent, { userId, username }) => {
      // Get a single user by either their id or their username
      const foundUser = await User.findOne({
        $or: [{ _id: userId }, { username: username }],
      });

      if (!foundUser) {
        throw new AuthenticationError('Cannot find a user with this id!');
      }
      return foundUser;
    },
  },
  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      // Create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new UserInputError('Something is wrong!');
      }
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] });
      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong password!');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
      // user comes from context created in the auth middleware function
      try {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookData } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        }
      } catch (err) {
        throw new AuthenticationError('You need to be logged in!');
      }
    },
    deleteBook: async (parent, { bookId }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new AuthenticationError("Couldn't find user with this id!");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;
