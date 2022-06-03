import { useQuery } from "@apollo/client";
import React, { FC } from "react";
import useRenderCounter from "../hooks/useRenderCounter";
import { GetUsers } from "../queries/users";
import Loading from "./Loading";
import User from "./User";

interface UsersProps {
    ageAbove?: number;
    ageBelow?: number;
    category?: string[];
    backgroundColor?: string;
}

const Users: FC<UsersProps> = function ({ ageAbove, ageBelow, category, backgroundColor = 'magenta' }) {
    const renderCounter  = useRenderCounter();

    const { data, loading, error } = useQuery(GetUsers, {
        variables: {
            filters: {
                ageAbove: ageAbove,
                ageBelow: ageBelow,
                types: category
            }
          }
    });
  
    if (error) return <div><p>Error :-/</p><p>Caused by: {error.message}</p></div>;

    return (
        <section className='App-section' style={{
            backgroundColor: backgroundColor
        }}>
            [{renderCounter}]
            <h2 className="App-section-title">{!category ? "ALL" : category.join(' + ')} {!ageAbove ? "" : `(above ${ageAbove})`}{!ageBelow ? "" : `(below ${ageBelow})`}</h2>
            {loading ? <p><Loading /></p> : data.users.map((user: any) => {
                return (
                    <p key={user.id}><User userId={user.id} /></p>
                )
            })}
        </section>
    );
    
}

export default Users;