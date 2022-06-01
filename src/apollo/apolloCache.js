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
          },
          users: {
            read(_, { args, toReference }) {
              if (typeof args?.filters?.id === "string") {
                return [toReference({
                  __typename: 'User',
                  id: args.filters.id,
                })];
              }
            }
          }
        }
      }
    }
  });

export default apolloCache;