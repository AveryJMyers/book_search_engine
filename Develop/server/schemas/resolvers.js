const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { Types } = require('mongoose');


const resolvers = {
  Query: {
    me: async (parent, { id }, context) => {
      const me = await User.findOne({ _id: new Types.ObjectId(id) }).populate('savedBooks');
      return me;
    }
  },
  Mutation: {
    addUser: async (parent,  args, context) => {
      const user = await User.create({
        username: args.username,
        email: args.email,
        password: args.password,
      });
      const token = signToken(user);
      return { token, user };
    },
    login: async(parents, { email, password }, context) => {
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
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookData } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new Error('Error saving book');
        }
      } else {
        throw new AuthenticationError('You need to be logged in!');
      }
    },
    removeBook: async (parent, { id }, context) => {
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