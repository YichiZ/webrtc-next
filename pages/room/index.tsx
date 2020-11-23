import { createRef, useEffect, useRef } from "react";
import io from "socket.io-client";

type Payload = {
  target: string;
  caller: string;
  sdp: RTCSessionDescription;
};

const Room = () => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const userVideo = useRef<HTMLVideoElement>();
  const userStream = useRef<MediaStream>();
  const peerRef = useRef<RTCPeerConnection>();

  const partnerVideo = useRef<HTMLVideoElement>();
  const otherUserId = useRef<string>();

  useEffect(() => {
    console.log("useEffect");
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        socketRef.current = io.connect(
          "https://webrtc-next.azurewebsites.net/"
        );
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        userStream.current = stream;

        const roomId = "1";
        socketRef.current.emit("join room", roomId);

        socketRef.current.on("other user", (userId: string) => {
          console.log(`other user: ${userId}`);
          callUser(userId);
          otherUserId.current = userId;
        });

        socketRef.current.on("user joined", (userId: string) => {
          console.log(`user joined: ${userId}`);
          otherUserId.current = userId;
        });

        socketRef.current.on("offer", handleReceiveCall);

        socketRef.current.on("answer", handleAnswer);

        socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
      })
      .catch(console.error);
  }, []);

  function callUser(userId: string) {
    peerRef.current = createPeer(userId);
    userStream.current
      ?.getTracks()
      .forEach((track) => peerRef.current?.addTrack(track, userStream.current));
  }

  function createPeer(userId: string) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "KMUCf*r17QQj",
          username: "yuchiras.zhang@gmail.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userId);

    return peer;
  }

  function handleNegotiationNeededEvent(userId: string) {
    peerRef.current
      .createOffer()
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload: Payload = {
          target: userId,
          caller: socketRef.current.id,
          sdp: peerRef.current?.localDescription as RTCSessionDescription,
        };
        socketRef.current.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  }

  function handleReceiveCall(payload: Payload) {
    console.log(`offer: ${JSON.stringify(payload)}`);
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(payload.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) =>
            peerRef.current?.addTrack(track, userStream.current)
          );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current?.setLocalDescription(answer);
      })
      .then(() => {
        const answer: Payload = {
          target: payload.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current?.emit("answer", answer);
      });
  }

  function handleAnswer(payload: Payload) {
    console.log(`answer: ${JSON.stringify(payload)}`);
    const desc = new RTCSessionDescription(payload.sdp);
    peerRef.current?.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
      const incoming = {
        target: otherUserId.current,
        candidate: e.candidate,
      };
      socketRef.current.emit("ice-candidate", incoming);
    }
  }

  function handleNewICECandidateMsg(incoming) {
    console.log(`ice-candidate: ${JSON.stringify(incoming)}`);
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleTrackEvent(e) {
    partnerVideo.current.srcObject = e.streams[0];
  }

  return (
    <div>
      <video autoPlay ref={userVideo} />
      <p>Other user Id={otherUserId.current}</p>
      <video autoPlay ref={partnerVideo} />
    </div>
  );
};

export default Room;
