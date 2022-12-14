import React, { FC } from "react";
import Link from "./Link";
import useQuery from "../hooks/useQuery";
import useRenderCounter from "../hooks/useRenderCounter";
import { GetUser } from "../queries/users";
import Loading from "./Loading";

interface UserProps {
	userId: string;
	noLink?: boolean;
}

// User is a pure component w.r.t. its props so we can encaspsulate it
// in React.memo to avoid re-rendering when no prop has changed.
const User: FC<UserProps> = React.memo(function User({
	userId,
	noLink = false,
}) {
	const renderCounter = useRenderCounter();

	let {
		data: { user, users } = {},
		loading,
		error,
	} = useQuery(GetUser, {
		variables: {
			userId,
		},
	});

	if (loading) return <Loading />;
	if (error)
		return (
			<div>
				<p>Error :-/</p>
				<p>Caused by: {error.message}</p>
			</div>
		);

	if (users && !user) {
		user = users[0];
	}

	if (user == null) {
		return (
			<i>
				User&nbsp;
				<Link
					className="App-user-id"
					to={`/user/${userId.substring(5)}`}
				>
					{userId}
				</Link>
				&nbsp;not found!!
			</i>
		);
	}

	return (
		<>
			{!noLink ? (
				<Link
					className="App-user-id"
					to={`/user/${userId.substring(5)}`}
				>
					{userId}:
				</Link>
			) : null}
			&nbsp;
			{`${user.firstName} ${user.lastName} (${user.type
				.substring(0, 1)
				.toUpperCase()}${user.type.substring(1).toLowerCase()}) - ${
				user.age
			} y.o.`}
			{` [${renderCounter}]`}
		</>
	);
});

export default User;
