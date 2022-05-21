/***************** Interfaces **************************/
  /*
  * Abstract Types that can't be used as field values but instead used as foundations for explicit Types. 
  * Great for when you have Types that share common fields, but differ slightly
  */
///////////////////////////////////////////////////////////////

const gql = require('graphql-tag');
const {ApolloServer} = require('apollo-server');
const typeDefs = gql`
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
  """
    type Shoe {
      brand: ShoeType! 
      size: Int!
    }
  """
  # Instead of type Shoe we have created interface Shoe with same fields.
  interface Shoe{
    brand: ShoeType!
    size: Int!
  }
  # Now we can implement this on the Types that have similar fields also some more different fields.
  type Sneaker implements Shoe {
    # Although we are implementing Shoe we still have to explicitly write the brand and size (common fields) fields in Sneaker
    brand: ShoeType!
    size: Int!
    # This is the different field in Sneaker Type
    sport: String!
  }
  # Now we can implement this on the Types that have similar fields also some more different fields.
  type Boot implements Shoe {
    # Although we are implementing Shoe we still have to explicitly write the brand and size (common fields) fields in Boot
    brand: ShoeType!
    size: Int!
    #This is the different field in Boot Type
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
    me:User!,                 #shoe is not a type anymore but still it will be here and we have to tell in resolver How Shoe should be resolved
    shoes(input: ShoesInput): [Shoe]!
  }
  type Mutation{                  #shoe is not a type anymore but still it will be here and we have to tell in resolver How Shoe should be resolved
    newShoe(input: NewShoeInput!): Shoe!
  }
`

const resolvers = {
  Query: {
    shoes(_,{input}){
      console.log(input);
      return [
                                //two different objects with sport and hasGrip
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
  // We have to provide a Shoe resolver here.
  Shoe:{
    // __resolveType is a function which will decide which Shoe Type to resolve.
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