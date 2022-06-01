import { useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { GetUser } from "../queries/GetUsers";

export default function User({ userId, noLink = false }) {
    const { data: { user } = {}, loading, error } = useQuery(GetUser, {
        variables: {
            userId
          }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <div><p>Error :-/</p><p>Caused by: {error.message}</p></div>;

    return (
        <>
            {!noLink ? <Link className="App-user-id" to={`/user/${userId.substring(5)}`}>{userId}:</Link> : null}
            &nbsp;
            {`${user.firstName} ${user.lastName} (${user.type.substring(0, 1).toUpperCase()}${user.type.substring(1).toLowerCase()}) - ${user.age} y.o.`}
        </>
    );
}