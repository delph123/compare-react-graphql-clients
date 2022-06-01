import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GetFriends } from "../queries/users";
import User from "./User";

function Friends({ userId, backgroundColor = 'magenta' }) {
    const [nbFriends, setNbFriends] = useState(10);

    const { data: { user: { friends } } = { user: { friends: [] } }, loading, error } = useQuery(GetFriends, {
        variables: {
            userId,
            nbFriends
          }
    });

    if (error) return <div><p>Error :-/</p><p>Caused by: {error.message}</p></div>;

    return (
        <section className='App-section' style={{
            backgroundColor: backgroundColor
        }}>
            <div>
                <h2>FRIENDS ({nbFriends})</h2>
                <button onClick={(evt) => setNbFriends(n => n+1)}>+</button>
                <button onClick={(evt) => setNbFriends(n => n-1)}>-</button>
            </div>
            {loading ? <p><i>Loading...</i></p> : friends.map((friend, i) => {
                return (
                    <p key={friend.id}>({i+1}/{friends.length}) <User userId={friend.id} /></p>
                );
            })}
        </section>
    );
}

export default Friends;