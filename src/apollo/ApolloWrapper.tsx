import React, { FC, PropsWithChildren } from "react";
import { ApolloClient, ApolloProvider, HttpLink } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import apolloCache from "./apolloCache";

const USE_BATCH_HTTP_LINK = false;
const URL = "/graphql";

let apolloLink = null;

if (USE_BATCH_HTTP_LINK) {
    apolloLink = new BatchHttpLink({
        uri: URL,
        batchMax: 10, // No more than 5 operations per batch
        batchInterval: 10 // Wait no more than 20ms after first batched operation
    });
} else {
    apolloLink = new HttpLink({
        uri: URL,
    });
}

export const client = new ApolloClient({
    link: apolloLink,
    cache: apolloCache
});

type ApolloWrapperProps = PropsWithChildren<{}>;

const ApolloWrapper: FC<ApolloWrapperProps> = function ({ children }) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}

export default ApolloWrapper;