import React, { FC } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { backgroundColorVar } from "../apollo/localState";
import Friends from "../component/Friends";
import Header from "../component/Header";
import User from "../component/User";
import useLocalState from "../hooks/useLocalState";

interface UserDetailsProps {}

function navigateUserId(navigate: NavigateFunction, prevUserId: string, nav: (prevUserId: number) => number) {
  return () => navigate(`/user/${nav(parseInt(prevUserId))}`);
}

const UserDetails: FC<UserDetailsProps> = function () {
    const [color, setColor] = useLocalState(backgroundColorVar);
    const params = useParams() as { userId: string };
    const navigate = useNavigate();
    const userId = `user-${params.userId}`;
  
    return (
      <>
        <Header color={color} onColorChanged={setColor}>
            <User userId={userId} noLink={true} />
            <div className="App-header-bar">
              <button onClick={navigateUserId(navigate, params.userId, n => n-10)}>&lt;&lt;&nbsp;previous (10)</button>
              <button onClick={navigateUserId(navigate, params.userId, n => n-1)}>&lt;&nbsp;previous</button>
              <button onClick={() => navigate("/")}>Home</button>
              <button onClick={navigateUserId(navigate, params.userId, n => n+1)}>next&nbsp;&gt;</button>
              <button onClick={navigateUserId(navigate, params.userId, n => n+10)}>next (10)&nbsp;&gt;&gt;</button>
            </div>
        </Header>
        <div className="App">
            <Friends userId={userId} backgroundColor={color} />
        </div>
      </>
    );
}

export default UserDetails;