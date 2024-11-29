import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { startStandaloneServer } from "@apollo/server/standalone";
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

const port: number = parseInt(process.env.APOLLO_PORT || "", 10);

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

    const server = new ApolloServer({
        schema,
    });

    await dataSource.initialize();

    await startStandaloneServer(server, {
        listen: { port },
        context: async ({ req }) => {
            const authHeader: string | undefined = req.headers.authorization;
            let user = null;

            if (authHeader?.startsWith("Bearer ") === true) {
                const tokenValue: string = authHeader.substring(
                    "Bearer ".length
                );

                // jwt
                const jwtSecret: string | undefined = process.env.JWT_SECRET;
                if (!jwtSecret) {
                    throw new Error("Invalid JWT secret");
                }
                user = jwt.verify(tokenValue, jwtSecret);
            }

            return { user };
        },
    });

    console.log(`🚀 Le serveur a démarré au port : ${port} !`);
}

startApolloServer();
