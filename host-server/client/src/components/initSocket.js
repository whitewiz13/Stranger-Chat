export const initSocket = (socket,pc,initPCOffer,initPCAnswer) =>{
    socket.on('availCon',(data,matchInt)=>{
        if(pc.signalingState!=='closed'){
            if(matchInt!=='/.../'){
                initPCOffer(data,matchInt.join(', '),pc);
            }else{
                initPCOffer(data,matchInt,pc);
            }
        }else{
            console.log(pc.signalingState);
        }
    });
    socket.on('offerRec',offer=>{
        if(pc.signalingState!=='closed'){
            initPCAnswer(offer.offer,offer.from,pc);
        }
    });
    socket.on('answerRec',answer=>{
        if(pc.signalingState!=='closed'){
            pc.setRemoteDescription(answer.answer);
        }
    });
    socket.on('candRec',can =>{
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: can.label,
            candidate: can.candidate
        })
        if(pc.signalingState!=='closed'){
            pc.addIceCandidate(candidate);
        }
    });
}