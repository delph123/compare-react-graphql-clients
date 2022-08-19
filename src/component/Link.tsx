import { FC } from "react";
import { Link as RouterLink, Path, useLocation } from "react-router-dom";

function concat(search: string, append: string) {
	return search + (search.includes("?") ? append.replace("?", "&") : append);
}

function convert(url: string): Partial<Path> {
	let [, pathname, search, hash] = /([^?#]*)(\?[^#]*)?(#.*)?/.exec(url) || [];
	return {
		pathname,
		search,
		hash,
	};
}

const Link: FC<Parameters<typeof RouterLink>[0]> = ({
	children,
	to,
	...props
}) => {
	const { search } = useLocation();

	let target = typeof to === "string" ? convert(to) : to;

	target = {
		...target,
		search: target.search ? concat(target.search, search) : search,
	};

	return (
		<RouterLink to={target} {...props}>
			{children}
		</RouterLink>
	);
};

export default Link;
