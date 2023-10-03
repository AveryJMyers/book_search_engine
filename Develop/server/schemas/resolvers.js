
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const foundUser = await User.find({
        _id: context.user._id,
      });
      return foundUser;
    },
    books: async (parent, args) => {
      const books = await Books.find({});
    }
  },
  Mutation: {
   addUser: async (parent, args) => {
     const user = await User.create(args);
     return { user };
   },
  }
}

module.exports = resolvers;