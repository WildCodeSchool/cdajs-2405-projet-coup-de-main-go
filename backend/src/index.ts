import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { startStandaloneServer } from "@apollo/server/standalone";

import { dataSource } from "./datasource";
import { UserMutations } from "./resolvers/UserMutations";
import { UserQueries } from "./resolvers/UserQueries";

const port: number = parseInt(process.env.APOLLO_PORT || "", 10);

async function startApolloServer() {
    const schema = await buildSchema({
        resolvers: [UserMutations, UserQueries],
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
