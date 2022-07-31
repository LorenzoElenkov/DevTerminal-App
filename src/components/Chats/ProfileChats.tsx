import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { globalContext, socket } from "../../context/auth-context";
import { privateChatsContext } from "../../context/private-chats-context";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import NewChatSearchModal from "./NewChatSearchModal";
import PrivateChat from "./PrivateChat";

const ProfileChats: React.FC<IProps> = (props) => {
  const context = useContext(globalContext);
  const chatContext = useContext(privateChatsContext);
  const [searchedUser, setSearchedUser] = useState<string>("");
  const [searchedUserArray, setSearchedUserArray] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<SelectedChatProps>({
    _id: "",
    messages: [],
    otherUser: {
      _id: "",
      nickname: "",
      avatarIcon: "",
      avatarIconColor: "",
      avatarBackground: "",
      github: "",
      role: "",
      bio: "",
      skills: [],
    },
    myReadIndex: -5,
  });
  const [triggerRefresh, setTriggerRefresh] = useState<any>({
    state: undefined,
    chat: {},
  });

  const [modalOn, setModalOn] = useState<boolean>(false);


  useEffect(() => {
    let sortedChatsByTimestamp = chatContext.allChats.filter((a: any) => a.messages.length > 0);
    let emptyChats = chatContext.allChats.filter((b: any) => b.messages.length === 0);
    sortedChatsByTimestamp.sort((a: any, b: any) => b.messages[0].timestamp - a.messages[0].timestamp);
    console.log([...sortedChatsByTimestamp, ...emptyChats]);
    chatContext.populateAllChats([...sortedChatsByTimestamp, ...emptyChats]);
  },[])

  useEffect(() => {
    if (props.browsingUser) {
      setModalOn(true);
    }
  },[]);

  const [privateMessage, setPrivateMessage] = useState<MessageInterface>({
    chatId: undefined,
    message: "",
    author: {
      _id: context.userId,
      nickname: context.nickname,
      avatarBackground: context.avatarBackground,
      avatarIcon: context.avatarIcon,
      avatarIconColor: context.avatarIconColor,
    },
    timestamp: undefined,
  });

  const onMessagePrivateChat = () => {
    const sendSocketMessage = () => {
      socket.emit("privateMessage", {
        myMessageIndex: selectedChat.messages.length + 1,
        chatId: selectedChat._id,
        message: privateMessage.message,
        author: privateMessage.author,
      });
    };
    dbSendMessage(
      privateMessage.message,
      selectedChat.messages.length + 1,
      sendSocketMessage()
    );
  };

  useEffect(() => {
    socket.on("sendPrivateMessageSelected", (data) => {
      // if (data.author._id === context.userId) {
      //   dbSendMessage(data.message);
      // }
      if (data.chatId === selectedChat._id) {
        setSelectedChat({
          ...selectedChat,
          messages: [
            {
              author: data.author,
              message: data.message,
              timestamp: data.timestamp,
            },
            ...selectedChat.messages,
          ],
          myReadIndex:
            data.author._id === context.userId
              ? selectedChat.messages.length + 1
              : selectedChat.myReadIndex,
        });
      }
    });
    return () => {
      socket.off("sendPrivateMessageSelected");
      props.selectedChatId(-10);
    };
  });

  useEffect(() => {
    if (triggerRefresh.state === "New") {
      chatContext.populateAllChats([
        triggerRefresh.chat,
        ...chatContext.allChats,
      ]);
    }

    if (triggerRefresh.state !== undefined) {
      let otherUser = {
        _id: "",
        nickname: "",
        avatarIcon: "",
        avatarIconColor: "",
        avatarBackground: "",
        github: "",
        role: "",
        bio: "",
        skills: [],
      };
      for (let i of triggerRefresh.chat.users) {
        if (i._id !== context.userId) {
          otherUser = i;
        }
      }

      const showMessages = () => {
        let i: any = 0;
        for (i of chatContext.allChats) {
          if (i._id === triggerRefresh.chat._id) {
            return i.messages;
          }
        }
        return [];
      };
      setSelectedChat({
        _id: triggerRefresh.chat._id,
        messages: showMessages(),
        otherUser: otherUser,
        myReadIndex: 0,
      });
      props.selectedChatId(triggerRefresh.chat._id);
    }
  }, [triggerRefresh]);

  const clickChat = (x: any, clearOnClick?: boolean) => {
    let otherUserIndex: any;
    for (let i in x.users) {
      if (x.users[i]._id !== context.userId) {
        otherUserIndex = Number(i);
      }
    }
    const myReadIdx =
      x.userOneReadUntil.id === context.userId
        ? x.userOneReadUntil.messageIndex
        : x.userTwoReadUntil.messageIndex;
    for (let i in chatContext.allChats) {
      if (chatContext.allChats[i]._id === x._id) {
        let modifiedChats = chatContext.allChats;
        let replaceChat: any;
        if (chatContext.allChats[i].userOneReadUntil.id === context.userId) {
          replaceChat = {
            ...chatContext.allChats[i],
            userOneReadUntil: {
              ...chatContext.allChats[i].userOneReadUntil,
              messageIndex: x.messages.length,
            },
          };
        } else {
          replaceChat = {
            ...chatContext.allChats[i],
            userTwoReadUntil: {
              ...chatContext.allChats[i].userTwoReadUntil,
              messageIndex: x.messages.length,
            },
          };
        }
        modifiedChats.splice(Number(i), 1, replaceChat);

        const sendReadBody = {
          query: `
            mutation {
              changeMessageReadStatus(chatId: "${x._id}", otherUserId: "${x.users[otherUserIndex]._id}", messagesLength: "${x.messages.length}") {
                message
              }
            }
          `,
        };

        fetch("http://localhost:8000/graphql", {
          method: "POST",
          body: JSON.stringify(sendReadBody),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              chatContext.populateAllChats(modifiedChats);
            } else {
              console.log(data.errors);
            }
          });
      }
    }

    setSelectedChat({
      _id: x._id,
      messages: x.messages,
      otherUser: {
        _id: x.users[otherUserIndex]._id,
        nickname: x.users[otherUserIndex].nickname,
        avatarIcon: x.users[otherUserIndex].avatarIcon,
        avatarIconColor: x.users[otherUserIndex].avatarIconColor,
        avatarBackground: x.users[otherUserIndex].avatarBackground,
        github: x.users[otherUserIndex].github,
        role: x.users[otherUserIndex].role,
        bio: x.users[otherUserIndex].bio,
        skills: x.users[otherUserIndex].skills,
      },
      myReadIndex: myReadIdx,
    });
    props.selectedChatId(x._id);
    if (clearOnClick) {
      setSearchedUser("");
      setSearchedUserArray([]);
    }
  };

  const checkRead = (users: any[]) => {
    let myMessageIndex;
    let otherMessageIndex;
    for (let i of users) {
      if (i.id === context.userId) {
        myMessageIndex = i.messageIndex;
      } else {
        otherMessageIndex = i.messageIndex;
      }

      if (i.id === context.userId) {
        myMessageIndex = i.messageIndex;
      } else {
        otherMessageIndex = i.messageIndex;
      }
    }
    return myMessageIndex < otherMessageIndex ? false : true;
  };

  const searchUserHandler = (e: any) => {
    setSearchedUser(e);
    setSearchedUserArray([]);
    let filteredArray: any[] = [];
    if (e) {
      const regex = new RegExp(e, "i");
      for (let i of chatContext.allChats) {
        let otherUserIndex = i.users[0]._id !== context.userId ? 0 : 1;
        if (regex.test(i.users[otherUserIndex].nickname)) {
          filteredArray.push(i);
        }
      }
    }
    setSearchedUserArray(filteredArray);
  };

  const dbSendMessage = (
    message: string | undefined,
    maxLength: number,
    callback: any
  ) => {
    const sendMessageBody = {
      query: `
        mutation {
          sendPrivateMessage(chatId: "${selectedChat._id}", author: "${context.userId}", message: "${message}", maxLength: ${maxLength}) {
            message
          }
        }
      `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(sendMessageBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          callback();
          console.log("message saved to db!");
        } else {
          console.log(data.errors);
        }
      });
  };
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
          <StyledChatsSearch
            placeholder="Search for a user..."
            onChange={(e) => searchUserHandler(e.target.value)}
            value={searchedUser}
          />
          <StyledChatsWindow>
            {chatContext.allChats.length > 0 &&
              !searchedUser &&
              chatContext.allChats.map((x: any) => {
                let otherUserIndex: any;
                for (let i in x.users) {
                  if (x.users[i]._id !== context.userId) {
                    otherUserIndex = Number(i);
                  }
                }
                if (x.messages.length > 0) {
                  return (
                    <StyledSingleChat
                      key={x._id}
                      onClick={() => clickChat(x, false)}
                      isSelected={selectedChat._id === x._id}
                      avatarBackground={
                        x.users[otherUserIndex].avatarBackground
                      }
                      avatarIconColor={x.users[otherUserIndex].avatarIconColor}
                      isRead={checkRead([
                        x.userOneReadUntil,
                        x.userTwoReadUntil,
                      ])}
                    >
                      <div className="otherBackground" />
                      <img
                        className="otherIcon"
                        src={avatarIcons[x.users[otherUserIndex].avatarIcon]}
                        alt="Chat user"
                      />
                      <span className="otherNickname">
                        {x.users[otherUserIndex].nickname}
                      </span>
                      <span className="chatLastMessage">
                        {x.messages.length > 0
                          ? x.messages[0].message
                          : "No messages yet..."}
                      </span>
                      {!checkRead([x.userOneReadUntil, x.userTwoReadUntil]) && (
                        <div className="unreadDot" />
                      )}
                    </StyledSingleChat>
                  );
                }
              })}
            {searchedUser &&
              searchedUserArray.length > 0 &&
              searchedUserArray.map((x: any, idx: number) => {
                let otherUserIndex: any;
                for (let i in x.users) {
                  if (x.users[i]._id !== context.userId) {
                    otherUserIndex = Number(i);
                  }
                }
                return (
                  <StyledSingleChat
                    key={x._id}
                    onClick={() => clickChat(x, true)}
                    isSelected={selectedChat._id === x._id}
                    avatarBackground={x.users[otherUserIndex].avatarBackground}
                    avatarIconColor={x.users[otherUserIndex].avatarIconColor}
                    isRead={checkRead([x.userOneReadUntil, x.userTwoReadUntil])}
                  >
                    <div className="otherBackground" />
                    <img
                      className="otherIcon"
                      src={avatarIcons[x.users[otherUserIndex].avatarIcon]}
                      alt="Chat user"
                    />
                    <span className="otherNickname">
                      {x.users[otherUserIndex].nickname}
                    </span>
                    <span className="chatLastMessage">
                      {x.messages.length > 0
                        ? x.messages[0].message
                        : "No messages yet..."}
                    </span>
                    {!checkRead([x.userOneReadUntil, x.userTwoReadUntil]) && (
                      <div className="unreadDot" />
                    )}
                  </StyledSingleChat>
                );
              })}
            {searchedUser && searchedUserArray.length === 0 && (
              <span className="noSearchResults">No users matching...</span>
            )}
          </StyledChatsWindow>
        </div>
        <div className="profileChats--right-side">
          {selectedChat._id !== "" && (
            <Link
              to={"/myprofile/" + selectedChat._id}
              className="profile"
              onClick={() => {
                context.setBrowsingUser({
                  _id: selectedChat.otherUser._id,
                  stacks: selectedChat.otherUser.skills,
                  bio: selectedChat.otherUser.bio,
                  role: selectedChat.otherUser.role,
                  nickname: selectedChat.otherUser.nickname,
                  avatarIcon: selectedChat.otherUser.avatarIcon,
                  avatarIconColor: selectedChat.otherUser.avatarIconColor,
                  avatarBackground: selectedChat.otherUser.avatarBackground,
                  github: selectedChat.otherUser.github,
                });
              }}
            >
              <StyledSelectedChatTab
                avatarBackground={selectedChat.otherUser.avatarBackground}
                avatarIconColor={selectedChat.otherUser.avatarIconColor}
              >
                <div className="selectedBackground" />
                <img
                  src={avatarIcons[Number(selectedChat.otherUser.avatarIcon)]}
                  alt="Selected chat user avatar"
                />
                <span className="selectedName">
                  {selectedChat.otherUser.nickname}
                </span>
              </StyledSelectedChatTab>
            </Link>
          )}
          <PrivateChat
            messages={selectedChat.messages}
            currentChatId={selectedChat._id}
            otherUser={selectedChat.otherUser}
            lastReadMessageIndex={selectedChat.myReadIndex}
          />
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
            disabled={selectedChat._id ? false : true}
          />
        </div>
      </StyledProfileChatsContainer>
      {modalOn && (
        <NewChatSearchModal
          close={() => setModalOn(false)}
          triggerRefresh={(state) => {
            setTriggerRefresh({
              state: state.status,
              chat: state.chat,
            });
          }}
          dataFromProfile={context.browsingUser !== null ? context.browsingUser : null}
        />
      )}
    </StyledContainer>
  );
};

