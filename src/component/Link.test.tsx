import React, { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import Link from "./Link";

jest.mock("react-router-dom", () => {
	return {
		...jest.requireActual("react-router-dom"),
	};
});

const Router = require("react-router-dom");

const renderWithRouter = (element: ReactNode) =>
	render(
		<Router.MemoryRouter initialEntries={["/"]}>
			<Router.Routes>
				<Router.Route path="/" element={element} />
			</Router.Routes>
		</Router.MemoryRouter>
	);

afterEach(() => {
	jest.restoreAllMocks();
});

describe("Link", () => {
	it("renders link with content", () => {
		renderWithRouter(<Link to="/a/file">My link</Link>);
		expect(screen.getByRole("link")).toHaveTextContent("My link");
	});

	it("renders link with correct href", () => {
		renderWithRouter(<Link to="/a/file">My link</Link>);
		expect(screen.getByRole("link").getAttribute("href")).toBe("/a/file");
	});

	it("renders link and forwards props", () => {
		renderWithRouter(
			<Link to="/a/file" className="das-klasse">
				My link
			</Link>
		);
		expect(screen.getByRole("link")).toHaveClass("das-klasse");
	});

	it("renders link with query params kept", () => {
		jest.spyOn(Router, "useLocation").mockImplementation(() => ({
			search: "?hellow=world",
		}));
		renderWithRouter(<Link to="/a/file">My link</Link>);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?hellow=world"
		);
	});
});
