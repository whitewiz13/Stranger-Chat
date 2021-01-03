import React from 'react';
import {AlwaysScrollToBottom} from './helper_comp';

const Message = (props) =>{
    const {message} = props;
    if(message.type === "You"){
    return(
        <div style ={{float:'left',clear : 'both'}}>
            <p style={{display:'inline',color:'blue',fontWeight:'900'}}>You :</p>
            <p style={{display:'inline'}}className="textMessage" key = {message}> {message.mess}</p>
            <AlwaysScrollToBottom />
            <br></br>
        </div>

    )}
    else{
        return(
            <div style ={{float:'left',clear:'both'}}>
                <p style={{display:'inline',color:'red',fontWeight:'900'}}>Stranger :</p>
                <p style={{display:'inline'}}className="textMessage" key = {message}> {message.mess}</p>
                <AlwaysScrollToBottom />
                <br></br>
            </div>
        )
    }
}

export default Message;