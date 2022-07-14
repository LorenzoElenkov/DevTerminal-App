import React from "react";
import styled from "styled-components";

const ProfileChats = () => {
  return (
    <StyledContainer>
      <div className="topBar">
        <h3>Chats</h3>
        <button className="profileChats--add-new-chat-button">
          Start new chat
        </button>
      </div>
      <StyledProfileChatsContainer>
        <div className="profileChats--left-side">
            <StyledChatsSearch placeholder="Search for a user..." />
            <StyledChatsWindow>
                
            </StyledChatsWindow>
        </div>
        <div className="profileChats-right-side">
            <StyledCurrentChatWindow>

            </StyledCurrentChatWindow>
            <StyledChatInput placeholder="Type a message..." />
        </div>
      </StyledProfileChatsContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  margin-top: 100px;
  padding: 0 20px;
  width: 100%;
  height: max-content;
  grid-column: 2/3;
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
  grid-template-columns: 1fr 2fr;
  padding: 4px;

  .profileChats--left-side {
      grid-column: 1/1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  }
  .profileChats--right-side {
      grid-column: 2/3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  }
`;

const StyledChatsWindow = styled.div`
  background-color: white;
  border-bottom-left-radius: 10px;
  display: flex;
  flex-direction: column;
  height: calc(100% - (1.4rem + 12px));
`;

const StyledChatsSearch = styled.input`
  border: none;
  border-bottom: 1px solid lightgray;
  font-size: 1.4rem;
  padding: 4px 0px 4px 4px;
  border-top-left-radius: 10px;
`;

const StyledChatInput = styled.input`
  border: none;
  border-top: 1px solid lightgray;
  font-size: 1.4rem;
  padding: 4px 0px 4px 4px;
  border-bottom-right-radius: 10px;
  margin-left: 4px;
  width: calc(100% - 4px);
  height: max-content;
`;

const StyledCurrentChatWindow = styled.div`
  background-color: white;
  border-top-right-radius: 10px;
  margin-left: 4px;
  display: flex;
  flex-direction: column;
  height: calc(100% - (1.4rem + 12px));
`;

export default ProfileChats;
