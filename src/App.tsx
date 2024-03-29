import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header/Header";
import Login from "./components/Login/Signup/Login";
import Signup from "./components/Login/Signup/Signup";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import { globalContext, socket } from "./context/auth-context";
import { privateChatsContext } from "./context/private-chats-context";
import SearchPage from "./components/Inside/SearchPage/SearchPage";
import MyProfile from "./components/MyProfile/MyProfile";
import Sidebar from "./components/MyProfile/Sidebar";
import { StyledFetchModal } from "./components/CreateProject/CreateProject";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import ProfileChats from "./components/Chats/ProfileChats";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
  const [fetchMessage, setFetchMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  const [authModal, setAuthModal] = useState("");
  const [submenu, setSubmenu] = useState("");

  const [selectedChatId, setSelectedChatId] = useState<number | undefined>(undefined);

  const handleNotifications = (state: boolean) => {
    setNotificationsOpen(state);
  };

  const [userMetaData, setUserMetaData] = useState<any>({
    token: "",
    userId: "",
    nickname: "",
    email: "",
    bio: "",
    role: "",
    stacks: [],
    avatarIcon: 0,
    avatarIconColor: "",
    avatarBackground: "",
    notifications: [],
    rooms: [],
    github: "",
    socketId: "",
    browsingUser: null,
  });

  const [userPrivateChats, setUserPrivateChats] = useState<any>({
    allChats: [],
  });

  const login = (
    token: string,
    userId: string,
    nickname: string,
    email: string,
    bio: string,
    role: string,
    stacks: string[],
    avatarIcon: number,
    avatarIconColor: string,
    avatarBackground: string,
    notifications: Object[],
    rooms: string[],
    github: string,
    socketId: string
  ) => {
    setUserMetaData({
      token: token,
      userId: userId,
      nickname: nickname,
      email: email,
      bio: bio,
      role: role,
      stacks: stacks,
      avatarIcon: avatarIcon,
      avatarIconColor: avatarIconColor,
      avatarBackground: avatarBackground,
      notifications: notifications,
      rooms: rooms,
      github: github,
      socketId: socketId,
    });
  };

  const logout = () => {
    setUserMetaData({
      token: "",
      userId: "",
      nickname: "",
      email: "",
      bio: "",
      role: "",
      avatarIcon: 0,
      avatarIconColor: "",
      avatarBackground: "",
      stacks: [],
      notifications: [],
      rooms: [],
      github: "",
      socketId: "",
    });
    setUserPrivateChats({
      allChats: [],
    });
    setSubmenu("");
  };

  const setNickname = (nickname: string) => {
    setUserMetaData((prevState: any) => {
      return {
        ...prevState,
        nickname: nickname,
      };
    });
  };

  const updateUser = (
    bio: string,
    role: string,
    stacks: string[],
    nickname: string,
    avatarIcon: number,
    avatarIconColor: string,
    avatarBackground: string,
    notifications: Object[],
    rooms: string[],
    github: string,
    socketId: string
  ) => {
    setUserMetaData((prevState: any) => {
      return {
        ...prevState,
        bio: bio,
        role: role,
        stacks: stacks,
        nickname: nickname,
        avatarIcon: avatarIcon,
        avatarIconColor: avatarIconColor,
        avatarBackground: avatarBackground,
        notifications: notifications,
        rooms: rooms,
        github: github,
        socketId: socketId,
      };
    });
  };

  const updateNotifications = (notifications: Object[]) => {
    setUserMetaData((prevState: any) => {
      return {
        ...prevState,
        notifications: notifications,
      };
    });
  };

  const setBrowsingUser = (userData: Object[]) => {
    setUserMetaData((prevState: any) => {
      return {
        ...prevState,
        browsingUser: userData,
      };
    });
  };

  const populateAllChats = (chats: any) => {
    setUserPrivateChats({
      allChats: chats,
    });
  };


  const updateChat = (message: any) => {

  };

  useEffect(() => {
    if (userMetaData.userId) {
      socket.on("onOtherPrivateRoomJoin", (data) => {
        socket.emit("otherPrivateRoomJoin", { chatId: data._id });
        populateAllChats([
          {
            _id: data._id,
            userOneReadUntil: data.userOne,
            userTwoReadUntil: data.userTwo,
            users: [
              data.otherUser,
              {
                _id: userMetaData.userId,
                nickname: userMetaData.nickname,
                avatarIcon: userMetaData.avatarIcon,
                avatarIconColor: userMetaData.avatarIconColor,
                avatarBackground: userMetaData.avatarBackground,
              },
            ],
            messages: data.messages,
          },
          ...userPrivateChats.allChats,
        ]);
      });
    }

    socket.on("sendPrivateMessage", (data) => {
      let chatToMoveToTop: any;
      let modifiedChat: any[] = [];
      modifiedChat = userPrivateChats.allChats.map((x: any, idx: number) => {
        if (x._id === data.chatId) {
          let changeMessageIndex: any;
          if (x.userOneReadUntil.id === data.author._id) {
            changeMessageIndex = data.myMessageIndex;
            chatToMoveToTop = {
              ...x,
              messages: [
                {
                  author: data.author,
                  message: data.message,
                  timestamp: data.timestamp,
                },
                ...x.messages,
              ],
              userOneReadUntil: {
                ...x.userOneReadUntil,
                messageIndex: changeMessageIndex,
              },
              userTwoReadUntil: {
                ...x.userTwoReadUntil,
                messageIndex: x._id === selectedChatId ? x.messages.length + 1 : x.userTwoReadUntil.messageIndex
              }
            };
          } else if (x.userTwoReadUntil.id === data.author._id) {
            changeMessageIndex = data.myMessageIndex;
            chatToMoveToTop = {
              ...x,
              messages: [
                {
                  author: data.author,
                  message: data.message,
                  timestamp: data.timestamp,
                },
                ...x.messages,
              ],
              userOneReadUntil: {
                ...x.userOneReadUntil,
                messageIndex: x._id === selectedChatId ? x.messages.length + 1 : x.userOneReadUntil.messageIndex
              },
              userTwoReadUntil: {
                ...x.userTwoReadUntil,
                messageIndex: changeMessageIndex,
              },
            };
          }
          return chatToMoveToTop;
        }
        return x;
      });

      modifiedChat = modifiedChat.filter(
        (x: any) => x._id !== chatToMoveToTop._id
      );
      modifiedChat.unshift(chatToMoveToTop);
      populateAllChats(modifiedChat);
    });
    return () => {
      socket.off("onOtherPrivateRoomJoin");
      socket.off("sendPrivateMessage");
    };
  }, [userPrivateChats]);

  return (
    <BrowserRouter>
      <globalContext.Provider
        value={{
          token: userMetaData.token,
          userId: userMetaData.userId,
          nickname: userMetaData.nickname,
          email: userMetaData.email,
          bio: userMetaData.bio,
          role: userMetaData.role,
          stacks: userMetaData.stacks,
          avatarIcon: userMetaData.avatarIcon,
          avatarIconColor: userMetaData.avatarIconColor,
          avatarBackground: userMetaData.avatarBackground,
          notifications: userMetaData.notifications,
          rooms: userMetaData.rooms,
          github: userMetaData.github,
          socketId: userMetaData.socketId,
          browsingUser: userMetaData.browsingUser,
          login: login,
          logout: logout,
          setNickname: setNickname,
          updateUser: updateUser,
          updateNotifications: updateNotifications,
          setBrowsingUser: setBrowsingUser,
        }}
      >
        <privateChatsContext.Provider
          value={{
            allChats: userPrivateChats.allChats,
            populateAllChats: populateAllChats,
            updateChats: updateChat,
          }}
        >
          <Header
            loginSignup={setAuthModal}
            logout={logout}
            setNotifications={(state) => handleNotifications(state)}
            notificationsOpen={notificationsOpen}
          />
          <main>
            {userMetaData.userId !== "" && (
              <Sidebar subMenu={setSubmenu} submenuHeader={submenu} />
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/search"
                element={
                  <SearchPage
                    isLoading={setIsLoading}
                    fetchMessage={setFetchMessage}
                    fetchSuccess={setFetchSuccess}
                    error={setError}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <MyProfile
                    subMenu={submenu}
                    isLoading={setIsLoading}
                    fetchMessage={setFetchMessage}
                    fetchSuccess={setFetchSuccess}
                    error={setError}
                  />
                }
              />
              <Route
                path="/myprofile/:id"
                element={
                  <ProfilePage
                    _id={userMetaData.browsingUser?._id}
                    stacks={userMetaData.browsingUser?.stacks}
                    bio={userMetaData.browsingUser?.bio}
                    role={userMetaData.browsingUser?.role}
                    nickname={userMetaData.browsingUser?.nickname}
                    avatarIcon={userMetaData.browsingUser?.avatarIcon}
                    avatarIconColor={userMetaData.browsingUser?.avatarIconColor}
                    avatarBackground={
                      userMetaData.browsingUser?.avatarBackground
                    }
                    github={userMetaData.browsingUser?.github}
                  />
                }
              />
              <Route path="/profile/chats" element={<ProfileChats selectedChatId={(id: number) => setSelectedChatId(id)} browsingUser={userMetaData.browsingUser}/>} />
            </Routes>
          </main>
          {authModal === "login" ? (
            <Login close={setAuthModal} />
          ) : authModal === "signup" ? (
            <Signup close={setAuthModal} />
          ) : null}
          {isLoading && !fetchSuccess && error === "" && (
            <StyledFetchModal className="loading_small_modal">
              Working on your request...
            </StyledFetchModal>
          )}
          {isLoading && fetchSuccess && (
            <StyledFetchModal className="success">
              {fetchMessage}
            </StyledFetchModal>
          )}
          {isLoading && error !== "" && !fetchSuccess && (
            <StyledFetchModal className="failed">{error}</StyledFetchModal>
          )}
        </privateChatsContext.Provider>
      </globalContext.Provider>
    </BrowserRouter>
  );
}

interface ChatContext {
  allChats: any[]
}

export default App;
