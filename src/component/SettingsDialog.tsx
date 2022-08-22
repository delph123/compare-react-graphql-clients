import React, { FC, useCallback, useState } from "react";

export interface SettingsParameters {
	ageAbove?: number;
	ageBelow?: number;
	categories?: string[];
}

interface SettingsDialogProps {
	initialValues: SettingsParameters;
	save: (values: SettingsParameters) => void;
	exit: () => void;
}

const ALL_CATEGORIES = ["Human", "Admin", "Computer"];

function ageInputChangeHandler(setAge: (age: number | undefined) => void) {
	const handler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		let newAge = parseInt(event.target.value);
		setAge(!isNaN(newAge) ? newAge : undefined);
	};
	return handler;
}

// SettingsDialog is a pure component w.r.t. its props so we can encaspsulate it
// in React.memo to avoid re-rendering when no prop has changed.
const SettingsDialog: FC<SettingsDialogProps> = React.memo(
	function SettingsDialog({ initialValues, save, exit }) {
		const [ageAbove, setAgeAbove] = useState(initialValues.ageAbove);
		const [ageBelow, setAgeBelow] = useState(initialValues.ageBelow);
		const [categories, setCategories] = useState(
			initialValues.categories ||
				ALL_CATEGORIES.map((c) => c.toUpperCase())
		);
		const [error, setError] = useState("");

		const selectCategory = useCallback(
			(category: string) => {
				setCategories((categories) => {
					if (categories.includes(category)) {
						return categories.filter((c) => c !== category);
					} else {
						return [category, ...categories];
					}
				});
			},
			[setCategories]
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
		const onAgeAboveChanged = useCallback(
			ageInputChangeHandler(setAgeAbove),
			[setAgeAbove]
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
		const onAgeBelowChanged = useCallback(
			ageInputChangeHandler(setAgeBelow),
			[setAgeBelow]
		);

		const submitAndExit = () => {
			let submittedCategories: string[] | undefined = categories;
			if (categories.length === 0) {
				setError("Please select at least one category!");
				return;
			}
			if (submittedCategories.length === ALL_CATEGORIES.length) {
				submittedCategories = undefined;
			}
			save({ ageAbove, ageBelow, categories: submittedCategories });
			exit();
		};

		return (
			<div className="dialog-background">
				<div className="dialog">
					<span className="close-icon" onClick={exit}>
						x
					</span>
					<h1>Settings</h1>
					<div className="form-left">
						Age above:{" "}
						<input
							value={ageAbove || ""}
							onChange={onAgeAboveChanged}
						></input>
					</div>
					<div className="form-right">
						Age below:{" "}
						<input
							value={ageBelow}
							onChange={onAgeBelowChanged}
						></input>
					</div>
					<fieldset>
						<legend>Categories</legend>
						{ALL_CATEGORIES.map((choice) => (
							<>
								<input
									type="checkbox"
									name={choice.toLowerCase()}
									id={choice.toLowerCase()}
									checked={categories.includes(
										choice.toUpperCase()
									)}
									onChange={() =>
										selectCategory(choice.toUpperCase())
									}
								/>
								<label htmlFor={choice.toLowerCase()}>
									{choice}
								</label>
							</>
						))}
					</fieldset>
					{error && <p className="error">{error}</p>}
					<div className="dialog-footer">
						<button onClick={submitAndExit}>Save</button>
						<button onClick={exit}>Cancel</button>
					</div>
				</div>
			</div>
		);
	}
);

export default SettingsDialog;
