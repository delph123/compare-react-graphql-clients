import React, { FC, PropsWithChildren } from "react";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import apolloCache from "./apolloCache";

const client = new ApolloClient({
    uri: '/graphql',
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