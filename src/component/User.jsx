import { useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { GetUser } from "../queries/users";

export default function User({ userId, noLink = false }) {
    let { data: { user, users } = {}, loading, error } = useQuery(GetUser, {
        variables: {
            userId
          }
    });

    if (loading) return <i>Loading...</i>;
    if (error) return <div><p>Error :-/</p><p>Caused by: {error.message}</p></div>;

    if (users && !user) {
        user = users[0];
    }

    if (user == null) {
        return (
            <i>
                User&nbsp;
                <Link className="App-user-id" to={`/user/${userId.substring(5)}`}>{userId}</Link>
                &nbsp;not found!!
            </i>
        );
    }

    return (
        <>
            {!noLink ? <Link className="App-user-id" to={`/user/${userId.substring(5)}`}>{userId}:</Link> : null}
            &nbsp;
            {`${user.firstName} ${user.lastName} (${user.type.substring(0, 1).toUpperCase()}${user.type.substring(1).toLowerCase()}) - ${user.age} y.o.`}
        </>
    );
}