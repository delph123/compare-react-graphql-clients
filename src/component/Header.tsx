import React, { FC, PropsWithChildren } from "react"
import useRenderCounter from "../hooks/useRenderCounter";

type HeaderProps = PropsWithChildren<{
    color: string;
    onColorChanged: (value: string) => void;
    onNavigationPressed?: (nav: (n: number) => number) => void;
}>;

const Header: FC<HeaderProps> = function ({ children, color, onColorChanged, onNavigationPressed }) {
    const renderCounter  = useRenderCounter();
    
    return <header className="App-header">
        <div className="background" style={{ backgroundColor: color }}>[{renderCounter}]</div>
        {children}
        <div className="App-header-bar">
            {!onNavigationPressed ? null : <button onClick={() => onNavigationPressed((n: number) => n-10)}>&lt;&lt;&nbsp;previous (10)</button>}
            {!onNavigationPressed ? null : <button onClick={() => onNavigationPressed((n: number) => n-1)}>&lt;&nbsp;previous</button>}
            <input type="color" onChange={(evt) => onColorChanged(evt.target.value)} value={color} name="pick a color" />
            {!onNavigationPressed ? null : <button onClick={() => onNavigationPressed((n: number) => n+1)}>next&nbsp;&gt;</button>}
            {!onNavigationPressed ? null : <button onClick={() => onNavigationPressed((n: number) => n+10)}>next (10)&nbsp;&gt;&gt;</button>}
        </div>
    </header>
}

export default Header;