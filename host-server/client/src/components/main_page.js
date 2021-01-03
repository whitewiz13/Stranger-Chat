import React, {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client";

//Components
import Header from './header';
import TextChat from './text_chat'

//const ENDPOINT = "http://13.232.140.91"; (AWS)
const ENDPOINT = "https://just-testthis.herokuapp.com/";
//const ENDPOINT = "http://127.0.1:5000/";
const socket = socketIOClient(ENDPOINT);

//------Configuring TURN and STUN servers------
var pcConfig = {
    iceServers: [{
        //urls: [ "stun:stun.l.google.com:19302" ]
        urls: [ "stun:bn-turn1.xirsys.com",
        "stun:stun.l.google.com:19302"
     ]
   }, {
    username: "z0hP4q9X-FlUPCXCrnUxgOw2RmyfFCJRZRk82UpmOoRoOXWD2j00tqu-5LknYPGGAAAAAF70dSh5b2xvMTIz",
    credential: "5a49c916-b6ca-11ea-a0c2-0242ac140004",
    urls: [
        "turn:bn-turn1.xirsys.com:80?transport=udp",
        "turn:bn-turn1.xirsys.com:3478?transport=udp",
        "turn:bn-turn1.xirsys.com:80?transport=tcp",
        "turn:bn-turn1.xirsys.com:3478?transport=tcp",
        "turns:bn-turn1.xirsys.com:443?transport=tcp",
        "turns:bn-turn1.xirsys.com:5349?transport=tcp"
      ]
   }]
};
const MainPage = () => {
    const [chatType,setChatType] = useState('');
    const [cid,setCid] = useState(null);
    const [totalOnline,setTotalOnline] = useState('');
    const [localStream,setLocalStream] = useState(null);
    const handleStateChange = (event)=>{
        setChatType(event.target.id);
    }
    const closeSub = (type) =>{
        if(type === "textChat"){
            if(chatType === "textChat"){
            setChatType('textChat-re')}else{
                setChatType('textChat')
            }
        }else if(type === "videoChat"){
            if(chatType === "videoChat"){
                setChatType('videoChat-re')}else{
                    setChatType('videoChat')
                }
        }else{
            if(localStream!=null){
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
            }
            setChatType('');
        }
    }
    useEffect(() => {
        socket.emit("initCon");
        socket.on("FromAPI", (data,tOnline) => {
            setCid(data);
            setTotalOnline(tOnline);
            //setChatType('videoChat');
        });
    },[]);
    if(cid!==null && typeof cid !== 'undefined'){
        if(chatType === ''){
        return(
            <React.Fragment>
                <Header title = {"Strangers Online : " + totalOnline} headTitle={"The Unknown"}/>
                <div className="main-page">
                    <div className="main-page-sub">
                        <div>
                            <p>Meet strangers from around the world!</p>
                            <p>What could go wrong?</p>
                        </div>
                        <div className="form__group">
                            <input type="text" className="form__input" id="int" placeholder="Enter interests (Seprated by comma)" required=""
                            defaultValue = {localStorage.getItem("interest_list")} />
                            <label htmlFor="name" className="form__label">Enter interests (Seprated by comma)</label>
                        </div>
                        <div className = "main-page-buttons">
                            <div className="button" id="textChat" onClick= { handleStateChange}>
                                <div className="translate" id="textChat"></div>
                                <button id="textChat">Text Chat</button>
                            </div>
                            <div className="button" id="videoChat" onClick= {handleStateChange}>
                                <div className="translate"  id="videoChat"></div>
                                <button id="videoChat">Video Chat</button>
                            </div>
                            <div className="button" id="audioChat" onClick= {handleStateChange}>
                                <div className="translate"  id="audioChat"></div>
                                <button id="audioChat">Audio Chat</button>
                            </div>
                        </div>
                    </div>
                    <div className = "foot">
                        <p>By using the "The Unknown" Web site, and/or related products and/or services ("The Unknown", provided by randomchat.biz LLC), you agree to the following terms: Do not use "The Unknown" if you are under 13. If you are under 18, use it only with a parent/guardian's permission. Do not transmit nudity, sexually harass anyone, publicize other peoples' private information, make statements that defame or libel anyone, violate intellectual property rights, use automated programs to start chats, or behave in any other inappropriate or illegal way on randomchat.biz</p>
                    </div>
                </div>
            </React.Fragment>)
        }else if(chatType === 'textChat' || chatType === 'textChat-re'){
            if(document.getElementById('int')!=null){
                localStorage.setItem("interest_list",document.getElementById('int').value.split(",").map(item => item.trim()));
            }
            //pc = new RTCPeerConnection(pcConfig);
            return(
            <TextChat key={new Date().getMilliseconds()} headTitle={"Strangers Online : " + totalOnline} 
                int = {localStorage.getItem('interest_list').toLowerCase().split(",").map(item => item.trim())}
                pcConfig = {pcConfig} cid = {cid} socket = {socket} closeSub = {closeSub} chatType = 'textChat'/>)
        }else if(chatType === 'videoChat' || chatType === "videoChat-re"){
            if(localStream===null){
                navigator.mediaDevices.getUserMedia({ video:true,
                    audio :true
                }).then((stream)=>{
                    setLocalStream(stream);
                }).catch((e)=>{
                });
            }
            if(document.getElementById('int')!=null){
                localStorage.setItem("interest_list",document.getElementById('int').value.split(",").map(item => item.trim()));
            }
            if(localStream!==null){
            return(
                <TextChat key={new Date().getMilliseconds()} headTitle={"Strangers Online : " + totalOnline} 
                    int = {localStorage.getItem('interest_list').toLowerCase().split(",").map(item => item.trim())}
                    pcConfig={pcConfig} cid = {cid} socket = {socket} closeSub = {closeSub} chatType = "videoChat" localStream = {localStream}/>)
            }else{
                return(<div>Trying to get Camera and Microphone. Please wait.</div>)
            }
        }else if(chatType === 'audioChat'){
            return(
                <div className="main-page">
                    IT WILL BE READY SOON!
                </div>)
        }
    }else{
        return(
            <React.Fragment>
                <Header title = {""} headTitle = {"Loading Strangers..."} disp = {"none"}/>
                <div className="loading">
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>          
            </React.Fragment>)
    }
}

export default MainPage;