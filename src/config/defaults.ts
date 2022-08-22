import { SettingsParameters } from "../component/SettingsDialog";

export const DEFAULT_BACKGROUND_COLOR = "#E6E6FA";
export const DEFAULT_NUMBER_OF_FRIENDS = 10;

export const DEFAULT_USERS_SETTINGS_LEFT = {
	ageBelow: 34,
	categories: ["HUMAN"],
} as SettingsParameters;
export const DEFAULT_USERS_SETTINGS_MIDDLE = {
	categories: ["ADMIN", "COMPUTER"],
} as SettingsParameters;
export const DEFAULT_USERS_SETTINGS_RIGHT = {
	ageAbove: 30,
} as SettingsParameters;
