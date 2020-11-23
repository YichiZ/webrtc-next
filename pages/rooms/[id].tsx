// import { useEffect, useRef } from "react";
// import io from "socket.io-client";
// import { useRouter } from "next/router";

const Room = () => {
  // const router = useRouter();

  // const userVideo = useRef<HTMLVideoElement>();
  // const partnerVideo = useRef<HTMLVideoElement>();
  // const peerRef = useRef<RTCPeerConnection>();
  // const socketRef = useRef<SocketIOClient.Socket>();
  // const otherUser = useRef<string>();
  // const userStream = useRef<MediaStream>();

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true, video: true })
  //     .then((stream) => {
  //       userVideo?.current?.srcObject = stream;
  //       userStream?.current = stream;

  //       socketRef.current = io.connect("/");
  //       socketRef.current.emit("join room", router.pathname); // need to fix

  //       socketRef.current.on("other user", (userID) => {
  //         callUser(userID);
  //         otherUser.current = userID;
  //       });

  //       socketRef.current.on("user joined", (userID) => {
  //         otherUser.current = userID;
  //       });

  //       socketRef.current.on("offer", handleReceiveCall);

  //       socketRef.current.on("answer", handleAnswer);

  //       socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
  //     });
  // });

  // function callUser(userID) {
  //   peerRef.current = createPeer(userID);
  //   userStream.current
  //     ?.getTracks()
  //     .forEach((track) => peerRef.current?.addTrack(track, userStream.current));
  // }

  // function createPeer(userID) {
  //   const peer = new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: "stun:stun.stunprotocol.org",
  //       },
  //       {
  //         urls: "turn:numb.viagenie.ca",
  //         credential: "KMUCf*r17QQj",
  //         username: "yuchiras.zhang@gmail.com",
  //       },
  //     ],
  //   });

  //   peer.onicecandidate = handleICECandidateEvent;
  //   peer.ontrack = handleTrackEvent;
  //   peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

  //   return peer;
  // }

  // function handleNegotiationNeededEvent(userID) {
  //   peerRef.current
  //     .createOffer()
  //     .then((offer) => {
  //       return peerRef.current.setLocalDescription(offer);
  //     })
  //     .then(() => {})
  //     .catch((e) => console.log(e));
  // }

  // function handleReceiveCall(incoming) {
  //   peerRef.current = createPeer();
  //   const desc = new RTCSessionDescription(incoming.sdp);
  //   peerRef.current
  //     .setRemoteDescription(desc)
  //     .then(() => {
  //       userStream.current
  //         ?.getTracks()
  //         .forEach((track) =>
  //           peerRef.current?.addTrack(track, userStream.current)
  //         );
  //     })
  //     .then(() => {
  //       return peerRef.current?.createAnswer();
  //     })
  //     .then(() => {
  //       const payload = {
  //         target: incoming.caller,
  //         caller: socketRef.current?.id,
  //         sdp: peerRef.current?.localDescription,
  //       };
  //       socketRef.current?.emit("answer", payload);
  //     });
  // }

  // function handleAnswer(message: string) {
  //   const desc = new RTCSessionDescription(message.sdp);
  //   peerRef.current?.setRemoteDescription(desc).catch((e) => console.log(e));
  // }

  // function handleICECandidateEvent(e) {
  //   if (e.candidate) {
  //     const payload = {
  //       target: otherUser.current,
  //       candidate: e.candidate,
  //     };
  //     socketRef.current?.emit("ice-candidate", payload);
  //   }
  // }

  // function handleNewICECandidateMsg(incoming) {
  //   const candidate = new RTCIceCandidate(incoming);

  //   peerRef.current?.addIceCandidate(candidate).catch((e) => console.log(e));
  // }

  // function handleTrackEvent(e) {
  //   partnerVideo.current.srcObject = e.streams[0];
  // }

  return (
    <div>
      {/* <video autoPlay ref={userVideo} />
      <video autoPlay ref={partnerVideo} /> */}
    </div>
  );
};

export default Room;
