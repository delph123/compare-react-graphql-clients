import { ApolloClient, ApolloProvider } from "@apollo/client";
import apolloCache from "./apolloCache";

const client = new ApolloClient({
    uri: '/graphql',
    cache: apolloCache
  });

function ApolloWrapper({ children }) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}

export default ApolloWrapper;