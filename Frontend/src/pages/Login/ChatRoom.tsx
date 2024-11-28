import React, { Key, ReactNode, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import "./ChatRoom.css";
import axios from "axios";

let socket: Socket;

interface Message {
  sender: ReactNode;
  id: Key | null | undefined;
  content: any;
  user: string;
  text: string;
  fileUrl?: string;
  fileType?: string;
}

interface User {
  roomname: string;
}

const ChatRoom: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [searchedNumber, setSearchedNumber] = useState<string>("");
  const [searchedUser, setSearchedUser] = useState<string>(
    "Search and start your conversation"
  );
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const socketUrl = "http://localhost:3000";
  const loginMobile: any = localStorage.getItem("mobileNumber");
  const roleId = localStorage.getItem("roleId")

  useEffect(() => {
    const gettingRecentUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chatRoom/${loginMobile}`
        );
        setUsers(response.data.usersDetails);
      } catch (error) {
        console.log(error);
      }
    };
    gettingRecentUser();
  }, [loginMobile]);

  const searchMobileNumber = async (mobileNumber: string) => {
    if (mobileNumber.length === 10) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/findMobileNumber/${roleId}/${mobileNumber}`
        );
        setSearchedUser(response.data.username);

        if (response.data.valid) {
          const roomname = [loginMobile, mobileNumber].sort().join("_");
          setRoom(roomname);

          socket = io(socketUrl);

          socket.emit(
            "join",
            {
              roomname,
              senderMobileNumber: loginMobile,
              receiverMobileNumber: mobileNumber,
            },
            (err: string) => {
              if (err) {
                console.log(err);
              }
            }
          );

          socket.on("message", (msg: Message) => {
            if (msg.text === "Online") {
              setIsOnline(true);
            }
            setMessages((prevMsg) => [...prevMsg, msg]);
          });

          socket.on("roomMembers", (usrs: User[]) => {});

          const response1 = await axios.get(
            `http://localhost:3000/api/getRoomMessages/${roomname}`
          );
          setMessages(response1.data.messages);

          return () => {
            socket.disconnect();
            socket.off();
          };
        } else {
          alert("Mobile number not valid.");
        }
      } catch (error) {
        console.error("Error searching mobile number:", error);
      }
    } else {
      alert("Please enter a valid mobile number.");
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit(
        "sendMessage",
        { roomname: room, sender: loginMobile, message },
        () => setMessage("")
      );
    }
  };

  const handleFileSend = async () => {
    if (file && room) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomname", room);
      formData.append("sender", loginMobile || "");
      formData.append("content", "");

      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        socket.emit(
          "sendFile",
          {
            roomname: room,
            sender: loginMobile,
            fileUrl: data.fileUrl,
            fileType: file.type,
          },
          () => setFile(null)
        );
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          alert(error.response.data.message);
        } else {
          alert("File Uploaded Successfully...");
        }
      }
    }
  };

  return (
    <div className="full-div container mt-4">
      <div className="row chat-window" id="chat_window_1">
        <div className="col-xs-4 col-md-4">
          <p>Recent Users</p>
          <ul>
            {users.map((user, i) => (
              <li
                key={i}
                className="listUsers"
                onClick={() =>
                  searchMobileNumber(
                    user.roomname.replace(
                      new RegExp(`${loginMobile}|[^a-zA-Z0-9]`, "g"),
                      ""
                    )
                  )
                }
              >
                {user.roomname.replace(
                  new RegExp(`${loginMobile}|[^a-zA-Z0-9]`, "g"),
                  ""
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-xs-8 col-md-8">
          {roleId == '1' ? (<div className="search-bar">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Mobile Number"
              value={searchedNumber}
              onChange={(e) => setSearchedNumber(e.target.value)}
            />
            <button onClick={() => searchMobileNumber(searchedNumber)}>
              Search
            </button>
          </div>):null}

          <div className="panel panel-default">
            <div className="panel-heading top-bar">
              <div className="col-md-12 col-xs-8">
                <h3 className="panel-title">
                  <span className="glyphicon glyphicon-comment"></span>
                  {room}
                </h3>
                {isOnline && <p style={{ color: "white" }}>Online</p>}
              </div>
            </div>
            <div className="panel-body msg_container_base" id="chat_body">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`row msg_container ${
                    msg.sender === loginMobile ? "base_sent" : "base_receive"
                  }`}
                >
                  <div className="col-xs-10 col-md-10">
                    <div
                      className={`messages ${
                        msg.sender === loginMobile ? "msg_sent" : "msg_receive"
                      }`}
                    >
                      {/* {msg.fileUrl ? (
                        <>
                          {msg.fileType?.startsWith("audio") && (
                            <div>
                              <audio controls>
                                <source
                                  src={`http://localhost:3000${msg.fileUrl}`}
                                  type="audio/mp3"
                                />
                              </audio>
                            </div>
                          )}
                          {msg.fileType?.startsWith("video") && (
                            <div>
                              <video controls width="500">
                                <source
                                  src={`http://localhost:3000${msg.fileUrl}`}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                        </>
                      ) : (
                        <p>{msg.content || msg.text}</p>
                      )} */}

                      {msg.fileUrl ? (
                        <>
                           {msg.fileType?.startsWith("audio") && (
                            <div>
                              <p>Audio file received.</p>
                              <button
                                onClick={() => {
                                  const url = `http://localhost:3000${msg.fileUrl}`;
                                  localStorage.setItem("audio", url);
                                  window.open(url);
                                }}
                              >
                                Download Audio
                              </button>
                            </div>
                          )} 

                          {msg.fileType?.startsWith("video") && (
                            <div>
                              <p>Video file received.</p>
                              <button
                                onClick={() => {
                                  const url = `http://localhost:3000${msg.fileUrl}`;
                                  localStorage.setItem("video", url);
                                  window.open(url);
                                }}
                              >
                                Download Video
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p>{msg.content || msg.text}</p>
                      )}

                      <time>{msg.user}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="panel-footer">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control input-sm chat_input"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-primary btn-sm"
                    id="btn-chat"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </span>
              </div>
              <div className="input-group mt-2">
                <input
                  type="file"
                  className="form-control input-sm"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                  className="btn btn-primary btn-sm"
                  id="btn-chat"
                  onClick={handleFileSend}
                >
                  Send File
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
