import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledModal } from "../KickMemberModal/KickMemberModal";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import { socket } from "../../context/auth-context";
import { globalContext } from "../../context/auth-context";
const NewChatSearchModal: React.FC<IProps> = (props) => {
  const backdropRef = useRef(null);
  const context = useContext(globalContext);
  const [searchResults, setSearchResults] = useState([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chosenUser, setChosenUser] = useState<ChosenUserProps>({
    chosen: false,
    nickname: "",
    _id: "",
    avatarIcon: "",
    avatarIconColor: "",
    avatarBackground: "",
  });

  useEffect(() => {
    if (props.dataFromProfile) {
      setChosenUser({
        chosen: true,
        nickname: props.dataFromProfile.nickname,
        _id: props.dataFromProfile._id,
        avatarIcon: props.dataFromProfile.avatarIcon,
        avatarIconColor: props.dataFromProfile.avatarIconColor,
        avatarBackground: props.dataFromProfile.avatarBackground,
      })
    }
  },[]);

  const [inputText, setInputText] = useState<string>("");

  const handleClickOutside = (e: any) => {
    if (e.target === backdropRef.current) {
      props.close();
    }
  };


  useEffect(() => {
    socket.on("onPrivateRoomJoined", () => {
      joinChatRoom();
    });

    return () => {
      socket.off("onPrivateRoomJoined");
    };
  }, []);

  const joinRoomBody = {
    query: `
        mutation {
          createPrivateChat(thisUserId: "${context.userId}", targetUserId: "${chosenUser._id}") {
            status
            chat {
              _id
              userOneReadUntil {
                id
                messageIndex
              }
              userTwoReadUntil {
                id
                messageIndex
              }
              users {
                _id
                nickname
                avatarIcon
                avatarIconColor
                avatarBackground
              }
            }
          }
        }
      `,
  };

  const joinChatRoom = () => {
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(joinRoomBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.errors) {
          props.triggerRefresh({
            status: data.data.createPrivateChat.status,
            chat: {...data.data.createPrivateChat.chat, messages: []},
          });
          socket.emit("privateRoomJoin", {
            chatId: data.data.createPrivateChat.chat._id,
            otherUser: chosenUser,
            thisUser: {
              _id: context.userId,
              nickname: context.nickname,
              avatarIcon: context.avatarIcon,
              avatarIconColor: context.avatarIconColor,
              avatarBackground: context.avatarBackground,
            },
            userOne: data.data.createPrivateChat.chat.userOneReadUntil,
            userTwo: data.data.createPrivateChat.chat.userTwoReadUntil,
          });
          props.close();
        } else {
          console.log(data.errors);
        }
      });
  };

  const searchUserBody = {
    query: `
      query {
        findUserByName(nickname: "${inputText}") {
          _id
          nickname
          avatarIcon
          avatarIconColor
          avatarBackground
        }
      }
    `,
  };

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
          setSearchResults(data.data.findUserByName);
        } else {
          console.log(data.errors);
        }
      });
  };

  useEffect(() => {
    let runFetch: any;
    let isTypingHandler: any;
    if (isTyping) {
      isTypingHandler = setTimeout(() => {
        setIsTyping(false);
      }, 500);
    }
    if (!isTyping && inputText) {
      runFetch = setTimeout(() => {
        lookForUser();
      }, 500);
    }

    return () => {
      clearTimeout(runFetch);
      clearTimeout(isTypingHandler);
    };
  }, [inputText, isTyping]);

  return (
    <StyledModal ref={backdropRef} onClick={handleClickOutside}>
      <StyledChatUserSearch>
        <h3>New private chat</h3>
        <h5>Look for a user to start a private conversation</h5>
        <div className="lookForUserContainer">
          <input
            className="lookForUserInput"
            type="text"
            placeholder="Type the nickname of user you are looking for..."
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setIsTyping(true);
              setSearchResults([]);
            }}
          />
          {!isTyping && inputText && (
            <div className="inputResults">
              {searchResults ? (
                searchResults.map((result: any) => {
                  return (
                    <StyledResult
                      onClick={() => {
                        setChosenUser({
                          chosen: true,
                          nickname: result.nickname,
                          _id: result._id,
                          avatarIcon: result.avatarIcon,
                          avatarIconColor: result.avatarIconColor,
                          avatarBackground: result.avatarBackground,
                        });
                        setInputText("");
                      }}
                      className="result"
                      key={result._id}
                      avatarBackground={result.avatarBackground}
                      avatarIconColor={result.avatarIconColor}
                    >
                      <div className="resultBackground" />
                      <img src={avatarIcons[result.avatarIcon]} alt="" />
                      <span className="resultNickname">{result.nickname}</span>
                    </StyledResult>
                  );
                })
              ) : (
                <>
                  <span className="noResults">No users found</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className="chosenUser">
          {chosenUser.chosen && (
            <span>
              {chosenUser._id === context.userId
                ? "You cannot start conversation with yourself"
                : `You will start chat with: ${chosenUser.nickname}`}
            </span>
          )}
        </div>
        <div className="buttons">
          <button className="discard" onClick={() => props.close()}>
            Cancel
          </button>
          <button
            className="submit"
            onClick={() => joinChatRoom()}
            disabled={
              chosenUser.chosen === false
                ? true
                : chosenUser._id !== context.userId
                ? false
                : true
            }
          >
            Submit
          </button>
        </div>
      </StyledChatUserSearch>
    </StyledModal>
  );
};

interface IProps {
  close(): void;
  triggerRefresh(state: TriggerRefreshProps): void;
  dataFromProfile?: any;
}

interface TriggerRefreshProps {
  status: string;
  chat: {
    _id: string;
    users: {
      _id: string;
      nickname: string;
      avatarIcon: string;
      avatarIconColor: string;
      avatarBackground: string;
    };
    messages: [];
  };
}

interface ChosenUserProps {
  chosen: boolean;
  nickname: string;
  _id: string;
  avatarIcon: string;
  avatarIconColor: string;
  avatarBackground: string;
}
interface ResultProp {
  avatarIconColor: string;
  avatarBackground: string;
}

const StyledResult = styled.button<ResultProp>`
  padding: 5px 5px 5px 10px;
  display: grid;
  grid-template-columns: max-content 1fr;
  background-color: white;
  border: none;
  gap: 10px;

  &:hover {
    background-color: #f3f3f3;
  }
  .resultBackground {
    border-radius: 50%;
    background-color: ${(props) => props.avatarBackground};
    width: 30px;
    height: 30px;
    grid-column: 1/1;
    grid-row: 1/1;
  }
  img {
    grid-column: 1/1;
    grid-row: 1/1;
    width: 24px;
    height: 24px;
    justify-self: center;
    align-self: center;
    filter: invert(${(props) => (props.avatarIconColor === "#000000" ? 0 : 1)});
  }
  .resultNickname {
    font-size: 1.4rem;
    grid-column: 2/2;
    justify-self: start;
    align-self: center;
    font-family: "LightFont";
  }
`;

const StyledChatUserSearch = styled.div`
  justify-self: center;
  align-self: center;
  background-color: aliceblue;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px 40px;
  margin-top: -15%;

  h3 {
    font-size: 2.2rem;
    text-align: center;
  }
  h5 {
    font-size: 1.2rem;
    text-align: center;
    color: gray;
    margin-top: 5px;
    margin-bottom: 30px;
    letter-spacing: 0.5px;
  }

  .chosenUser {
    font-size: 2.4rem;
    text-align: center;
  }

  .lookForUserContainer {
    position: relative;
    .lookForUserInput {
      font-size: 1.5rem;
      padding: 4px 0 4px 4px;
      width: 400px;
      border: 0.5px solid lightgray;
      font-family: "LightFont";
    }

    .inputResults {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      height: max-content;
      max-height: 220px;
      overflow-y: scroll;
    }
    .noResults {
      top: 100%;
      left: 0;
      width: 100%;
      background-color: white;
      border: 1px solid lightgray;
      border-top: none;
      font-size: 1.4rem;
      color: black;
      text-align: center;
      padding: 15px 0 15px 0;
    }
  }

  .lookForUserInput::placeholder {
    color: #bebebe;
  }

  .buttons {
    margin-top: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    .discard,
    .submit {
      border: none;
      color: white;
      background-color: #6564db;
      border-radius: 7.5px;
      padding: 8px 25px;
      font-size: 1.4rem;
      justify-self: start;
      font-family: "LightFont";
    }

    .discard {
      background-color: transparent;
      justify-self: end;
      border: 1px solid black;
      color: black;
    }

    .submit:disabled {
      background-color: gray;
      cursor: not-allowed;
    }
  }
`;

export default NewChatSearchModal;
