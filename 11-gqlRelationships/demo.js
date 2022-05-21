/***************** Thinking in graphs **************************/
  /*
  * Your API is no longer a predefined list of operations that always return the same shapes. Instead, your API is a set
    of Nodes that know how to resolve themeselves and have links to other Nodes. This allow client to ask for Nodes and 
    then follow those links to get related Nodes.

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
    # A user can have multipler shoes.
    shoes: [Shoe]!
  }

  interface Shoe{
    brand: ShoeType!
    size: Int!
    # A shoe can have one user.
    user: User!
  }
  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
    sport: String!
  }
  type Boot implements Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
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
    me:User!,                 
    shoes(input: ShoesInput): [Shoe]!
  }
  type Mutation{                  
    newShoe(input: NewShoeInput!): Shoe!
  }
`
const user = {
  id:1,
  email: 'yoda@masters.com', 
  avatar: 'http://yoda.png',
  shoes:[]
}
const shoes = [
  {brand:'NIKE', size:12, sport:'Sporty', user:1},
  {brand:'ADIDDAS', size:14, hasGrip:true, user:1}
]

const resolvers = {
  Query: {
    shoes(_,{input}){
      console.log(input);
      return ;
    },
    me(_, __, ctx, info){
      return user;
    }
  },
  Mutation:{
    newShoe(_,{input}){
      return input;
    }
  },
  Shoe:{ // We can write field label resolver on abstract type and they have to exist on real types.
    __resolveType(shoe){
      if (shoe.sport) return "Sneaker"
      return "Boot"
    }
  },
  User:{
    shoes(user){
      return shoes; // here for now we are just returning the whole array. In reality we will fetch shoes using user.id from 
                    // arguments and return that.
    }
  },
  Sneaker: {
    user(shoe){  
      return user;  //Here we are getting user shoes for shoes query and override this fetched object with userId.
    }
  },
  Boot: {
    user(shoe){
      return user;  //Here we are getting user shoes for shoes query and override this fetched object with userId.
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen(4000)
      .then(()=>console.log('listening on port 4000'));