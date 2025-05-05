import React, { useEffect, useCallback, useState } from 'react'
import {useSocket} from "../providers/Socket"
import {usePeer} from "../providers/Peer"
import ReactPlayer from 'react-player'
const RoomPage = () => {
    const {socket} = useSocket();
    const {peer,createOffer, createAnswer, setRemoteAns, sendStream, remoteStream} = usePeer();
    const [myStream, setMystream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState(null);
    const handleNewUserJoined = useCallback(async(data) =>{
        const {emailId} = data;
        console.log('new user joined', emailId);
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer });
        setRemoteEmailId(emailId);
      },
      [createOffer,socket]
    );

    const handleIncommingCall = useCallback(async(data) => {
      const {from, offer} = data;
      console.log("Incomming call from", from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", {emailId: from, ans});
    },[createAnswer,socket]);

    const handleCallAccepted = useCallback(async(data) => {
      const {ans} = data;
      console.log('call accpeted', ans);
      await setRemoteAns(ans);
    },[])

    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined);
        socket.on('incomming-call',handleIncommingCall);
        socket.on('call-accepted', handleCallAccepted);

        return ()=>{
          socket.off('user-joined',handleNewUserJoined);
          socket.off('incomming-call',handleIncommingCall);
          socket.off('call-accepted', handleCallAccepted);
        }
    },[handleCallAccepted, handleIncommingCall, handleNewUserJoined,socket])

    const handleNegotiation = useCallback(() =>{
      const localOffer = peer.localDescription;
      socket.emit('call-user', {emailId: remoteEmailId, offer: localOffer});
    },[])
    useEffect(()=>{
      peer.addEventListener("negotiation need", handleNegotiation);
      return ()=>{
        peer.removeEventListener("negotiation need", handleNegotiation);

      }
    },[])
    const getUserMediaStream = useCallback(async()=>{
      const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true });
      setMystream(stream);
    },[])
    useEffect(()=>{
      getUserMediaStream();
    },[getUserMediaStream])
  return (
    <div className='room-page-container'>
        <h1>RoomPage</h1>
        <h4>You are connected to {remoteEmailId}</h4>
        <button onClick={(e)=> sendStream(myStream)}>Send My video</button>
        <ReactPlayer url = {myStream} playing  />
        <ReactPlayer url = {remoteStream} playing  />
    </div>
  )
}

export default RoomPage