interface IProps {
  selectedChatId(id: number): void;
  browsingUser: {
    _id: string;
    stacks: any[];
    bio: string;
    role: string;
    nickname: string;
    avatarIcon: string;
    avatarIconColor: string;
    avatarBackground: string;
    github: string;
  };
}

interface MessageInterface {
  chatId: string | undefined;
  message: string | undefined;
  author: {
    _id: string;
    nickname: string;
    avatarIcon: number;
    avatarIconColor: string;
    avatarBackground: string;
  };
  timestamp: string | undefined;
}

interface ChatProps {
  avatarIconColor: string;
  avatarBackground: string;
  isSelected?: boolean;
  isRead?: any;
}

interface SelectedChatProps {
  _id: string;
  messages: any[];
  otherUser: {
    _id: string;
    nickname: string;
    avatarIcon: string;
    avatarIconColor: string;
    avatarBackground: string;
    github: string;
    role: string;
    bio: string;
    skills: any[];
  };
  myReadIndex: number;
}

const StyledSelectedChatTab = styled.div<ChatProps>`
  width: 100%;
  border-radius: 15px;
  display: grid;
  grid-template-columns: max-content 1fr;
  padding: 0 10px 0 0px;
  column-gap: 5px;
  width: max-content;
  &:hover {
    background-color: #e2eff9;
  }
  .selectedBackground {
    background-color: ${(props) => props.avatarBackground};
    width: 36px;
    height: 36px;
    border-radius: 50%;
    grid-column: 1/1;
    grid-row: 1/1;
  }
  img {
    width: 28px;
    height: 28px;
    grid-column: 1/1;
    grid-row: 1/1;
    justify-self: center;
    align-self: center;
    filter: invert(${(props) => (props.avatarIconColor === "#000000" ? 0 : 1)});
  }
  .selectedName {
    font-size: 1.4rem;
    grid-row: 1/3;
    align-self: center;
  }
`;

