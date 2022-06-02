import { useQuery } from "@apollo/client";
import React, { FC, useState } from "react";
import { GetFriends } from "../queries/users";
import Loading from "./Loading";
import User from "./User";

interface FriendsProps {
    userId: string;
    backgroundColor?: string;
}

const Friends: FC<FriendsProps> = function ({ userId, backgroundColor = 'magenta' }) {
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
            {loading ? <p><Loading /></p> : friends.map((friend: any, i: number) => {
                return (
                    <p key={friend.id}>({i+1}/{friends.length}) <User userId={friend.id} /></p>
                );
            })}
        </section>
    );
}

export default Friends;