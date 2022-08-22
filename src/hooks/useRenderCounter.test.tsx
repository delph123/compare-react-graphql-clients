import { render } from "@testing-library/react";
import useRenderCounter from "./useRenderCounter";

function MockCounter({
	initialCount,
	receiver,
}: {
	initialCount?: number;
	receiver: (n: number) => void;
}) {
	receiver(useRenderCounter(initialCount));
	return <br />;
}

describe("useRenderCounter", () => {
	it("returns one for a single render", () => {
		let spy = vi.fn();
		render(<MockCounter receiver={spy} />);
		expect(spy).toHaveBeenCalledWith(1);
	});

	it("starts at the provided value", () => {
		let spy = vi.fn();
		render(<MockCounter initialCount={7} receiver={spy} />);
		expect(spy).toHaveBeenCalledWith(8);
	});

	it("increase count at each render", () => {
		let spy = vi.fn();
		const { rerender } = render(<MockCounter receiver={spy} />);
		rerender(<MockCounter receiver={spy} />);
		rerender(<MockCounter receiver={spy} />);
		expect(spy).toHaveBeenCalledTimes(3);
		expect(spy.mock.calls.map((call) => call[0])).toEqual([1, 2, 3]);
	});

	it("increase count at each render starting from 7", () => {
		let spy = vi.fn();
		const { rerender } = render(
			<MockCounter initialCount={7} receiver={spy} />
		);
		rerender(<MockCounter initialCount={7} receiver={spy} />);
		expect(spy).toHaveBeenCalledTimes(2);
		expect(spy.mock.calls.map((call) => call[0])).toEqual([8, 9]);
	});

	it("gives different counters for different components", () => {
		let spy = vi.fn();
		render(<MockCounter receiver={spy} />);
		render(<MockCounter receiver={spy} />);
		expect(spy).toHaveBeenCalledTimes(2);
		expect(spy.mock.calls.map((call) => call[0])).toEqual([1, 1]);
	});
});
