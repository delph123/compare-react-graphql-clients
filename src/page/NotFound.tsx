import React, { FC } from "react";

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = function () {
    return (
        <main className="App-route-unknown">
            <p>404 - Not Found</p>
        </main>
    );
}

export default NotFound;
