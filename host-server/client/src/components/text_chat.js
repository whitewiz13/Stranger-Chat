import React, {useState,useEffect} from 'react';
//Components
import Header from './header';
import Message from './message';
import VideoChat from './video_chat';
import {initSocket} from './initSocket';

var dataChannel;
var removeStatusTimeout;
//var someWaitTimer;

const TextChat = (props) => {
    const {socket,cid,closeSub,headTitle,chatType,localStream} = props;
    var {int,pcConfig} = props;
    const[pc,setPc] = useState(null);
    const[messageList,setMessageList] = useState([]);
    const[connStat,setConnStat] = useState("Looking for a Stranger...");
    const[remoteStream,setRemoteStream] = useState(null);
    const[status,setStatus] = useState(null);
    const[joinedQue,setJoinedQue] = useState(false);
    const[intMatch,setIntMatch] = useState('');

    useEffect(()=>{
        setPc(new RTCPeerConnection(pcConfig));
    },[pcConfig]);

    //Socket functions
    const initPCOffer = (toid,matchInt,pc)=>{
        if(chatType==="videoChat"){
            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
            pc.ontrack = (event)=>{
                setRemoteStream(event.streams[0]);
            }
        }
        pc.onicecandidate = (event) =>{
            sendIceCandidate(event,toid);
        }
        dataChannel = pc.createDataChannel("chat");
        dataChannel.addEventListener('message', event => {
            if(event.data === "99Type"){
                clearTimeout(removeStatusTimeout);
                setStatus("Stranger is typing...");
                removeStatusTimeout = setTimeout(removeStatTime, 1500);
            }else if(event.data === "99Done"){
                setStatus("");
            }else if(event.data !== "Connected to a stranger! No one with same interest!"){
                const message = {
                    type : "Stranger",
                    mess : event.data
                }
                setMessageList(messageList => [...messageList,message]);
            }
        });
        dataChannel.addEventListener('open',() =>{
            setConnStat("Connected to a stranger! Say hi!")
            document.querySelector("#mainInputText").disabled = false;
            document.querySelector("#mainInputText").placeholder = "Connected to Stranger! Send a text!";
            if(document.querySelector("#textChatDiscClick")!==null){
                document.querySelector("#textChatDiscClick").style.pointerEvents = "auto";
                }else if(document.querySelector("#videoTextChatDiscClick")!==null){
                document.querySelector("#videoTextChatDiscClick").style.pointerEvents = "auto";
                document.querySelector("#vidChatDiscClick").style.pointerEvents = "auto";
            }
            //document.querySelector("#mainInputText").focus();
            if(int[0] !== ''){
                if(matchInt!=='/.../'){
                setIntMatch("You Both Like : " + matchInt);
                dataChannel.send("You Both Like : " + matchInt);
                }else{
                    setIntMatch("Connected to a stranger! No one with same interest!");
                    dataChannel.send("Connected to a stranger! No one with same interest!");
                }
            }
        });
        dataChannel.addEventListener('close',() =>{
            if(dataChannel!==null){
                if( document.querySelector("#mainInputText")!=null){
                pc.close();
                setConnStat("Stranger has disconnected!")
                document.querySelector("#mainInputText").placeholder = "Stranger has disconnected!";
                document.querySelector("#textChatDisc").innerHTML = "New";
                if(document.querySelector("#vidChatDisc")!==null){
                    document.querySelector("#vidChatDisc").innerHTML = "New";
                }
                document.querySelector("#mainInputText").disabled = true;
                }
            }
        });
        pc.createOffer().then((offer)=>{
            pc.setLocalDescription(offer);
            const offerToSend = {
                to : toid,
                from : cid,
                offer : offer,
            }
            socket.emit("sendOffer",offerToSend);
        });
    }
    const initPCAnswer = (offer,toid,pc) =>{
        if(chatType==="videoChat"){
            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
            pc.ontrack = (event)=>{
                setRemoteStream(event.streams[0]);
            }
        }
        pc.onicecandidate = (event) =>{
            sendIceCandidate(event,toid);
        }
        pc.setRemoteDescription(offer);
        pc.createAnswer().then((answer)=>{
            pc.setLocalDescription(answer);
            const answerToSend = {
                to : toid,
                from : cid,
                answer : answer,
            }
            socket.emit("sendAnswer",answerToSend);
        });
        pc.addEventListener('datachannel', event => {
            dataChannel = event.channel;
            dataChannel.addEventListener('message', event => {
                if((event.data.includes("You Both Like : ")
                || event.data === "Connected to a stranger! No one with same interest!")
                && int[0] !== ''){
                    setIntMatch(event.data);
                }
                else if(event.data === "99Type"){
                    clearTimeout(removeStatusTimeout);
                    setStatus("Stranger is typing...");
                    removeStatusTimeout = setTimeout(removeStatTime, 1500);
                }else if(event.data === "99Done"){
                    setStatus("");
                }else if(event.data !== "Connected to a stranger! No one with same interest!"){
                    const message = {
                        type : "Stranger",
                        mess : event.data
                    }
                    setMessageList(messageList => [...messageList,message]);
                }
            });
            dataChannel.addEventListener('open',() =>{
                if(int[0] !== '' && intMatch === ''){
                    setIntMatch("Connected to a stranger! No one with same interest!");
                }
                setConnStat("Connected to a stranger! Say hi!")
                if(document.querySelector("#textChatDiscClick")!==null){
                    document.querySelector("#textChatDiscClick").style.pointerEvents = "auto";
                    }else if(document.querySelector("#videoTextChatDiscClick")!==null){
                    document.querySelector("#videoTextChatDiscClick").style.pointerEvents = "auto";
                    document.querySelector("#vidChatDiscClick").style.pointerEvents = "auto";}
                document.querySelector("#mainInputText").disabled = false;
                document.querySelector("#mainInputText").placeholder = "Connected to Stranger! Send a text!";
                //document.querySelector("#mainInputText").focus();
            });
            dataChannel.addEventListener('close',() =>{
                if(dataChannel!==null){
                    if( document.querySelector("#mainInputText")!=null){
                    pc.close();
                    setConnStat("Stranger has disconnected!")
                    document.querySelector("#mainInputText").placeholder = "Stranger has disconnected!";
                    document.querySelector("#textChatDisc").innerHTML = "New";
                    if(document.querySelector("#vidChatDisc")!==null){
                        document.querySelector("#vidChatDisc").innerHTML = "New";
                    }
                    document.querySelector("#mainInputText").disabled = true;
                    }
                }
            });
        });
    }
    const sendIceCandidate = (event,toid) =>{
        if (event.candidate) {
            var cand = {
                type: 'candidate',
                to : toid,
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            }
            socket.emit("candidate",cand);
        }
    }
    const joinConnQue = (cid,type) =>{
        var queInt;
        if(int[0] === ''){
            queInt = {
                cid : cid,
                interest : ['/.../']
            }
        }else{
            queInt = {
                cid : cid,
                interest : int
            }
        }
        if(type === "textChat"){
        socket.emit("joinQue",queInt);
        }else if(type === "videoChat"){
            socket.emit("joinVideoQue",queInt);
        }
    }
    const handleCloseWindow = ()=>{
        socket.off('availCon');
        socket.off('offerRec');
        socket.off('answerRec');
        socket.off('candRec');
        if(dataChannel!=null){
            if(dataChannel.readyState ==='open'){
            dataChannel.send("99Done");}
            dataChannel.close();
            dataChannel = null;
        }
        socket.emit("end");
        closeSub('');
    }
    const handleSendText = (e)=>{
        if(dataChannel !== null && typeof dataChannel !== 'undefined' && dataChannel.readyState === 'open'){
            if((e.keyCode === 13 || e.keyCode == null) && document.getElementById("mainInputText").value.trim()!==''){
                dataChannel.send(document.getElementById("mainInputText").value.trim());
                const message = {
                    type : "You",
                    mess : document.getElementById("mainInputText").value.trim()
                }
                setMessageList(messageList => [...messageList,message]);
                document.getElementById("mainInputText").value = '';
                dataChannel.send("99Done");
            }
        }
    }
    const removeStatTime = () =>{
        setStatus("");
    }
    const handleUserType = (e)=>{
        if(dataChannel !== null && typeof dataChannel !== 'undefined' &&  dataChannel.readyState === 'open'){
            if(e.keyCode !== 13){
                dataChannel.send("99Type");
            }
        }
    }
    const handleDiscon = ()=>{
            if(document.getElementById("textChatDisc").innerHTML === "Disconnect"){
                document.getElementById("textChatDisc").innerHTML  = "Really?";
                if(document.getElementById("vidChatDisc")!=null){
                    document.getElementById("vidChatDisc").innerHTML  = "Really?";
                }
            }else if(document.getElementById("textChatDisc").innerHTML === "Really?"){
                if(dataChannel!=null){
                    if(dataChannel.readyState ==='open'){
                    dataChannel.send("99Done");}
                    dataChannel.close();
                    dataChannel = null;
                }
                //clearTimeout(someWaitTimer);
                pc.close();
                setConnStat("You have disconnected!");
                document.querySelector("#mainInputText").placeholder = "You have disconnected!";
                document.querySelector("#textChatDisc").innerHTML = "New";
                if(document.getElementById("vidChatDisc")!=null){
                    document.getElementById("vidChatDisc").innerHTML  = "New";
                }
                document.querySelector("#mainInputText").disabled = true;
                socket.emit("end");
            }
            else if(document.getElementById("textChatDisc").innerHTML === "New"){
                setPc(null);
                socket.off('availCon');
                socket.off('offerRec');
                socket.off('answerRec');
                socket.off('candRec');
                //closeSub(chatType);
                document.getElementById("textChatDisc").innerHTML  = "Disconnect";
                if(document.getElementById("vidChatDisc")!=null){
                    document.getElementById("vidChatDisc").innerHTML  = "Disconnect";
                }
                document.querySelector("#mainInputText").placeholder = "Enter text to send";
                //Reset states
                setPc(new RTCPeerConnection(pcConfig));
                setMessageList([]);
                setConnStat("Looking for a Stranger...");
                setRemoteStream(null);
                setStatus(null);
                setIntMatch('');
                //someWaitTimer = setTimeout(()=>{setJoinedQue(false)},3000);
                setJoinedQue(false);
                if(document.querySelector("#textChatDiscClick")!==null){
                document.querySelector("#textChatDiscClick").style.pointerEvents = "none";
                }else if(document.querySelector("#videoTextChatDiscClick")!==null){
                document.querySelector("#videoTextChatDiscClick").style.pointerEvents = "none";
                document.querySelector("#vidChatDiscClick").style.pointerEvents = "none";}
            }
    }
    const updateScroll = () =>{
        var objDiv = document.getElementById("root");
       objDiv.scrollTop = objDiv.scrollHeight;
    }
    const handleHideChat = () =>{
        document.getElementById("text-chat").style.display = "none";
    }
    //Checking peer connectiong and joining the queue
    if(pc!==null){
        if(!joinedQue){
            initSocket(socket,pc,initPCOffer,initPCAnswer);
            if(chatType === 'textChat'){
                joinConnQue(cid,chatType);
                setJoinedQue(true);
            }else if(chatType==='videoChat'){
                joinConnQue(cid,chatType);
                setJoinedQue(true);
            }
        }
    }
    return(
        <React.Fragment>
            <Header title = {headTitle} headTitle={"The Unknown"}/>
            <div className = {chatType==='videoChat'? 'chatWrapper' : 'noWrap'}>
                {(chatType==='videoChat') &&
                <VideoChat localStream={localStream} remoteStream = {remoteStream} connStat = {connStat}
                intMatch = {intMatch}
                handleCloseWindow = {handleCloseWindow} handleDiscon = {handleDiscon}/>}
                <div id="text-chat" className={chatType==='videoChat'? 'text-chat animate videoPart' : 'text-chat animate'}>
                <button id='close' className = {chatType==='videoChat'? 'close-button video-chat-close' : 'close-button'} onClick={handleCloseWindow}>Close</button>
                    {intMatch === '' &&
                    <div>
                        <p className="connStat">{connStat}</p>
                    </div>}
                    {intMatch!=='' &&
                    <div>
                        <p className="connStat" style = {{color:'green'}}>{intMatch}</p>
                    </div>}
                    <div className = "text-chat-wrap">
                        <div id="textChatWin" className="text-chat-window">
                            <div className = "text-chat-subwrap">
                                {messageList.map((message) => (
                                    <Message key={message.mess} message = {message}></Message>
                                ))}
                                <p style = {{clear:'both'}}>{status}</p>
                            </div>
                        </div>
                    </div>
                    <div className={chatType==='videoChat'? 'text-input-elements-min' : 'text-input-elements'}>
                        <div className={chatType==='videoChat'? 'button-2-min-text' : 'button-2'} id={chatType==='videoChat'? 'videoTextChatDiscClick' : 'textChatDiscClick'} style={{pointerEvents:'none'}} onClick={handleDiscon}>
                            <div className="translate-2" id="textChatDiscc"></div>
                            <button type = "submit" id="textChatDisc">Disconnect</button>
                        </div>
                        {(chatType==='videoChat') &&
                            <div id='hidechat' className='button-2-min-text' onClick={handleHideChat}>
                                <div className="translate-2"></div>
                                    <button>Hide</button>
                                </div>}
                        <input id="mainInputText" onKeyUp={handleSendText} onKeyDown={handleUserType} onFocus = {updateScroll} disabled
                        placeholder="Enter Text to send"></input>
                        <div className={chatType==='videoChat'? 'button-2-min-text' : 'button-2'} id="textChat" onClick={handleSendText}>
                            <div className="translate-2" id="textChat"></div>
                                <button id="textChat">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>)}

export default TextChat;