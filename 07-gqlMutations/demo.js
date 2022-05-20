/***************** Mutations **************************/
  /*
  * A Type on a Schema that defines operations clients can perform to mutate data (create,update,delete).
  */
///////////////////////////////////////////////////////////////

/***************** Creating Mutations **************************/
  /*
  * Define Mutation Type on Schema using SDL. 
  * Add fields for Mutation type.
  * Add arguments for Mutation fields.
  
  // It is just like adding query type.
  */
///////////////////////////////////////////////////////////////
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
  #There the input type is created for mutaion.
  input ShoesInput {
    brand: String,
    size: Int
  }
  input NewShoeInput{
    brand: String
    size: String
  }
  """
    whatever is written inside triple quotes will be shown in graphql tools.
  """
  type Query{
    me:User!,
    shoes(input: ShoesInput): [Shoe]!
  }
  #Mutation type is created there
  type Mutation{
    newShoe(input: NewShoeInput!): Shoe!
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
    me(_, __, ctx, info){
      return {
        email: 'yoda@masters.com', 
        avatar: 'http://yoda.png',
        friends: []
      }
    }
  },
  //Here is the resolver of Mutation type
  Mutation:{
    newShoe(_,{input}){
      //Here we can save the input in db.
      return input;
      /**
       * Return values for mutation fields should be the updated or just created or deleted value.
       * So that user on client side can cache it.
       */
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(4000)
      .then(()=>console.log('listening on port 4000'));