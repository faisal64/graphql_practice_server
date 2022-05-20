/***************** Arguments Demo**************************/

const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');
  //! All types can have resolvers.
const typeDefs = gql`
  type User {
    email: String!
    avatar: String
    friends: [User]!
  }

  type Shoe {
    brand: String!
    size: Int!
  }

  input ShoesInput {
    brand: String,
    size: Int
  }

  type Query{
    me:User!,
    shoes(input: ShoesInput): [Shoe]!
  }
`
const resolvers = {
  Query: {
    shoes(_,{input}){
      console.log(input);
      return [
        {brand:'nike', size:12},
        {brand:'adiddas', size:14}
      ].filter(shoe => shoe.brand == input.brand);
    },
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