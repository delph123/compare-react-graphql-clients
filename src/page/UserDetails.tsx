import React, { FC } from "react";
import {
	NavigateFunction,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import { backgroundColorVar } from "../apollo/localState";
import Friends from "../component/Friends";
import Header from "../component/Header";
import User from "../component/User";
import useStore from "../hooks/useStore";

interface UserDetailsProps {}

function navigateUserId(
	navigate: NavigateFunction,
	search: string,
	prevUserId: string,
	nav: (prevUserId: number) => number
) {
	return () => navigate(`/user/${nav(parseInt(prevUserId))}${search}`);
}

const UserDetails: FC<UserDetailsProps> = function () {
	const [color, setColor] = useStore(backgroundColorVar);
	const params = useParams() as { userId: string };
	const navigate = useNavigate();
	const { search } = useLocation();
	const userId = `user-${params.userId}`;

	return (
		<>
			<Header color={color} onColorChanged={setColor}>
				<User userId={userId} noLink={true} />
				<div className="App-header-bar">
					<button
						onClick={navigateUserId(
							navigate,
							search,
							params.userId,
							(n) => n - 10
						)}
					>
						&lt;&lt;&nbsp;previous (10)
					</button>
					<button
						onClick={navigateUserId(
							navigate,
							search,
							params.userId,
							(n) => n - 1
						)}
					>
						&lt;&nbsp;previous
					</button>
					<button onClick={() => navigate("/" + search)}>Home</button>
					<button
						onClick={navigateUserId(
							navigate,
							search,
							params.userId,
							(n) => n + 1
						)}
					>
						next&nbsp;&gt;
					</button>
					<button
						onClick={navigateUserId(
							navigate,
							search,
							params.userId,
							(n) => n + 10
						)}
					>
						next (10)&nbsp;&gt;&gt;
					</button>
				</div>
			</Header>
			<div className="App">
				<Friends userId={userId} backgroundColor={color} />
			</div>
		</>
	);
};

export default UserDetails;
