const { signToken } = require('../utils/auth');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { User } = require('../models');

const resolvers = {
  Query: {
    getSingleUser: async (parent, args, context) => {
      // Must be logged in to use this query
      if (context.user) {
        // Get a single user by either their id or their username
        const foundUser = await User.findOne({
          $or: [{ _id: context.user._id }, { username: context.user.username }],
        });

        if (!foundUser) {
          throw new AuthenticationError('Cannot find a user with this id!');
        }
        return foundUser;
      }
      throw new AuthenticationError('You need to be logged in!');
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
    login: async (parent, { email, username, password }) => {
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] });
      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong password!');
      }
      console.log('signing token');
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
