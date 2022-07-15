import React from "react";
import styled from "styled-components";

const PrivateChat: React.FC<IProps> = ({ currentChatId, messages }) => {
  return (
    <StyledContainer currentChatId={currentChatId} messages={messages}>
      {!currentChatId ? (
        <span className="noChatSelected">Click a chat on the left-hand side to show messages...</span>
      ) : (
        "I will show messages soon!"
      )}
    </StyledContainer>
  );
};

interface IProps {
  currentChatId: string;
  messages: [];
}

const StyledContainer = styled.div<IProps>`
  padding: 0px 3px 3px 3px;
  display: flex;
  width: 100%;
  height: 100%;

  .noChatSelected {
    text-align: center;
    width: 100%;
    align-self: center;
    font-size: 2rem;
  }
`;

export default PrivateChat;
