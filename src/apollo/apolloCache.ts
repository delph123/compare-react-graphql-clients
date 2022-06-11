import { InMemoryCache } from "@apollo/client";
import { numberOfFriendsVar } from "./localState";

const apolloCache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				numberOfFriends: {
					read() {
						return numberOfFriendsVar();
					},
				},
				user: {
					read(value, { args, toReference }) {
						if (value != null) return value;
						return toReference({
							__typename: "User",
							uuid: args?.uuid,
						});
					},
				},
				users: {
					read(value, { args, toReference, canRead }) {
						if (value != null) {
							return value.filter(canRead).length === value.length
								? value
								: undefined;
						}
						if (typeof args?.filters?.uuid === "string") {
							const userRef = toReference({
								__typename: "User",
								uuid: args.filters.uuid,
							});
							if (canRead(userRef)) {
								return [userRef];
							}
						}
					},
				},
			},
		},
		User: {
			keyFields: ["uuid"],
		},
	},
});

export default apolloCache;
