import React, { FC } from "react";

interface LoadingProps {}

// Loading is a pure component w.r.t. its props so we can encaspsulate it
// in React.memo to avoid re-rendering when no prop has changed.
const Loading: FC<LoadingProps> = React.memo(function Loading() {
	return <span className="loading">Loading...</span>;
});

export default Loading;
