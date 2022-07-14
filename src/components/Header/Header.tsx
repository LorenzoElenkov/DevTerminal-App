import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styled, { keyframes } from "styled-components";

import { globalContext, socket } from "../../context/auth-context";

import searchIcon from "../images/searchIcon.png";
import notificationsIcon from "../images/notifications.png";
import profileIcon from "../images/profile.png";

const Header: React.FC<IProps> = ({
  loginSignup,
  logout,
  notificationsOpen,
  setNotifications,
}: // profileClick
IProps) => {
  const context = useContext(globalContext);
  const [notificationsArray, setNotificationsArray] = useState<Object[] | null>(
    null
  );

  const notificationWindowRef = useRef(null);

  const handleClickIn = (e: any) => {
    if (
      e.target === e.currentTarget ||
      e.target === notificationWindowRef.current
    ) {
      setNotifications(!notificationsOpen);
    }
  };

  const navigate = useNavigate();

  const formatCreatedAt = (time: string) => {
    const timeNumber = new Date(Number(time)).getTime();
    const timePosted = new Date(timeNumber).toString().split(" ");
    const dateNow = new Date().getTime();
    let timeDiff = Math.abs(dateNow - timeNumber) / 1000;
    const diffHours = Math.floor(timeDiff / 3600) % 24;
    const diffMinutes = Math.floor(timeDiff / 60) % 60;
    return diffHours === 0 && diffMinutes === 0 && timeDiff / 86400 <= 0
      ? "now"
      : diffHours === 0 && diffMinutes === 1 && timeDiff / 86400 <= 0
      ? `${diffMinutes} min ago`
      : diffHours === 0 && diffMinutes > 1 && timeDiff / 86400 <= 0
      ? `${diffMinutes} mins ago`
      : diffHours > 0 && diffHours < 24 && timeDiff / 86400 <= 0
      ? `${diffHours} hrs ago`
      : timeDiff / 86400 > 0 &&
        `${timePosted[2]} ${timePosted[1]} ${timePosted[3]}`;
  };

  const requestBody = {
    query: `
    mutation updateNotifications($notificationsArray: [NotificationInput!]) {
        updateNotifications(userId: "${context.userId}", notifications: $notificationsArray) {
          message
          state
          read
          project
          createdAt
        }
      }
    `,
    variables: {
      notificationsArray,
    },
  };

  const fetchNotifications = () => {
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (!result.errors) {
          context.updateNotifications(result.data.updateNotifications);
        } else {
          console.log(result.errors[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (notificationsArray) {
      fetchNotifications();
    }
  }, [notificationsArray]);

  const updateNotificationsRead = (id: number) => {
    const notifs: any[] = context.notifications;
    if (!notifs[id].read) {
      notifs[id].read = true;
      setNotificationsArray(notifs);
    }
  };

  const updateNotificationDelete = (id: number) => {
    const notifs: any[] = context.notifications;
    const notificationsAfterDelete: any[] = notifs.filter(
      (x: any, index: number) => {
        return index !== id;
      }
    );
    setNotificationsArray(notificationsAfterDelete);
  };

  const filterUnread: number | undefined = context.notifications?.filter(
    (el: any) => !el.read
  ).length;

  const handleModal = (menu: string) => {
    loginSignup(menu);
  };

  const signOut = () => {
    logout();
    socket.disconnect();
    navigate("/");
  };

  return (
    <globalContext.Consumer>
      {(context) => {
        return (
          <StyledNav className="nav" img={profileIcon}>
            <StyledLogo column="2">DevTerminal</StyledLogo>
            <StyledButton column="3">Home</StyledButton>
            <StyledButton column="4">Features</StyledButton>
            <StyledButton column="5">Pricing</StyledButton>
            <StyledButton column="6">F.A.Q.</StyledButton>
            {context.token === "" ? (
              <>
                <StyledButton column="9" onClick={() => handleModal("login")}>
                  Login
                </StyledButton>
                <StyledButton column="10" onClick={() => handleModal("signup")}>
                  Sign up
                </StyledButton>
              </>
            ) : (
              <>
                <StyledButton
                  className="notifications"
                  column="8"
                  img={notificationsIcon}
                  onClick={(e) => handleClickIn(e)}
                >
                  {filterUnread !== 0 && <span>{filterUnread}</span>}
                  {notificationsOpen && (
                    <div className="borderIcon" ref={notificationWindowRef}>
                      {filterUnread !== 0 && <span>{filterUnread}</span>}
                    </div>
                  )}
                  {notificationsOpen && (
                    <StyledNotificationWindow onClick={(e) => handleClickIn(e)}>
                      {context.notifications.length > 0 && (
                        <p className="markRead">
                          Click on notification to mark as read
                        </p>
                      )}
                      {context.notifications.length === 0 && (
                        <p className="noNotifications">
                          Yuck!
                          <br /> No notifications here
                        </p>
                      )}
                      {context.notifications.map((el: any, idx: number) => {
                        return (
                          <StyledNotificationSingle
                            key={idx}
                            read={el.read}
                            onClick={() => updateNotificationsRead(idx)}
                          >
                            <p className="message">{el.message}</p>
                            <p className="time">
                              {formatCreatedAt(el.createdAt)}
                            </p>
                            {el.read && (
                              <button
                                className="delete"
                                onClick={() => updateNotificationDelete(idx)}
                              >
                                X
                              </button>
                            )}
                          </StyledNotificationSingle>
                        );
                      })}
                    </StyledNotificationWindow>
                  )}
                </StyledButton>
                <Link
                  to={'/myprofile/' + context.userId}
                  className="profile"
                  onClick={() => {
                    context.setBrowsingUser({
                      _id: context.userId,
                      stacks: context.stacks,
                      bio: context.bio,
                      role: context.role,
                      nickname: context.nickname,
                      avatarIcon: context.avatarIcon,
                      avatarIconColor: context.avatarIconColor,
                      avatarBackground: context.avatarBackground,
                      github: context.github,
                    });
                  }}
                />
                <StyledButton column="10" onClick={signOut}>
                  Sign out
                </StyledButton>
              </>
            )}
          </StyledNav>
        );
      }}
    </globalContext.Consumer>
  );
};

export default Header;

interface IProps {
  loginSignup(menu: string): void;
  logout(): void;
  notificationsOpen: boolean;
  setNotifications(state: boolean): void;
  // profileClick?(): void;
}

interface IButtonProps {
  className?: string;
  column: string;
  img?: string | undefined;
}

interface ISearchProps {
  className?: string;
  column: string;
}

interface ILogo {
  className?: string;
  column: string;
}

interface INavProps {
  img?: string | undefined;
}

interface INotification {
  read: boolean;
}

const StyledNotificationSingle = styled.div<INotification>`
  padding: 10px 15px;
  background-color: ${(props) => (props.read ? "white" : "aliceblue")};
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  .message {
    font-size: 1.3rem;
    text-align: start;
  }
  .time {
    text-align: start;
    color: gray;
    font-size: 1.1rem;
  }

  &:not(:last-child) {
    border-bottom: 1px solid gray;
  }

  .delete {
    position: absolute;
    top: calc(100% - 30px);
    left: calc(100% - 27.5px);
    width: max-content;
    padding: 5px 7.5px;
    border-radius: 50%;
    font-size: 1rem;
    color: white;
    background-color: tomato;
    border: none;
  }
`;
const StyledNotificationWindow = styled.div`
  position: absolute;
  top: calc(100% + 19px);
  left: calc(-300px + 100%);
  width: 300px;
  height: max-content;
  max-height: 300px;
  background-color: aliceblue;
  border: 1px solid black;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  overflow-y: auto;
  .markRead {
    padding: 5px;
  }
  .noNotifications {
    padding: 20px;
    font-size: 1.4rem;
  }
`;

const StyledNav = styled.nav<INavProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  display: grid;
  grid-template-columns:
    50px max-content repeat(4, max-content) 1fr repeat(3, max-content)
    50px;
  grid-template-rows: max-content;
  align-items: center;
  column-gap: 10px;
  padding: 10px 0;
  background: white;
  z-index: 1;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);

  a {
    text-decoration: none;
    color: black;
    font-size: 1.4rem;
    font-family: "LightFont";
    grid-column: 9/9;
    padding: 5px 20px;
  }

  a.profile {
    background-image: url(${(props) => props.img});
    background-size: 65%;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 100%;
    height: 100%;
    border-right: none;
  }
`;

const StyledSearchBar = styled.div<ISearchProps>`
  grid-column: ${(props) => props.column};
  height: 100%;
  width: 100%;
  font-family: "LightFont";
  align-self: end;

  label {
    font-size: 1.4rem;
    color: black;
    position: relative;
  }

  input {
    font-size: 1.2rem;
    padding: 5px 5px 5px 25px;
    width: 0px;
    visibility: hidden;
    outline: 1px solid lightgray;
    transition: width 0.4s ease-in-out;
    border: none;
  }

  input:hover,
  input:focus {
    visibility: visible;
    width: 200px;
  }

  label::before {
    position: absolute;
    content: "";
    background: url(${searchIcon});
    background-repeat: no-repeat;
    background-size: 75%;
    width: 25px;
    height: calc(1.6rem + 10px);
    top: -1px;
    left: 4px;
  }
`;

const buttonAnimTop = keyframes`

    0% {
        top: -100%;
        width: 5px;
        left: calc(100% - 20px);
    }
    30% {
        top: -5%;
        width: 5px;
        left: calc(100% - 20px);

    }
    60% {
        top: -5%;
        width: 5px;
        left: calc(100% - 20px);
    }
    100% {
        top: -5%;
        width: calc(100% - 30px);
        left: 15px;
    }
`;

const buttonAnimBottom = keyframes`

    0% {
        opacity: 0;
        top: 200%;
        width: 5px;
        left: 15px;
    }
    15% {
        opacity: 0;
    }
    30% {
        top: 90%;
        width: 5px;
        left: 15px;
        opacity: 1;
    }
    60% {
        top: 90%;
        width: 5px;
        left: 15px;
    }
    100% {
        top: 90%;
        width: calc(100% - 30px);
        left: 15px;
    }
`;

const StyledButton = styled.button<IButtonProps>`
  height: max-content;
  grid-column: ${(props) => props.column};
  padding: ${(props) => (props.column > "6" ? "5px 20px" : "5px 15px")};
  background: ${(props) =>
    props.column !== "10"
      ? "transparent"
      : "linear-gradient(45deg, #29FFBF, #6564DB 20%)"};
  background-size: 200%;
  background-position: 300% 100%;
  color: ${(props) => (props.column === "10" ? "white" : "black")};
  border: none;
  border-left: ${(props) => props.column === "3" && "1px solid black"};
  border-right: ${(props) => props.column === "8" && "1px solid black"};
  letter-spacing: 0.5px;
  border-radius: ${(props) => (props.column === "10" ? "15px" : "none")};
  font-size: 1.4rem;
  font-family: ${(props) => (props.column === "10" ? "MainFont" : "LightFont")};
  transition: background-position 0.2s ease-in-out;
  position: relative;

  &:hover {
    cursor: pointer;
    background-position: 200% 100%;
  }

  &:not(:last-child):hover:before {
    top: -5%;
    animation: ${buttonAnimTop} 0.5s;
  }

  &:not(:last-child):hover:after {
    top: 90%;
    opacity: 1;
    animation: ${buttonAnimBottom} 0.5s;
  }

  &:not(:last-child):before {
    content: "";
    position: absolute;
    top: -100%;
    left: 15px;
    border-radius: 10px;
    width: calc(100% - 30px);
    height: 5px;
    background: linear-gradient(to right, #29ffbf, #6564db);
    z-index: -1;
  }

  &:not(:last-child):after {
    content: "";
    position: absolute;
    top: 200%;
    left: 15px;
    border-radius: 10px;
    width: calc(100% - 30px);
    height: 5px;
    opacity: 0;
    background: linear-gradient(to right, #29ffbf, #6564db);
    z-index: -1;
  }

  &.notifications,
  &.profile {
    background-image: url(${(props) => props.img});
    background-size: 55%;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 100%;
    height: 100%;
    border-right: none;
    transition: none;
  }

  &.notifications:hover:before,
  &.notifications:hover:after {
    animation: none;
    opacity: 0;
  }
  &.notifications:before,
  &.notifications:after {
    /* top: -300%; */
  }

  &.notifications {
    position: relative;
    span {
      position: absolute;
      top: 0;
      left: 50%;
      background-color: tomato;
      padding: 1px 3px;
      font-size: 1.2rem;
      border-radius: 50%;
      color: white;
    }
  }

  &:last-child {
    margin-left: 10px;
  }

  .borderIcon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 21px);
    border: 1px solid black;
    border-bottom: none;
    background-color: white;
    z-index: 1;
    background-image: url(${(props) => props.img});
    background-size: 60% 50%;
    background-repeat: no-repeat;
    background-position: 50% 35%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    span {
      position: absolute;
      top: 10%;
      left: 50%;
      background-color: tomato;
      padding: 1px 3px;
      font-size: 1.2rem;
      border-radius: 50%;
      color: white;
    }
  }
`;

const StyledLogo = styled.span<ILogo>`
  grid-column: ${(props) => props.column};
  font-family: "MainFont";
  font-size: 2rem;
  padding: 0 10px;
  cursor: pointer;

  background-color: white;
  background-image: linear-gradient(
    to right,
    #29ffbf 0%,
    #6564db 35%,
    #6564db 35%,
    #29ffbf 100%
  );
  background-size: 110%;
  background-repeat: repeat;

  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;

  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  transition: all 0.25s ease-in-out;
  &:hover {
    background-size: 250%;
  }
`;
