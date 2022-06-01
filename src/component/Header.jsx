import React from "react"

export default function Header({ children, color, onColorChanged, onNavigationPressed }) {
    return <header className="App-header">
        <div className="background" style={{ backgroundColor: color }}></div>
        {children}
        <div className="App-header-bar">
            {!onNavigationPressed ? null : <button onClick={() => onNavigationPressed(n => n-10)}>&lt;&lt;&nbsp;previous (10)</button>}
            {!onNavigationPressed ? null : <button onClick={() => onNavigationPressed(n => n-1)}>&lt;&nbsp;previous</button>}
            <input type="color" onChange={(evt) => onColorChanged(evt.target.value)} value={color} name="pick a color" />
            {!onNavigationPressed ? null : <button onClick={() => onNavigationPressed(n => n+1)}>next&nbsp;&gt;</button>}
            {!onNavigationPressed ? null : <button onClick={() => onNavigationPressed(n => n+10)}>next (10)&nbsp;&gt;&gt;</button>}
        </div>
    </header>
}