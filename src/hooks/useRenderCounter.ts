import { useRef } from "react";

const useRenderCounter = function (initialCount = 0) {
    const renderCounter = useRef(initialCount);
    renderCounter.current = renderCounter.current + 1;
    return renderCounter.current;
};

export default useRenderCounter;