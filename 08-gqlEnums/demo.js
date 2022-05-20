/***************** Enums **************************/
  /*
  *A set of discrete values that can be used in place of Scalars. An enum field must resolve to one of the values in the Enum
  *It is great for limiting a field to only a few different options.

  * Enum is basically a collection of options that a field can have.
  */
///////////////////////////////////////////////////////////////

const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');
const typeDefs = gql`
  enum ShoeType{
    """
    By default these enums resolve to strings with the same value. That means the response from the api is going to be a 
    string with exact same value with capitalization like below.
    
    We can write custom resolvers for enums. In gql we can write resolvers for almost anything.
    """
    JORDAN
    NIKE
    ADIDDAS
  }

  type User {
    email: String!
    avatar: String
    friends: [User]!
  }

  type Shoe {
    brand: ShoeType!
    size: Int!
  }
  #There the input type is created for mutaion.
  input ShoesInput {
    brand: ShoeType,
    size: Int
  }
  input NewShoeInput{
    brand: ShoeType
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
        {brand:'NIKE', size:12},
        {brand:'ADIDDAS', size:14}
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