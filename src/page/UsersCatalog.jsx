import React, { useState } from 'react';
import Users from '../component/Users';
import Header from '../component/Header';

function UsersCatalog() {
  const [color, setColor] = useState('#E6E6FA');

  return (
    <>
      <Header color={color} onColorChanged={setColor}>
        Users Catalog
      </Header>
      <div className="App">
        <Users ageBelow={34} category={["HUMAN"]} backgroundColor={color} />
        <Users category={["ADMIN", "COMPUTER"]} backgroundColor={color} />
        <Users ageAbove={30} backgroundColor={color} />
      </div>
    </>
  );
}

export default UsersCatalog;
