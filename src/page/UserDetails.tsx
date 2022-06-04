import { useReactiveVar } from "@apollo/client";
import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backgroundColorVar } from "../apollo/localState";
import Friends from "../component/Friends";
import Header from "../component/Header";
import User from "../component/User";

interface UserDetailsProps {}

const UserDetails: FC<UserDetailsProps> = function () {
    const [color, setColor] = [useReactiveVar(backgroundColorVar), backgroundColorVar];
    const params = useParams() as { userId: string };
    const navigate = useNavigate();
    const userId = `user-${params.userId}`;
  
    return (
      <>
        <Header color={color} onColorChanged={setColor} onNavigationPressed={(nav) => navigate(`/user/${nav(parseInt(params.userId))}`)}>
            <User userId={userId} noLink={true} />
            <button onClick={() => navigate("/")}>Home</button>
        </Header>
        <div className="App">
            <Friends userId={userId} backgroundColor={color} />
        </div>
      </>
    );
}

export default UserDetails;