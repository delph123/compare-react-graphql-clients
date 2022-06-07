import React, { FC } from "react";
import useQuery from "../hooks/useQuery";
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

// Users is a Pure Components w.r.t. its props so we can encaspsulate it
// in React.memo to avoid re-rendering when no prop has changed.
const Users: FC<UsersProps> = React.memo(function Users({ ageAbove, ageBelow, category, backgroundColor = 'magenta' }) {
    const renderCounter  = useRenderCounter();

    const { data, loading, error, refetch } = useQuery(GetUsers, {
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
            <button onClick={() => refetch()}>Refresh</button>
            {loading ? <p><Loading /></p> : data.users.map((user: any) => {
                return (
                    <p key={user.uuid}><User userId={user.uuid} /></p>
                )
            })}
        </section>
    );
    
});

export default Users;