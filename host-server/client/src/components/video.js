import React, { memo,useEffect } from 'react';

export const LocalVideo = memo((props)=>{
    const {localStream} = props;
    const localVideoTag = React.createRef();
    useEffect(()=>{
        localVideoTag.current.srcObject = localStream;
    },[localVideoTag,localStream]);
    return(
            <div className = "localVideoWrapper">
                <video id="localVideo" ref = {localVideoTag} autoPlay muted/>
            </div>
    )
});

export const RemoteVideo = memo((props)=>{
    const {remoteStream} = props;
    const remoteVideoTag = React.createRef();
    useEffect(()=>{
        remoteVideoTag.current.srcObject = remoteStream;
    },[remoteVideoTag,remoteStream]);
    return(
            <div className = "remoteVideoWrapper">
                <video id="remoteVideo" ref = {remoteVideoTag} autoPlay poster="https://media.giphy.com/media/3oriOiizS4Pmofj46A/giphy.gif"/>
            </div>
    )
});