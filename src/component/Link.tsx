import { FC } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const Link: FC<Parameters<typeof RouterLink>[0]> = ({
	children,
	to,
	...props
}) => {
	const { search } = useLocation();

	return (
		<RouterLink to={to + search} {...props}>
			{children}
		</RouterLink>
	);
};

export default Link;
