import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Friends from "../component/Friends";
import Header from "../component/Header";
import User from "../component/User";

function UserDetails() {
    const [color, setColor] = useState('#E6E6FA');
    const params = useParams();
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