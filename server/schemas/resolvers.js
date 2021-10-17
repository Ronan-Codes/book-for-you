const { User, Book } = require('../models');

const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
// These two are utilized in Mutations for authentication and JWT

const resolvers = {
    Query: {
        // get a single user by either their id or their username
        me: async (parent, args, context) => {
            if(context.user) {
                const foundUser = await User.findOne({
                    $or: [{ _id: context.user._id }, { username: context.user.username }]
                }).select('-__v -password')

                return foundUser; 
            }

            throw new AuthenticationError('Cannot find a user with this id!')
        },
    },
    
    Mutation: {
        // Error handling in front-end `{error && <div>Signup failed.</div>}` [when using useMutation(addUser)]
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user }
        }, 

        login: async(parent, {email, password}) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Incorrect credentials. Retry or signup!")
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials. Retry or signup!')
            }

            const token = signToken(user)
            return { token, user };
        }
    }
}

module.exports = resolvers;