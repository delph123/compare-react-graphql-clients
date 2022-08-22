import React, { ReactNode } from "react";
import { SpyInstance } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Link from "./Link";

vi.mock("react-router-dom", async () => {
	return {
		...(await vi.importActual<any>("react-router-dom")),
		useLocation: vi.fn(),
	};
});

function mockUseLocationReturnQuery(searchQuery: string) {
	(useLocation as unknown as SpyInstance<[], Location>).mockReturnValue({
		search: searchQuery,
	} as Location);
}

function renderWithRouter(element: ReactNode) {
	render(
		<MemoryRouter initialEntries={["/"]}>
			<Routes>
				<Route path="/" element={element} />
			</Routes>
		</MemoryRouter>
	);
}

beforeEach(() => {
	mockUseLocationReturnQuery("");
});

describe("Link", () => {
	it("displays 'My link' as content", () => {
		renderWithRouter(<Link to="/a/file">My link</Link>);
		expect(screen.getByRole("link")).toHaveTextContent("My link");
	});

	it("points to /a/file as href when query context is empty", () => {
		renderWithRouter(<Link to="/a/file">My link</Link>);
		expect(screen.getByRole("link").getAttribute("href")).toBe("/a/file");
	});

	it("forwards all props", () => {
		renderWithRouter(
			<Link to="/a/file" className="das-klasse" color="red">
				My link
			</Link>
		);
		expect(screen.getByRole("link")).toHaveClass("das-klasse");
		expect(screen.getByRole("link").getAttribute("color")).toBe("red");
	});

	it("adds current query params to href without query param", () => {
		mockUseLocationReturnQuery("?hello=world");
		renderWithRouter(<Link to="/a/file">My link</Link>);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?hello=world"
		);
	});

	it("concatenates current query params to provided ones", () => {
		mockUseLocationReturnQuery("?hello=world");
		renderWithRouter(<Link to="/a/file?some=params">My link</Link>);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?some=params&hello=world"
		);
	});

	it("introduces current query params to href with hash string", () => {
		mockUseLocationReturnQuery("?hello=world");
		renderWithRouter(<Link to="/a/file#abc">My link</Link>);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?hello=world#abc"
		);
	});

	it("concaternates current query params to href with hash string", () => {
		mockUseLocationReturnQuery("?hello=world");
		renderWithRouter(<Link to="/a/file?some=param#abc">My link</Link>);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?some=param&hello=world#abc"
		);
	});

	it("adds current query params to Path object without search param", () => {
		mockUseLocationReturnQuery("?hello=world");
		renderWithRouter(<Link to={{ pathname: "/a/file" }}>My link</Link>);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?hello=world"
		);
	});

	it("concatenates current query params to Path object's provided ones", () => {
		mockUseLocationReturnQuery("?hello=world");
		renderWithRouter(
			<Link to={{ pathname: "/a/file", search: "?some=params&other" }}>
				My link
			</Link>
		);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?some=params&other&hello=world"
		);
	});

	it("inserts current query params to Path object with hash string", () => {
		mockUseLocationReturnQuery("?hello=world");
		renderWithRouter(
			<Link to={{ pathname: "/a/file", hash: "#abc" }}>My link</Link>
		);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?hello=world#abc"
		);
	});

	it("concatenates current query params to Path object's with hash string", () => {
		mockUseLocationReturnQuery("?hello=world");
		renderWithRouter(
			<Link
				to={{
					pathname: "/a/file",
					search: "?some=params&other",
					hash: "#abc",
				}}
			>
				My link
			</Link>
		);
		expect(screen.getByRole("link").getAttribute("href")).toBe(
			"/a/file?some=params&other&hello=world#abc"
		);
	});
});
