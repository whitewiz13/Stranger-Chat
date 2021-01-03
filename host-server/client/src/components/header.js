import React from 'react';

const Header = (props)=> {
    return (
    <header>
        <div>
            <button id = "mainTitle">{props.headTitle}</button>
        </div>
        <div>
            <div style ={{display:props.disp}}>
                <img className="mainTitleImage" src = "/favicon.png" height="30px" alt="title"/>
            </div>
        </div>
        {/*<div id = "sideMenu">
            <div>
                <button>Help</button>
                <button>Support</button>
                <button>Contact Us</button>
            </div>
        </div>*/}
        <div>
        <button id = "onlineUsers">{props.title}</button>
        </div>
    </header>
    )
}

export default Header;