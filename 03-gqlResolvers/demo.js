/***************** What are resolvers **************************/
  /*
  * Resolvers are functions that are responsible for returning values for fields that
  * exist on Types in a Schema.
  * 
  * Resolvers execution is dependent on the incoming client Query.
  * Only those resolvers will be executed which user asked for.
  */
///////////////////////////////////////////////////////////////

/***************** Steps to create resolvers ************************/
/*
 * 1. Resolver names must match the exact field name on your Schema's Types.
 * 2. Resolvers must return the value type declared for the matching field.
 * 3. Resolvers can be async.
 * 4. Resolvers can retrieve data from any source.
 */
//////////////////////////////////////////////////////////////////

/*
 ! Schema + Resolvers = Server  
 * To create a server, at minimum, we need a Query Type with a field, and a resolver.
 */

const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');
  //! All types can have resolvers.
const typeDefs = gql`
  type User {
    email: String! 
    avatar: String
    friends: [User!]! 
  }

  type Query {
    me: User!
  }
`
const resolvers = {
  Query: {
    // The first argument ("_") is the parent resolver if any.
    // The second argument ("__") is the arguments that user will pass.
    // The third argument ("ctx") is the context That will be passed while creating server. e.g. (models and db).
    // The fourth argument info is hardly used. All ther fields that user queried will be in info.
    me(_, __, ctx, info){
      return {
        email: 'yoda@masters.com', // It will be overriden by "some@email.com"
        avatar: 'http://yoda.png',
        friends: []
      }
    }
  },
  // We not only can resolve on query levels we can also resolve on fields
  Email: {
    // If I have an explicit email resolver here that parent email will be completely overriden
    email(){
      return "some@email.com";  
    }
    // Each individual field does have its own default resolver if we don't explicitly define one.
  }
} 

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(4000)
      .then(()=>console.log('listening on port 4000'));