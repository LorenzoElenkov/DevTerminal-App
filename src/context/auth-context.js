import React from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", { autoConnect: false});

export const globalContext = React.createContext({
    token: '',
    userId: '',
    nickname: '',
    email: '',
    bio: '',
    role: '',
    stacks: [],
    avatarIcon: 0,
    avatarIconColor: '',
    avatarBackground: '',
    notifications: [],
    rooms: [],
    socketId: '',
    login: (token, userId, nickname, email, bio, role, stacks, avatarIcon, avatarIconColor, avatarBackground, notifications, rooms, socketId, tokenExpiration) => {},
    logout: () => {},
    setNickname: (nickname) => {},
    updateUser: (bio, role, stacks, nickname, avatarIcon, avatarIconColor, avatarBackground, notifications, rooms, socketId) => {},
    updateNotifications: (notifications) => {},
})