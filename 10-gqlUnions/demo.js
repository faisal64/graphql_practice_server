/***************** Unions **************************/
  /*
  * Like interfaces, but without any defined common fields amongst the Types. Useful when you need to access more than
    one disjoint Type from one Query, like a search.

  * Use interface when there something common in them 
  * Use union when there is no common thing.
  */
///////////////////////////////////////////////////////////////

const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');
const typeDefs = gql`
  union Footwear = Sneaker | Boot

  enum ShoeType{
    JORDAN
    NIKE
    ADIDDAS
  }

  type User {
    email: String!
    avatar: String
    friends: [User]!
  }

  interface Shoe{
    brand: ShoeType!
    size: Int!
  }
  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    sport: String!
  }
  type Boot implements Shoe {
    brand: ShoeType!
    size: Int!
    hasGrip: Boolean!
  }
  input ShoesInput {
    brand: ShoeType,
    size: Int
  }
  input NewShoeInput{
    brand: ShoeType
    size: String
  }

  type Query{
    me:User!,                 #Now we can use Footware union here.
    shoes(input: ShoesInput): [Footwear]!
  }
  type Mutation{                  
    newShoe(input: NewShoeInput!): Shoe!
  }
`

const resolvers = {
  Query: {
    shoes(_,{input}){
      console.log(input);
      return [
        {brand:'NIKE', size:12, sport:'Sporty'},
        {brand:'ADIDDAS', size:14, hasGrip:true}
      ];
    },
    me(_, __, ctx, info){
      return {
        email: 'yoda@masters.com', 
        avatar: 'http://yoda.png',
        friends: []
      }
    }
  },
  Mutation:{
    newShoe(_,{input}){
      return input;
    }
  },
  Shoe:{
    __resolveType(shoe){
      if (shoe.sport) return "Sneaker"
      return "Boot"
    }
  },
  //Just like interface we need to make resolver for disjoint values
  Footwear:{
    __resolveType(shoe){
      if (shoe.sport) return "Sneaker"
      return "Boot"
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(4000)
      .then(()=>console.log('listening on port 4000'));