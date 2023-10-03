const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const foundUser = await User.find({
        _id: context.user._id,
      });
      return foundUser;
    },
  },
  Mutation: {
    addUser: async (parent, args, context) => {
      const user = await User.create(...args);
      console.log(args)
      const token = signToken(user);
      return { token, user };
    },
    login: async(parents, args, context) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Email or Password is incorrect');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        try {
          const newBook = new Book(bookData);
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: newBook } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new Error('Could not save book');
        }
      } else {
        throw new AuthenticationError('You need to be logged in!');
      }
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        try{ 
          const updatedUser = await User.findOneAndUpdate(
            {_id: context.user_id },
            { $pull: { savedBooks: { bookId }}},
            {new: true}
          )
          return updatedUser
        } catch (err) {
          console.log(err)
          throw new Error('Error removing book')
        }
      }else {
        throw new AuthenticationError('You need to be logged in!');
      }
    }
  }
}

module.exports = resolvers;