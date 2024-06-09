import React from 'react';

function Header() {
    return (
        <header style={headerStyle}>
            <h1>Medical Image Viewer</h1>
        </header>
    )
}

//Style for the the header
const headerStyle = {
    background: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px'
}
export default Header;