const StyledSingleChat = styled.button<ChatProps>`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  padding: 10px;
  column-gap: 5px;
  border: none;
  background-color: ${(props) => (props.isSelected ? "#ebebeb" : "white")};
  font-family: "LightFont";
  border-radius: 15px;
  border-left: 1px solid transparent;
  &:hover {
    background-color: ${(props) => (props.isSelected ? "#ebebeb" : "#f4f4f4")};
  }
  .otherBackground {
    grid-column: 1/1;
    grid-row: 1/3;
    width: 44px;
    height: 44px;
    justify-self: center;
    align-self: center;
    background-color: ${(props) => props.avatarBackground};
    border-radius: 50%;
  }
  .otherIcon {
    grid-column: 1/1;
    grid-row: 1/3;
    width: 34px;
    height: 34px;
    justify-self: center;
    align-self: center;
    filter: invert(${(props) => (props.avatarIconColor === "#000000" ? 0 : 1)});
  }

  .otherNickname {
    grid-column: 2/2;
    grid-row: 1/1;
    font-size: 1.4rem;
    justify-self: start;
    color: black;
    font-family: "RegularFont";
    text-align: start;
  }

  .chatLastMessage {
    grid-column: 2/2;
    grid-row: 2/3;
    font-size: 1.3rem;
    justify-self: start;
    color: ${(props) => (props.isRead ? "gray" : "black")};
    align-self: start;
    font-family: ${(props) => (props.isRead ? "LightFont" : "RegularFont")};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: start;
    width: 100%;
  }
  .unreadDot {
    grid-column: 3/3;
    grid-row: 1/3;
    width: 8px;
    height: 8px;
    background-color: #246eb9;
    border-radius: 50%;
    align-self: center;
  }
`;

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
  max-height: 530px;
  display: grid;
  grid-template-columns: 0.7fr 0.3fr;
  grid-template-rows: 100%;
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
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content 1fr max-content;

    .profile {
      padding: 10px;
      text-decoration: none;
      color: black;
      width: max-content;
      font-family: "RegularFont";
    }
  }
`;

const StyledChatsWindow = styled.div`
  background-color: white;
  border-bottom-right-radius: 10px;
  display: flex;
  flex-direction: column;
  height: calc(100% - (1.4rem + 12px));
  padding: 5px;
  row-gap: 3px;
  .noSearchResults {
    font-size: 1.4rem;
    padding: 10px;
    text-align: center;
  }
`;

const StyledChatsSearch = styled.input`
  border: none;
  border-bottom: 1px solid lightgray;
  font-size: 1.4rem;
  padding: 8px 0px 8px 8px;
  border-top-right-radius: 10px;
  font-family: "Lightfont";
`;

const StyledChatInput = styled.input`
  grid-row: 3/3;
  grid-column: 1/3;
  width: 100%;
  border: none;
  border-top: 1px solid lightgray;
  font-size: 1.4rem;
  padding: 8px 0px 8px 8px;
  border-bottom-left-radius: 10px;
  width: 100%;
  height: max-content;
  font-family: "Lightfont";
  &:disabled {
    background-color: white;
    cursor: not-allowed;
  }
`;

export default ProfileChats;
