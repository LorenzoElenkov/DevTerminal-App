import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { globalContext, socket } from "../../context/auth-context";
import sendMessageIcon from "../images/sendMessageIcon.png";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";

const ProjectChat: React.FC<ProjectChatProps> = (props) => {
  const context = useContext(globalContext);

  const [chosenEmoji, setChosenEmoji] = useState<any>(null);

  const [messageText, setMessageText] = useState<string>("");

  const chatWindowRef = useRef<any>(null);

  const [chatMessages, setChatMessages] = useState<any>([]);

  const handleUserData = (id: string, type: string) => {
    for (let i in props.users) {
      if (id === props.users[i].user._id) {
        if (type === "avatarIcon") {
          return avatarIcons[props.users[i].user.avatarIcon];
        } else if (type === "avatarIconColor") {
          if (props.users[i].user.avatarIconColor === "#fff") {
            return 1;
          } else {
            return 0;
          }
        } else if (type === "avatarBackground") {
          return props.users[i].user.avatarBackground;
        }
      }
    }
  };

  const fetchOnlineSockets = () => {
    socket.emit("fetch_room_online_users", props.projectId);
  };

  const timeDiff = (time: string | number) => {
    const theTime = new Date(Number(time));
    const hours = theTime.getHours();
    const minutes = theTime.getMinutes();
    return `${
      hours < 12 && hours > 0
        ? hours
        : hours > 12 && hours < 24
        ? hours - 12
        : (hours === 12 || hours === 0) && 12
    }:${minutes < 10 ? "0" + minutes : minutes} ${hours < 12 ? "AM" : "PM"}`;
  };

  const dayDiff = (time: string | number) => {
    const theTime = new Date(Number(time));
    return `${theTime.toString().split(" ")[2]} ${
      theTime.toString().split(" ")[1]
    } ${theTime.toString().split(" ")[3]}`;
  };

  const requestBody = {
    query: `
            mutation {
              postProjectMessage(
                chatId:"${props.chatId}",
                message:"${messageText}",
                author:"${context.userId}",
                timestamp:"${new Date().getTime()}") 
                {
                  message
                }
            }
          `,
  };

  const requestBody2 = {
    query: `
            query {
              fetchProjectMessages(chatId: "${props.chatId}") {
                message
                author {
                  _id
                  avatarIcon
                  avatarIconColor
                  avatarBackground
                }
                timestamp
              }
            }
    `,
  };

  const fetchMessagesOnMount = () => {
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody2),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.errors) {
          setChatMessages(data.data.fetchProjectMessages);
        }
      });
  };

  const submitHandler = (e?: any) => {
    e?.preventDefault();
    if (!messageText) return;
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.errors) {
          socket.emit("roomMessage", {
            room: props.projectId,
            author: {
              _id: context.userId,
              avatarIcon: context.avatarIcon,
              avatarIconColor: context.avatarIconColor,
              avatarBackground: context.avatarBackground,
            },
            message: messageText,
            timestamp: new Date().getTime(),
          });
        } else {
          if (data.errors[0].message) {
            console.log(data.errors[0].message);
          }
        }
      })
      .catch((err) => console.log(err));

    setMessageText("");
  };

  useEffect(() => {
    fetchOnlineSockets();
    fetchMessagesOnMount();
    socket.on("sendRoomMessage", (data) => {
      let newMessage = {
        message: data.message,
        author: {
          _id: data.author._id,
          avatarIcon: data.author.avatarIcon,
          avatarIconColor: data.author.avatarIconColor,
          avatarBackground: data.author.avatarBackground,
        },
        timestamp: data.timestamp,
      };
      setChatMessages((prevMessages: any) => [newMessage, ...prevMessages]);
    });

    return () => {
      socket.off("sendRoomMessage");
    };
  }, []);

  useEffect(() => {
    chatWindowRef.current?.scroll({ top: "100%", behavior: "smooth" });
  }, [chatMessages]);

  const onEnterHandler = (e: any) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  };

  const checkIfMember = (userId: string) => {
    for (let i in props.users) {
      if (props.users[i].user._id === userId) {
        return true;
      } else {
        if (Number(i) === props.users.length - 1) {
          return false;
        }
      }
    }
  };

  return (
    <StyledChatContainer>
      <span className="containerTitle">Project chat</span>
      <div className="chatWindow" ref={chatWindowRef}>
        {chatMessages.length > 0 &&
          chatMessages.map((el: any, idx: number) => {
            return (
              <>
                <StyledMessageSingle
                  key={idx}
                  avatarBackground={el.author.avatarBackground}
                  avatarIconColor={el.author.avatarIconColor}
                  isMessageMine={el.author._id === context.userId}
                  isMember={checkIfMember(el.author._id)}
                >
                  {el.author._id !== context.userId && (
                    <div
                      className="userBackground"
                      key={`userBackground ${idx}`}
                    >
                      <img
                        alt=""
                        src={avatarIcons[el.author.avatarIcon]}
                        className="avatarIcon"
                        key={`userIcon ${idx}`}
                      />
                    </div>
                  )}
                  <div
                    className={
                      el.author._id === context.userId
                        ? "newMessage mine"
                        : "newMessage"
                    }
                    key={`userMessage ${idx}`}
                  >
                    {el.message}
                  </div>
                  <span
                    className={
                      el.author._id === context.userId
                        ? "timestampMine"
                        : "timestamp"
                    }
                    key={`userTimestamp ${idx}`}
                  >
                    {timeDiff(el.timestamp)}
                  </span>
                </StyledMessageSingle>
                {idx + 1 < chatMessages.length &&
                dayDiff(el.timestamp) !==
                  dayDiff(chatMessages[idx + 1].timestamp) ? (
                  <div className="dayDivider" key={"divider" + idx}>
                    <span className="crossline" key={`crosslineleft ${idx}`} />
                    {dayDiff(el.timestamp)}
                    <span className="crossline" key={`crosslineright ${idx}`} />
                  </div>
                ) : (
                  idx + 1 === chatMessages.length && (
                    <div className="dayDivider" key={"divider" + idx}>
                      <span
                        className="crossline"
                        key={`crosslineleft ${idx}`}
                      />
                      {dayDiff(el.timestamp)}
                      <span
                        className="crossline"
                        key={`crosslineright ${idx}`}
                      />
                    </div>
                  )
                )}
              </>
            );
          })}
      </div>
      <div className="messageContainer">
        <input
          type="text"
          className="messageInput"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e: any) => setMessageText(e.target.value)}
          onKeyDown={onEnterHandler}
        />
        <button className="sendMessageBut" onClick={submitHandler} />
      </div>
    </StyledChatContainer>
  );
};

