import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { globalContext, socket } from "../../context/auth-context";
import NewChatSearchModal from "./NewChatSearchModal";
import PrivateChat from "./PrivateChat";

const ProfileChats = () => {
  const context = useContext(globalContext);

  const [modalOn, setModalOn] = useState<boolean>(false);
  //ADD FETCH PRIVATEROOM of USER

  //move this into privatechat.tsx
  const [privateMessage, setPrivateMessage] = useState<MessageInterface>({
    message: "",
    author: context.userId,
    timestamp: undefined,
  });

  //move this into privatechat.tsx
  const joinPrivateChat = (userId?: string) => {
    socket.emit("privateRoomJoin", { user1: context.userId, user2: "123" });
  };

  //move this into privatechat.tsx
  const onMessagePrivateChat = () => {
    socket.emit("privateMessage", privateMessage);
  };

  //move this into modal
  const searchUserBody = {
    query: `
      query {
        findUserByName(nickname: "enz") {
          _id
          nickname
        }
      }
    `
  }

  //move this into modal
  const lookForUser = () => {
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(searchUserBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (!data.errors) {
        console.log(data.data.findUserByName);
      } else {
        console.log(data.errors);
      }
    })
  }

  //move this into privatechat.tsx
  useEffect(() => {
    socket.on("sendPrivateMessage", (data) => {
      console.log(data.message);
    });

    return () => {
      socket.off("sendPrivateMessage");
    };
  }, []);

  return (
    <StyledContainer>
      <div className="topBar">
        <h3>Chats</h3>
        <button
          className="profileChats--add-new-chat-button"
          onClick={() => setModalOn(true)}
        >
          Start new chat
        </button>
      </div>
      <StyledProfileChatsContainer>
        <div className="profileChats--left-side">
          <StyledChatsSearch placeholder="Search for a user..." />
          <StyledChatsWindow></StyledChatsWindow>
        </div>
        <div className="profileChats-right-side">
          <StyledCurrentChatWindow>
            <PrivateChat messages={[]} currentChatId=''/>
          </StyledCurrentChatWindow>
          <StyledChatInput
            placeholder="Type a message..."
            value={privateMessage.message}
            onChange={(e) =>
              setPrivateMessage({ ...privateMessage, message: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onMessagePrivateChat();
                setPrivateMessage({ ...privateMessage, message: "" });
              }
            }}
          />
        </div>
      </StyledProfileChatsContainer>
      { modalOn && <NewChatSearchModal close={() => setModalOn(false)}/>}
    </StyledContainer>
  );
};

interface MessageInterface {
  message: string | undefined;
  author: string | undefined;
  timestamp: string | undefined;
}

const StyledContainer = styled.div`
  margin-top: 100px;
  padding: 0 20px;
  width: 100%;
  height: max-content;
  grid-column: 2/4;
  font-family: "LightFont";
  display: flex;
  flex-direction: column;
  gap: 20px;

  .topBar {
    background-color: aliceblue;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    box-shadow: -7px 0px 1px -2px #6564db;
    width: 70%;
    min-width: 600px;

    h3 {
      font-size: 1.8rem;
      align-self: center;
    }
    .profileChats--add-new-chat-button {
      padding: 7.5px 15px;
      background-color: #6564db;
      border: none;
      border-radius: 15px;
      color: white;
      font-family: "LightFont";
      font-size: 1.4rem;
      align-self: center;
    }
  }
`;

const StyledProfileChatsContainer = styled.div`
  background-color: aliceblue;
  border-radius: 15px;
  width: 100%;
  min-width: 600px;
  height: 530px;
  display: grid;
  grid-template-columns: 0.7fr 0.3fr;
  padding: 4px;
  min-width: 600px;
  column-gap: 4px;
  .profileChats--left-side {
    grid-column: 2/3;
    grid-row: 1/1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .profileChats--right-side {
    grid-column: 1/1;
    grid-row: 1/1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const StyledChatsWindow = styled.div`
  background-color: white;
  border-bottom-right-radius: 10px;
  display: flex;
  flex-direction: column;
  height: calc(100% - (1.4rem + 12px));
`;

const StyledChatsSearch = styled.input`
  border: none;
  border-bottom: 1px solid lightgray;
  font-size: 1.4rem;
  padding: 8px 0px 8px 8px;
  border-top-right-radius: 10px;
`;

const StyledChatInput = styled.input`
  border: none;
  border-top: 1px solid lightgray;
  font-size: 1.4rem;
  padding: 8px 0px 8px 8px;
  border-bottom-left-radius: 10px;
  width: 100%;
  height: max-content;
`;

const StyledCurrentChatWindow = styled.div`
  background-color: white;
  border-top-left-radius: 10px;
  display: flex;
  flex-direction: column;
  height: calc(100% - (1.4rem + 20px));
`;

export default ProfileChats;
