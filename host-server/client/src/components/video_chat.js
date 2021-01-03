import React,{memo} from 'react';

import {LocalVideo,RemoteVideo} from './video';

const VideoChat = memo((props) => {
        const {localStream,remoteStream,handleCloseWindow,handleDiscon} = props;
        var {connStat,intMatch} = props;
        const handleShowChat = () =>{
            document.getElementById("text-chat").style.display = "block";
        }
        return(
            <div id="video-chat-screen" className="video-chat animate">
                <RemoteVideo remoteStream = {remoteStream}/>
                <LocalVideo localStream = {localStream} />
                <div>
                <div>
                    <div>
                        <p className="connStatVideo">{connStat}</p>
                    </div>
                    {intMatch!=='' &&
                    <div>
                        <p className="connStatVideo" style = {{color:'green'}}>{intMatch}</p>
                    </div>}
                </div>
                <div className="videoChatControls">
                    <div className='show-chat-button'>
                        <div className='button-2-min' id="vidChatDiscClick" style={{pointerEvents:'none'}} onClick ={handleDiscon}>
                            <div className="translate-2"  id='vidChatDiscc'></div>
                            <button id="vidChatDisc">Disconnect</button>
                        </div>
                    </div>
                    <div className='show-chat-button'>
                        <div className='button-2-min' id="showChat" onClick={handleShowChat}>
                            <div className="translate-2"  id='showChat'></div>
                            <button id="showChat">Show Chat</button>
                        </div>
                    </div>
                    <div className='show-chat-button'>
                        <div className='button-2-min' id="close" onClick={handleCloseWindow}>
                            <div className="translate-2"  id='close'></div>
                            <button id="close">Close</button>
                        </div> 
                    </div> 
                </div>            
                </div>
            </div>
        );
});

export default VideoChat;