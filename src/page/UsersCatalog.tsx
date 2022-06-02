import React, { FC } from 'react';
import Users from '../component/Users';
import Header from '../component/Header';
import { backgroundColorVar } from '../apollo/localState';
import { useReactiveVar } from '@apollo/client';

interface UsersCatalogProps {}

const UsersCatalog: FC<UsersCatalogProps> = function () {
  const [color, setColor] = [useReactiveVar(backgroundColorVar), backgroundColorVar];

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
