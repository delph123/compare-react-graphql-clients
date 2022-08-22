import React, { FC } from "react";
import Users from "../component/Users";
import Header from "../component/Header";
import {
	backgroundColorVar,
	usersSettingsLeftVar,
	usersSettingsMiddleVar,
	usersSettingsRightVar,
} from "../apollo/localState";
import useStore from "../hooks/useStore";

interface UsersCatalogProps {}

const UsersCatalog: FC<UsersCatalogProps> = function () {
	const [color, setColor] = useStore(backgroundColorVar);

	const [usersSettingsLeft, setUsersSettingsLeft] =
		useStore(usersSettingsLeftVar);
	const [usersSettingsMiddle, setUsersSettingsMiddle] = useStore(
		usersSettingsMiddleVar
	);
	const [usersSettingsRight, setUsersSettingsRight] = useStore(
		usersSettingsRightVar
	);

	return (
		<>
			<Header color={color} onColorChanged={setColor}>
				Users Catalog
			</Header>
			<div className="App">
				{/* Display three times the same component, each with their own search criteria. */}
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
