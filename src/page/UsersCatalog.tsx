import React, { FC } from "react";
import Users from "../component/Users";
import Header from "../component/Header";
import {
	backgroundColorVar,
	usersSettingsLeftVar,
	usersSettingsMiddleVar,
	usersSettingsRightVar,
} from "../apollo/localState";
import useLocalState from "../hooks/useLocalState";

interface UsersCatalogProps {}

const UsersCatalog: FC<UsersCatalogProps> = function () {
	const [color, setColor] = useLocalState(backgroundColorVar);

	const [usersSettingsLeft, setUsersSettingsLeft] =
		useLocalState(usersSettingsLeftVar);
	const [usersSettingsMiddle, setUsersSettingsMiddle] = useLocalState(
		usersSettingsMiddleVar
	);
	const [usersSettingsRight, setUsersSettingsRight] = useLocalState(
		usersSettingsRightVar
	);

	return (
		<>
			<Header color={color} onColorChanged={setColor}>
				Users Catalog
			</Header>
			<div className="App">
				<Users
					ageBelow={usersSettingsLeft.ageBelow}
					ageAbove={usersSettingsLeft.ageAbove}
					categories={usersSettingsLeft.categories}
					saveSettings={setUsersSettingsLeft}
					backgroundColor={color}
				/>
				<Users
					ageBelow={usersSettingsMiddle.ageBelow}
					ageAbove={usersSettingsMiddle.ageAbove}
					categories={usersSettingsMiddle.categories}
					saveSettings={setUsersSettingsMiddle}
					backgroundColor={color}
				/>
				<Users
					ageBelow={usersSettingsRight.ageBelow}
					ageAbove={usersSettingsRight.ageAbove}
					categories={usersSettingsRight.categories}
					saveSettings={setUsersSettingsRight}
					backgroundColor={color}
				/>
			</div>
		</>
	);
};

export default UsersCatalog;
