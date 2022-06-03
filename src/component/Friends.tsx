import { useQuery, useReactiveVar } from "@apollo/client";
import React, { FC } from "react";
import { numberOfFriendsVar } from "../apollo/localState";
import useRenderCounter from "../hooks/useRenderCounter";
import { GetFriends } from "../queries/users";
import Loading from "./Loading";
import User from "./User";

interface FriendsProps {
    userId: string;
    backgroundColor?: string;
}

const increment = (n : number) => n + 1;
const decrement = (n : number) => n - 1;

const Friends: FC<FriendsProps> = function ({ userId, backgroundColor = 'magenta' }) {
    const renderCounter  = useRenderCounter();

    const nbFriends = useReactiveVar(numberOfFriendsVar);
    const setNbFriends = (changeNumber: (n: number) => number) => numberOfFriendsVar(changeNumber(nbFriends));

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
                [{renderCounter}]
                <h2>FRIENDS ({nbFriends})</h2>
                <button onClick={() => setNbFriends(increment)}>+</button>
                <button onClick={() => setNbFriends(decrement)}>-</button>
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