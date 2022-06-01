import { InMemoryCache } from "@apollo/client";

const apolloCache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          user: {
            read(_, { args, toReference }) {
              return toReference({
                __typename: 'User',
                id: args.id,
              });
            }
          }
        }
      }
    }
  });

export default apolloCache;