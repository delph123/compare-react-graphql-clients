import { InMemoryCache } from "@apollo/client";

const apolloCache = new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					user: {
						read(value, { args, toReference }) {
							if (value != null) return value;
							return toReference({
								__typename: 'User',
								id: args.id,
							});
						}
					},
					users: {
						read(value, { args, toReference }) {
							if (value != null) return value;
							if (typeof args?.filters?.id === "string") {
								return [
									toReference({
										__typename: 'User',
										id: args.filters.id,
									})
								];
							}
						}
					}
				}
			}
		}
	});

export default apolloCache;