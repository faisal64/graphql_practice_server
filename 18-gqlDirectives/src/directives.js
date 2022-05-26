const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server')
const { defaultFieldResolver, GraphQLString } = require('graphql')
const {formatDate} = require('./utils');

class FormatDateDirective extends SchemaDirectiveVisitor{
  visitFieldDefinition(field){
    const resolver = field.resolve || defaultFieldResolver;
    const {format:defaultFormat} = this.args;

    
    field.args.push({//This line is equivalent to the typeDefs argument for query or mutation that can be caught in resolvers.
                      /*e.g.
                        type Query {
                          me: User!
                          posts: [Post]!
                              //equivalent to the id arguement
                          post(id: String!): Post!
                          userSettings: Settings!
                          feed: [Post]!
                        }*/
      name: 'format',
      type: GraphQLString
    })                    //In the resolve method we have root, args, context, info
    field.resolve = async (root, {format, ...rest}, ctx, info) =>{
      const result =  await resolver.call(this, root, rest, ctx, info);
      
      return formatDate(result, format || defaultFormat);
    }

    field.type = GraphQLString;
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor{
  visitFieldDefinition(field){
    const resolver = field.resolve || defaultFieldResolver;
    
    field.resolve = async (root, args, ctx, info) =>{
      if(!ctx.user){
        throw new AuthenticationError('not authenticated');
      }
      return await resolver.call(this, root, args, ctx, info);
    }
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field){
    const resolver = field.resolve || defaultFieldResolver;

    field.resolve = async (root, args, ctx, info) =>{
      if(ctx.user.role !== role){
        throw new AuthenticationError(`incorrect role`);
      }
      return await resolver.call(this, root, args, ctx, info);
    }
  }

}

module.exports = {
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective
}
