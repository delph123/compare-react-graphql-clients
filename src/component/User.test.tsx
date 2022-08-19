import React from "react";
import { render, screen } from "@testing-library/react";
import useQuery from "../hooks/useQuery";
import User from "./User";
import { GetUser } from "../queries/users";
import Link from "./Link";

jest.mock("../hooks/useQuery");
jest.mock("./Link");

const USER = {
	user: {
		firstName: "Pierre",
		lastName: "Costa",
		age: 33,
		type: "HUMAN",
	},
};

const ERROR = new Error("User data could not be fetched!");

describe("User", () => {
	it("displays user info", () => {
		(useQuery as jest.Mock).mockReturnValue({
			data: USER,
			loading: false,
		});
		render(<User userId="user-0" noLink={true} />);
		expect(
			screen.getByText(/Pierre Costa \(Human\) - 33 y\.o\./)
		).toBeInTheDocument();
		expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
		expect(screen.queryByText(/Error/)).not.toBeInTheDocument();
		expect(useQuery).toHaveBeenCalledWith(GetUser, {
			variables: {
				userId: "user-0",
			},
		});
		expect(Link).not.toHaveBeenCalled();
	});

	it("displays loading indicator", () => {
		(useQuery as jest.Mock).mockReturnValue({
			loading: true,
		});
		render(<User userId="user-0" noLink={true} />);
		expect(screen.getByText(/Loading/)).toBeInTheDocument();
		expect(screen.queryByText(/Pierre/)).not.toBeInTheDocument();
	});

	it("displays loading indicator with user data", () => {
		(useQuery as jest.Mock).mockReturnValue({
			data: USER,
			loading: true,
		});
		render(<User userId="user-0" noLink={true} />);
		expect(screen.getByText(/Loading/)).toBeInTheDocument();
		expect(screen.queryByText(/Pierre/)).not.toBeInTheDocument();
	});

	it("displays loading indicator with error", () => {
		(useQuery as jest.Mock).mockReturnValue({
			loading: true,
			error: ERROR,
		});
		render(<User userId="user-0" noLink={true} />);
		expect(screen.getByText(/Loading/)).toBeInTheDocument();
		expect(screen.queryByText(/Error/)).not.toBeInTheDocument();
	});

	it("displays not found when user empty", () => {
		(useQuery as jest.Mock).mockReturnValue({
			loading: false,
		});
		render(<User userId="user-0" noLink={true} />);
		expect(screen.getByText(/not found/)).toBeInTheDocument();
	});

	it("displays error", () => {
		(useQuery as jest.Mock).mockReturnValue({
			loading: false,
			error: ERROR,
		});
		render(<User userId="user-0" noLink={true} />);
		expect(screen.getByText(/Error/)).toBeInTheDocument();
		expect(
			screen.getByText(/User data could not be fetched/)
		).toBeInTheDocument();
	});

	it("displays link when attribute is false", () => {
		(useQuery as jest.Mock).mockReturnValue({
			data: USER,
			loading: false,
		});
		(Link as jest.Mock).mockImplementation(({ children, to }) => {
			return <a href={to}>{children}</a>;
		});
		render(<User userId="user-0" noLink={false} />);
		expect(
			screen.getByText(/Pierre Costa \(Human\) - 33 y\.o\./)
		).toBeInTheDocument();
		expect(Link).toHaveBeenCalled();
		expect(screen.getByRole("link")).toHaveTextContent("user-0");
		expect(screen.getByRole("link").getAttribute("href")).toBe("/user/0");
	});

	it("displays link when attribute is omitted", () => {
		(useQuery as jest.Mock).mockReturnValue({
			data: USER,
			loading: false,
		});
		render(<User userId="user-0" />);
		expect(
			screen.getByText(/Pierre Costa \(Human\) - 33 y\.o\./)
		).toBeInTheDocument();
		expect(Link).toHaveBeenCalled();
	});
});
