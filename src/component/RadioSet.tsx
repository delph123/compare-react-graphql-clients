import React, { ChangeEventHandler, FC } from "react";

interface RadioSetProps {
	className: string;
	name: string;
	legend?: string;
	choices: {
		id: string;
		label: string;
	}[];
	selected: string;
	onSelect?: ChangeEventHandler<HTMLInputElement>;
}

const RadioSet: FC<RadioSetProps> = React.memo(function RadioSet({
	className,
	name,
	legend,
	choices,
	selected,
	onSelect,
}) {
	return (
		<fieldset className={className}>
			{legend && <legend>{legend}</legend>}
			{choices.map((choice) => (
				<div key={choice.id}>
					<input
						type="radio"
						name={name}
						id={choice.id}
						checked={selected === choice.id}
						onChange={onSelect}
					/>
					<label htmlFor={choice.id}>{choice.label}</label>
				</div>
			))}
		</fieldset>
	);
});

export default RadioSet;
