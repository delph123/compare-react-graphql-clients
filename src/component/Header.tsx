import React, { FC, PropsWithChildren } from "react"
import { useParams } from "react-router-dom";
import { clearGlobalQueryCache, refresh, resetApolloCache } from "../apollo/localState";
import useRenderCounter from "../hooks/useRenderCounter";

type HeaderProps = PropsWithChildren<{
    color: string;
    onColorChanged: (value: string) => void;
}>;

// Header is a Pure Components w.r.t. its props so we can encaspsulate it
// in React.memo to avoid re-rendering when no prop has changed.
const Header: FC<HeaderProps> = React.memo(function Header({ children, color, onColorChanged }) {
    const renderCounter  = useRenderCounter();
    const params = useParams();
    
    return <header className="App-header">
        <div className="background" style={{ backgroundColor: color }}>[{renderCounter}]</div>
        {children}
        <div className="App-header-subbar">
            <button onClick={clearGlobalQueryCache}>Clear Redux Cache</button>
            <button onClick={resetApolloCache}>Reset Apollo Cache</button>
            <input type="color" onChange={(evt) => onColorChanged(evt.target.value)} value={color} name="pick a color" />
            <button onClick={() => refresh(params?.userId)}>
                Refresh
                {
                    params?.userId != null ?
                        ` (usr ${params.userId.length > 5 ? params.userId.substring(0, 2) + '...' + params.userId.substring(params.userId.length - 3) : params.userId })`
                        :
                        " (users)"
                }
            </button>
        </div>
    </header>
});

export default Header;