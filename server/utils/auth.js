const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
      // console.log('we hit authMiddleware')
      let token = req.query.token || req.body.token || req.headers.authorization;
    
      if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
      }

      // if (!token) {
      //   throw new Error('You have no token!');
      // }
    
      try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        req.user = data;
        } catch {
        // throw new Error('Invalid token');
      
      }
      return req;
  },

  signToken: function ({ username, email, _id }) {
      const payload = { username, email, _id };
  
      return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
      
      // return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};