import React, { FC } from 'react';
import Users from '../component/Users';
import Header from '../component/Header';
import { backgroundColorVar } from '../apollo/localState';
import useLocalState from '../hooks/useLocalState';

interface UsersCatalogProps {}

const UsersCatalog: FC<UsersCatalogProps> = function () {
  const [color, setColor] = useLocalState(backgroundColorVar);

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
