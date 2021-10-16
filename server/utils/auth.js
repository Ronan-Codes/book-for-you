const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes (-> server.js)
  authMiddleware: function (req, res, next) {
    // allows token to be sent via req.query, req.body, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"] - separate Bearer from <tokenvalue>
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // if not token, return request object as is 
    if (!token) {
      // return res.status(400).json({ message: 'You have no token!' });
      return req;
    }

    // verify token and attach user data to request object
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // return updated request object
    return req
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
