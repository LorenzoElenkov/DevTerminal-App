import React from "react";

export default React.createContext({
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
    login: (token, userId, nickname, email, bio, role, stacks, avatarIcon, avatarIconColor, avatarBackground, tokenExpiration) => {},
    logout: () => {},
    setNickname: (nickname) => {},
    updateUser: (bio, role, stacks, nickname, avatarIcon, avatarIconColor, avatarBackground) => {},
})