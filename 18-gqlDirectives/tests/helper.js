const {ApolloServer} = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const typeDefs = require('../src/typedefs')
const resolvers = require('../src/resolvers')

/** Here is a createTestServer method */
const createTestServer = ctx => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    //2. mockEntireSchema false means we want some of the Schema to be mocked not all. Some we will resolve.
    // There are scenarios when we just want to check if the resolver is just working not testing its output then we 
    // use automatic schema data generation.
    mockEntireSchema: false,
    //1. As gql already knows from the Schema what data to resolve. 
    //   with mock true it can generate a random value to resolve.
    mocks: true,
    context: () => ctx //context funtion is returning whatever is passed in.
  })

  return createTestClient(server)
}

module.exports = createTestServer
