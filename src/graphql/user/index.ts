import { ApolloServer } from '@apollo/server';
import { typeDefs } from './typedef.js';
import { queries } from './query.js';
import { mutations } from './mutation.js';
import { reslovers } from './resolvers.js';

async function CreateApolloServer() {
  const server = new ApolloServer({
    typeDefs: `#graphql
      ${typeDefs}
      type Query{
        ${queries}
      }
      type Mutation{
        ${mutations}
      }
    `,
    resolvers: {
      Query: {
        ...reslovers.query,
      },
      Mutation: {
        ...reslovers.mutation
      }
    }
  });

  await server.start();

  return server;
}

export default CreateApolloServer