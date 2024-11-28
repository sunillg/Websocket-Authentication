import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

interface Message {
  text: string;
  type: "text" | "audio" | "video";
  content?: Blob;
  metadata?: { name: string; size: number; type: string };
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [audioChunks, setAudioChunks] = useState<Uint8Array[]>([]);
  const [videoChunks, setVideoChunks] = useState<Uint8Array[]>([]);
  const [mediaMetadata, setMediaMetadata] = useState<
    | {
        name: string;
        size: number;
        type: string;
      }
    | undefined
  >(undefined);

  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Server: ${msg}`, type: "text" },
      ]);
    });

    socket.on("audio_metadata", (metadata) => setMediaMetadata(metadata));
    socket.on("video_metadata", (metadata) => setMediaMetadata(metadata));

    socket.on("audio_chunk", (chunk) => {
      setAudioChunks((prev) => [...prev, new Uint8Array(chunk)]);
    });
    socket.on("audio_end", () => {
      const audioBlob = new Blob(audioChunks, {
        type: mediaMetadata?.type || "audio/mp3",
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "",
          type: "audio",
          content: audioBlob,
          metadata: mediaMetadata,
        },
      ]);
      setAudioChunks([]);
      setMediaMetadata(undefined);
    });

    socket.on("video_chunk", (chunk) => {
      setVideoChunks((prev) => [...prev, new Uint8Array(chunk)]);
    });
    socket.on("video_end", () => {
      const videoBlob = new Blob(videoChunks, {
        type: mediaMetadata?.type || "video/mp4",
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "",
          type: "video",
          content: videoBlob,
          metadata: mediaMetadata,
        },
      ]);
      setVideoChunks([]);
      setMediaMetadata(undefined);
    });

    return () => {
      socket.off("receive_message");
      socket.off("audio_metadata");
      socket.off("video_metadata");
      socket.off("audio_chunk");
      socket.off("audio_end");
      socket.off("video_chunk");
      socket.off("video_end");
    };
  }, [audioChunks, videoChunks, mediaMetadata]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `You: ${message}`, type: "text" },
      ]);
      setMessage("");
    }
  };
  const handlePlay = (msg: Message, index: number) => {
    const mediaRef =
      msg.type === "audio"
        ? audioRefs.current[index]
        : videoRefs.current[index];

    if (msg.content && mediaRef) {
      const url = URL.createObjectURL(msg.content);
      mediaRef.src = url;
      mediaRef.play();
      mediaRef.onended = () => {
        URL.revokeObjectURL(url);
      };
    }
  };

  const handleStop = (msg: Message, index: number) => {
    const mediaRef =
      msg.type === "audio"
        ? audioRefs.current[index]
        : videoRefs.current[index];
    if (mediaRef) {
      mediaRef.pause();
      mediaRef.currentTime = 0;
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "500px",
        height: "380px",
        margin: "auto",
        overflowY: "auto",
      }}
    >
      <h2>Chat</h2>
      <div
        style={{
          maxHeight: "200px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              padding: "5px",
              background: "#f1f1f1",
              marginBottom: "5px",
              borderRadius: "4px",
            }}
          >
            {msg.text}
            {msg.metadata && (
              <div style={{ fontSize: "0.9em", color: "#555" }}>
                <p>Name: {msg.metadata.name}</p>
                <p>Size: {msg.metadata.size}</p>
                <p>Type: {msg.metadata.type}</p>
                {msg.content && (
                  <>
                    {msg.type === "audio" ? (
                      <audio
                        ref={(el) => (audioRefs.current[index] = el)}
                        controls
                        style={{ display: "none" }}
                      />
                    ) : (
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        controls
                        style={{ width: "100%" }}
                      />
                    )}
                    <button
                      onClick={() => handlePlay(msg, index)}
                      style={{
                        marginTop: "5px",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        backgroundColor: "blue",
                        color: "white",
                        marginRight: "5px",
                      }}
                    >
                      Play {msg.type}
                    </button>
                    <button
                      onClick={() => handleStop(msg, index)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        backgroundColor: "red",
                        color: "white",
                      }}
                    >
                      Stop {msg.type}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your need:(Ex: '1' for help)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          padding: "8px",
          width: "100%",
          marginBottom: "5px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          backgroundColor: "coral",
          color: "white",
          border: "none",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;