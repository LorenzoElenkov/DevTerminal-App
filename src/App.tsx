import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Login from "./components/Login/Signup/Login";
import Signup from "./components/Login/Signup/Signup";
import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import AuthContext from "./context/auth-context";
import SearchPage from "./components/Inside/SearchPage/SearchPage";
import MyProfile from "./components/MyProfile/MyProfile";
import Sidebar from "./components/MyProfile/Sidebar";
import { StyledFetchModal } from "./components/CreateProject/CreateProject";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchSuccess,setFetchSuccess] = useState<boolean>(false);
  const [fetchMessage,setFetchMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [authModal, setAuthModal] = useState("");
  const [submenu, setSubmenu] = useState("");
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
      notifications: notifications
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
      };
    });
  };

  const updateNotifications = (notifications: Object[]) => {
    setUserMetaData((prevState: any) => {
      return {
        ...prevState,
        notifications: notifications
      }
    })
  }
  return (
    <BrowserRouter>
      <AuthContext.Provider
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
          login: login,
          logout: logout,
          setNickname: setNickname,
          updateUser: updateUser,
          updateNotifications: updateNotifications,
        }}
      >
        <Header loginSignup={setAuthModal} logout={logout} />
        <main>
          {userMetaData.userId !== "" && <Sidebar subMenu={setSubmenu} />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage isLoading={setIsLoading} fetchMessage={setFetchMessage} fetchSuccess={setFetchSuccess} error={setError}/>} />
            <Route path="/profile" element={<MyProfile subMenu={submenu} isLoading={setIsLoading} fetchMessage={setFetchMessage} fetchSuccess={setFetchSuccess} error={setError}/>} />
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
          <StyledFetchModal className="failed">
            {error}
          </StyledFetchModal>
        )}
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
