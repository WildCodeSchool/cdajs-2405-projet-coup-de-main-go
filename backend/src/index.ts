import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { startStandaloneServer } from "@apollo/server/standalone";

import { dataSource } from "./datasource";

import { UserQueries } from "./resolvers/UserQueries";
import { ChatQueries } from "./resolvers/ChatQueries";
import { ChatMutations } from "./resolvers/ChatMutations";
import { MessageQueries } from "./resolvers/MessageQueries";
import { MessageMutations } from "./resolvers/MessageMutations";
import { SkillQueries } from "./resolvers/SkillQueries";
import { ReviewQueries } from "./resolvers/ReviewQueries";
import { ReviewMutations } from "./resolvers/ReviewMutations";

const port: number = parseInt(process.env.APOLLO_PORT || "", 10);

async function startApolloServer() {
  const schema = await buildSchema({
    resolvers: [
      UserQueries,
      ChatQueries,
      ChatMutations,
      MessageQueries,
      MessageMutations,
      SkillQueries,
      ReviewQueries,
      ReviewMutations,
    ],
  });

  const server = new ApolloServer({
    schema,
  });

  await dataSource.initialize();

  await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀 Le serveur a démarré au port : ${port} !`);
}

startApolloServer();
