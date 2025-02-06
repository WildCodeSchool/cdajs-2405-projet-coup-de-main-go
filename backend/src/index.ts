import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import jwt from "jsonwebtoken";

import { dataSource } from "./datasource";

import { UserQueries } from "./resolvers/UserQueries";
import { ChatQueries } from "./resolvers/ChatQueries";
import { ChatMutations } from "./resolvers/ChatMutations";
import { MessageQueries } from "./resolvers/MessageQueries";
import { MessageMutations } from "./resolvers/MessageMutations";
import { SkillQueries } from "./resolvers/SkillQueries";
import { ReviewQueries } from "./resolvers/ReviewQueries";
import { ReviewMutations } from "./resolvers/ReviewMutations";
import { TransactionQueries } from "./resolvers/TransactionQueries";
import { TransactionMutations } from "./resolvers/TransactionMutations";
import { UserMutations } from "./resolvers/UserMutations";
import { AdQueries } from "./resolvers/AdQueries";
import { AdMutations } from "./resolvers/AdMutations";

import "./jobs/cronJobs";

const port: number = parseInt(process.env.APOLLO_PORT || "4000", 10);

async function startApolloServer() {
  const schema = await buildSchema({
    resolvers: [
      UserQueries,
      UserMutations,
      AdQueries,
      AdMutations,
      ChatQueries,
      ChatMutations,
      MessageQueries,
      MessageMutations,
      SkillQueries,
      ReviewQueries,
      ReviewMutations,
      TransactionQueries,
      TransactionMutations,
    ],
    authChecker: ({ context }) => {
      if (context.user) {
        return true;
      }
      return false;
    },
  });

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await dataSource.initialize();

  await server.start();

  const staticFolderPath = path.join(__dirname, "..", "uploads");
  app.use("/uploads", express.static(staticFolderPath));

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json({ limit: "3mb" }),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        let user = null;

        if (authHeader?.startsWith("Bearer ") === true) {
          const tokenValue: string = authHeader.substring("Bearer ".length);

          const jwtSecret: string | undefined = process.env.JWT_SECRET;
          if (!jwtSecret) {
            throw new Error("Invalid JWT secret");
          }
          try {
            user = jwt.verify(tokenValue, jwtSecret) as { id: string };
          } catch (error) {
            console.error("Invalid token:", error);
          }
        }

        return { user };
      },
    })
  );

  app.get("/health", (req, res) => {
    res.status(200).send("Okay!");
  });

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Le serveur est prêt à http://localhost:${port}/graphql`);

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Le serveur est prêt à http://localhost:${port}/graphql`);
}

startApolloServer().catch((error) => {
  console.error("Erreur lors du démarrage du serveur :", error);
});
