/***************** Arguments **************************/
  /*
  * Arguments allow clients to pass variables along with Queries that can be used in your Resolvers to get data.
  * Arguments must be defined in your Schema.
  * Arguments can be added to any field. Whether its Query type field or just type field.
  * Arguments have to be either Scalars or Input Types, never a type.
  * Arguments can be made required.
  */
///////////////////////////////////////////////////////////////

/**
  //Input is only used for arguments type
 */
const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');
  //! All types can have resolvers.
const typeDefs = gql`
  type User {
    email(myOwn:Boolean): String! 
    avatar: String
    friends: [User!]! 
  }
  type Pet {
    id: ID!
    name: String!
  }
  input OwnInput{
    name: String
  }
  type Query {
    me(own:Own): User!,
    pets(type:String!): [Pet]!
  }
`
const resolvers = {
  Query: {
    // The second argument ("__") is the arguments that user will pass.
    me(_, __, ctx, info){
      return {
        email: 'yoda@masters.com', 
        avatar: 'http://yoda.png',
        friends: []
      }
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(4000)
      .then(()=>console.log('listening on port 4000'));