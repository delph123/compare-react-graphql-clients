import React, { FC } from "react";

interface LoadingProps {} 

const Loading: FC<LoadingProps> = function () {
    return (
        <span className="loading">Loading...</span>
    )
}

export default Loading;