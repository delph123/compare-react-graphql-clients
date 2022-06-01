import { useQuery } from "@apollo/client";
import React from "react";
import { GetUsers } from "../queries/GetUsers";
import User from "./User";

export default function Users({ ageAbove, ageBelow, category, backgroundColor = 'magenta' }) {
    const { data, loading, error } = useQuery(GetUsers, {
        variables: {
            filters: {
                ageAbove: ageAbove,
                ageBelow: ageBelow,
                types: category
            }
          }
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) return <div><p>Error :-/</p><p>Caused by: {error.message}</p></div>;

    return (
        <section className='App-section' style={{
            backgroundColor: backgroundColor
        }}>
            <h2 className="App-section-title">{!category ? "ALL" : category.join(' + ')} {!ageAbove ? "" : `(above ${ageAbove})`}{!ageBelow ? "" : `(below ${ageBelow})`}</h2>
            {data.users.map(user => {
                return (
                    <p key={user.id}><User userId={user.id} /></p>
                )
            })}
        </section>
    );
    
}