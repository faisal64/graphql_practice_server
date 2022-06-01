/***************** What is a Query **************************/
  /*
  *  A Type on a Schema that defines operations clients can perform to access data that resembles the shape
  *  of the other Types in the Schema.
  */
///////////////////////////////////////////////////////////////

/***************** Steps to create Queries ************************/
/*
 * 1. Create Query Type in the Schema using SDL.
 * 2. Add Fields to the Query type.
 * 3. Create Resolvers for the fields.
 */
//////////////////////////////////////////////////////////////////


const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');
const typeDefs = gql`
  type User {
    email: String! 
    avatar: String
    friends: [User!]! 
  }
  #a minimum Schema needs is a type Query. If there is no query how someone is gonna access it.
  type Query {
    me: User!
  }
`


const resolvers = {
  /*
   * By default it is named Query but we can give any name but, in that case we will have explicitly tell the 
   * resolver that this is the Query type.
   */
  Query: {
    me(){
      return {
        email: 'yoda@masters.com',
        avatar: 'http://yoda.png',
        friends: []
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(4000)
      .then(()=>console.log('listening on port 4000'));