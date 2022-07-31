import React, { useContext } from "react";
import styled from "styled-components";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import { globalContext } from "../../context/auth-context";
const PrivateChat: React.FC<IProps> = ({
  currentChatId,
  messages,
  otherUser,
  lastReadMessageIndex,
}) => {
  const context = useContext(globalContext);
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

  const check = (idx: number, messages: any[]) => {
    let temp: any = lastReadMessageIndex;
    if (messages.length - temp - 1 === idx) {
      lastReadMessageIndex = undefined;
    }
    return temp && messages.length - temp - 1;
  };
  return (
    <StyledContainer
      currentChatId={currentChatId}
      messages={messages}
      otherUser={otherUser}
      lastReadMessageIndex={lastReadMessageIndex}
    >
      {!currentChatId && (
        <span className="noChatSelected">
          Click a chat on the left-hand side to show messages...
        </span>
      )}
      {currentChatId && (
        <>
          <div className="chatMessagesContainer">
            {messages.length > 0 &&
              messages.map((x: any, idx: number) => {
                return (
                  <>
                    <StyledMessageSingle
                      className="singleMessage"
                      key={idx}
                      avatarBackground={x.author.avatarBackground}
                      avatarIconColor={x.author.avatarIconColor}
                      isMessageMine={x.author._id === context.userId}
                    >
                      {x.author._id !== context.userId && (
                        <div className="userBackground">
                          <img
                            alt=""
                            src={avatarIcons[x.author.avatarIcon]}
                            className="avatarIcon"
                          />
                        </div>
                      )}
                      <div
                        className={
                          x.author._id === context.userId
                            ? "newMessage mine"
                            : "newMessage"
                        }
                      >
                        {x.message}
                      </div>
                      <span
                        className={
                          x.author._id === context.userId
                            ? "timestampMine"
                            : "timestamp"
                        }
                      >
                        {timeDiff(x.timestamp)}
                      </span>
                    </StyledMessageSingle>
                    {check(idx, messages) === idx && (
                      <div className="newDivider" key={"newDivider" + idx}>
                        <span className="crossline-red" />
                        New messages
                        <span className="crossline-red" />
                      </div>
                    )}
                    {idx + 1 < messages.length &&
                    dayDiff(x.timestamp) !==
                      dayDiff(messages[idx + 1].timestamp) ? (
                      <div className="dayDivider" key={"divider" + idx}>
                        <span className="crossline" />
                        {dayDiff(x.timestamp)}
                        <span className="crossline" />
                      </div>
                    ) : (
                      idx + 1 === messages.length && (
                        <div className="dayDivider" key={"divider" + idx}>
                          <span className="crossline" />
                          {dayDiff(x.timestamp)}
                          <span className="crossline" />
                        </div>
                      )
                    )}
                  </>
                );
              })}
          </div>
        </>
      )}
    </StyledContainer>
  );
};

interface IProps {
  currentChatId: string;
  messages: any[];
  otherUser: {
    _id: string;
    nickname: string;
    avatarIcon: string;
    avatarIconColor: string;
    avatarBackground: string;
  };
  lastReadMessageIndex: number | undefined;
}

const StyledContainer = styled.div<IProps>`
  background-color: ${(props) => (props.currentChatId ? "white" : "aliceblue")};
  display: ${(props) => (props.currentChatId ? "block" : "flex")};
  grid-row: 2/2;
  height: 430px;
  .chatMessagesContainer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    gap: 5px;
    overflow-y: scroll;
    padding: 0 3px 5px 5px;
  }
  .noChatSelected {
    text-align: center;
    align-self: center;
    justify-self: center;
    width: 100%;
    font-size: 2rem;
  }
  .dayDivider, .newDivider {
    font-size: 1.3rem;
    width: 96%;
    align-self: center;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    gap: 5px;
    color: gray;
    padding: 5px 0;
    .crossline, .crossline-red {
      height: 50%;
      border-bottom: 1px solid lightgray;
    }
    .crossline-red {
      border-color: tomato;
    }
  }
  .newDivider {
    color: tomato;
  }
`;

interface MessageSingleProps {
  avatarBackground: string;
  avatarIconColor: string;
  isMessageMine: boolean;
}

const StyledMessageSingle = styled.div<MessageSingleProps>`
  /* grid-column: 1/3; */
  max-width: 80%;
  word-wrap: break-word;
  word-break: break-all;
  align-self: ${(props) => (props.isMessageMine ? "flex-end" : "flex-start")};
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  position: relative;
  .newMessage {
    background-color: #e9e9e9;
    border-radius: 10px;
    font-size: 1.4rem;
    padding: 5px 10px;
    grid-column: 2/2;
    grid-row: 1/1;
    align-self: flex-end;
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
    .avatarIcon {
      position: absolute;
      top: calc(50% - 11px);
      left: calc(50% - 11px);
      width: 22px;
      filter: invert(
        ${(props) => (props.avatarIconColor === "#000000" ? 0 : 1)}
      );
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
  }

  .timestampMine {
    grid-column: 1/1;
    justify-self: end;
    padding-left: 0;
    padding-right: 5px;
  }
`;

export default PrivateChat;
