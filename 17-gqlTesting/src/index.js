const {ApolloServer, AuthenticationError, UserInputError, ApolloError} = require('apollo-server')
const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const {createToken, getUserFromToken} = require('./auth')
const db = require('./db')

const server = new ApolloServer({
  typeDefs,
  resolvers,  
  formatError(e){// e is graphql error. Any error that is thrown anywhere will get caught here in formatError. 
                 // We can customize error object in our way and just return it. 
    console.log(e);
    
    /** We can format error object */
    /** we can even just throw error from here */
    /** We can check whether it is AuthenticationError or UserInputError or ApolloError */
    if(e instanceof AuthenticationError){
      //do something
    }

    //must return the error object.
    return e;
  },
  context({req, connection}) {
    //step 4: Add any needed authentication and context.
    const context =  {...db}
    //If user queries for subscription then there will be connection object.
    if(connection){
      return {...context, ...connection.context} /** connection.context = what is returned by the onConnect method of 
                                                                          subscription object */
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return {...context, user, createToken}
  },
  //step 4: Add any needed authentication and context.
  subscriptions:{
    onConnect(params){
      const token = params.authToken
      const user = getUserFromToken(token)
      if(!user){
        throw new Error('nope');
      }
      return {user}
    }
  }
  //////////////////////////////////////////////////////////
})

server.listen(4000).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`)
})
