const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');
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
/* email: String! -> marks makes it required and if it is not provided graphql is going to throw error; */
/* friends: [User! -> this exclamation sign will tell User can not be null]! ->This exclamation sign will tell that it must be an array. */
/* we also have Int, Float, Boolean, which is a string but an unique identifier. */
/* type Query -> A type on Schema that defines operations clients can perform to access data that resembled the shape of the 
    other types in Schema. */

const resolvers = {
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