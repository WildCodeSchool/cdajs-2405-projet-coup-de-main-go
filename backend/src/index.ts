import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { dataSource } from "./datasource";
import { UserQueries } from "./resolvers/UserQueries";
import { startStandaloneServer } from "@apollo/server/standalone";

async function startApolloServer() {
  const port: number = 4000;
  
  const schema = await buildSchema({
    resolvers: [UserQueries],
  });

  const server = new ApolloServer({
    schema,
  });

  await dataSource.initialize();

  await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀  Server ready at: ${port}`);
}

startApolloServer();
