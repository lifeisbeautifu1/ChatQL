// import 'colors';
// import 'dotenv/config';
// import { ApolloServer } from 'apollo-server';
// import { query } from './db/db';

// import { createServer } from 'http';
// import {
//   ApolloServerPluginDrainHttpServer,
//   ApolloServerPluginLandingPageLocalDefault,
// } from 'apollo-server-core';
// import { makeExecutableSchema } from '@graphql-tools/schema';
// import { WebSocketServer } from 'ws';
// import express from 'express';
// import { useServer } from 'graphql-ws/lib/use/ws';

// import typeDefs from './graphql/typeDefs';
// import resolvers from './graphql/resolvers';

// const app = express();

// const httpServer = createServer(app);

// const schema = makeExecutableSchema({ typeDefs, resolvers });

// // Creating the WebSocket server
// const wsServer = new WebSocketServer({
//   // This is the `httpServer` we created in a previous step.
//   server: httpServer,
//   // Pass a different path here if your ApolloServer serves at
//   // a different path.
//   path: '/graphql',
// });

// // Hand in the schema we just created and have the
// // WebSocketServer start listening.
// const serverCleanup = useServer({ schema }, wsServer);

// const server = new ApolloServer({
//   schema,
//   csrfPrevention: true,
//   cache: 'bounded',
//   // context: ({ req }) => {
//   //   return {
//   //     req,
//   //     db: {
//   //       query,
//   //     },
//   //   };
//   // },
//   plugins: [
//     // Proper shutdown for the HTTP server.
//     ApolloServerPluginDrainHttpServer({ httpServer }),

//     // Proper shutdown for the WebSocket server.
//     {
//       async serverWillStart() {
//         return {
//           async drainServer() {
//             await serverCleanup.dispose();
//           },
//         };
//       },
//     },
//     ApolloServerPluginLandingPageLocalDefault({ embed: true }),
//   ],
// });

// const PORT = process.env.PORT || 5000;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => {
//     return {
//       req,
//       db: {
//         query,
//       },
//     };
//   },
// });

// httpServer.listen(5000, () => console.log(5000));

// server.listen({ port: PORT }).then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`.green.bold);
// });

import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import express from 'express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import 'colors';
import 'dotenv/config';
import { query } from './db/db';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '',
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: 'bounded',
  context: ({ req }) => {
    return {
      req,
      db: {
        query,
      },
    };
  },
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const start = async () => {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 5000;
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
        .green.bold
    );
  });
};

start();