interface ProjectChatProps {
  projectId: string;
  users: any;
  chatId: string;
}

interface MessageSingleProps {
  avatarBackground: string;
  avatarIconColor: string;
  isMessageMine: boolean;
  isMember: boolean | undefined;
}

const StyledMessageSingle = styled.div<MessageSingleProps>`
  grid-column: 1/3;
  max-width: 80%;
  word-wrap: break-word;
  word-break: break-all;
  align-self: ${(props) => (props.isMessageMine ? "flex-end" : "flex-start")};
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  opacity: ${(props) => (props.isMember ? 1 : 1)};
  position: relative;
  cursor: auto;
  &:hover::after {
    content: "This message belongs to someone who is not part of this project anymore";
    position: absolute;
    top: -25%;
    left: 50%;
    width: max-content;
    height: max-content;
    padding: 3px 6px;
    background-color: tomato;
    display: ${(props) => (props.isMember ? "none" : "block")};
    color: white;
    font-size: 1.2rem;
    opacity: 1;
  }
  .newMessage {
    background-color: #e9e9e9;
    border-radius: 10px;
    font-size: 1.4rem;
    padding: 5px 10px;
    grid-column: 2/2;
    grid-row: 1/1;
    opacity: ${props => props.isMember ? 1 : 0.5};
  }

  .mine {
    background-color: #6564db;
    color: white;
  }

  .userBackground {
    grid-column: 1/1;
    grid-row: 1/1;
    position: relative;
    min-width: 28px;
    max-height: 28px;
    margin-right: 5px;
    background-color: ${(props) => props.avatarBackground};
    border-radius: 50%;
    opacity: ${(props) => (props.isMember ? 1 : 0.5)};
    .avatarIcon {
      position: absolute;
      top: calc(50% - 11px);
      left: calc(50% - 11px);
      width: 22px;
      filter: invert(${(props) => (props.avatarIconColor === "#fff" ? 1 : 0)});
      opacity: ${(props) => (props.isMember ? 1 : 0.5)};
    }
  }

  .timestamp,
  .timestampMine {
    font-size: 1rem;
    color: gray;
    grid-column: 3/3;
    grid-row: 1/1;
    align-self: center;
    padding-left: 5px;
    opacity: ${props => props.isMember ? 1 : 0.5};
  }

  .timestampMine {
    grid-column: 1/1;
    justify-self: end;
    padding-left: 0;
    padding-right: 5px;
  }
`;

const StyledChatContainer = styled.div`
  grid-row: 3/3;
  width: 100%;
  height: max-content;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 250px max-content;
  padding: 20px;
  background-color: aliceblue;
  border-radius: 15px;
  .dayDivider {
    font-size: 1.3rem;
    width: 96%;
    align-self: center;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    gap: 5px;
    color: gray;
    padding: 5px 0;
    .crossline {
      height: 50%;
      border-bottom: 1px solid lightgray;
    }
  }
  .containerTitle {
    grid-column: 1/3;
    grid-row: 1/1;
    font-size: 2rem;
    margin-bottom: 20px;
  }
  .members {
    grid-column: 1/1;
    grid-row: 2/4;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border: 1px solid lightgray;
    background-color: white;
    .membersTitle {
      font-size: 1.4rem;
      padding: 5px 10px;
      background-color: #5fa3f7;
      color: white;
      text-align: center;
    }
    .membersList {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }

  .chatWindow {
    grid-column: 1/3;
    grid-row: 2/2;
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    gap: 5px;
    border: 1px solid lightgray;
    background-color: white;
    align-items: flex-end;
    overflow-y: scroll;
    padding: 3px 5px;
  }

  .messageContainer {
    grid-column: 1/3;
    grid-row: 3/3;
    display: flex;

    .messageInput {
      width: 100%;
      font-size: 1.4rem;
      padding: 7.5px 0 7.5px 5px;
      border: 1px solid lightgray;
      border-top: none;
    }
    .sendMessageBut {
      width: 50px;
      background-image: url(${sendMessageIcon});
      background-repeat: no-repeat;
      background-size: 60%;
      background-color: #9a9b24;
      filter: invert(1);
      border: none;
      background-position: 50% 50%;
    }
  }
`;

export default ProjectChat;
