import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";
import { globalContext, socket } from "../../context/auth-context";
import { StyledTopBar } from "../EditMyProfile/EditMyProfile";
import { StyledContainer } from "../ProjectsMyProfile/ProjectsMyProfile";

const Notifications = () => {
  const context = useContext(globalContext);
  const [notifics, setNotifications] = useState<Object[] | null>(null);

  const filterUnread = context.notifications.filter(
    (x: any) => x.read === false
  );

  const requestBody = {
    query: `
    mutation updateNotifications($notifics: [NotificationInput!]) {
        updateNotifications(userId: "${context.userId}", notifications: $notifics) {
          message
          state
          read
          project
          createdAt
        }
      }
    `,
    variables: {
      notifics,
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
    if (notifics) {
      fetchNotifications();
    }
  }, [notifics]);

  const updateNotificationsRead = (id: number) => {
    const notifs: any[] = context.notifications;
    if (!notifs[id].read) {
      notifs[id].read = true;
      setNotifications(notifs);
    }
  };

  const updateNotificationDelete = (id: number) => {
    const notifs: any[] = context.notifications;
    const notificationsAfterDelete: any[] = notifs.filter(
      (x: any, index: number) => {
        return index !== id;
      }
    );
    setNotifications(notificationsAfterDelete);
  };

  const formatCreatedAt = (time: string) => {
    const timeNumber = new Date(Number(time)).getTime();
    const timeSplit = new Date().toString().split(" ");
    let timeDate = `${timeSplit[2]} ${timeSplit[1]} ${timeSplit[3]}`;
    const dateNow = new Date().getTime();
    let timeDiff = Math.abs(dateNow - timeNumber) / 1000;
    const diffHours = Math.floor(timeDiff / 3600) % 24;
    const diffMinutes = Math.floor(timeDiff / 60) % 60;
    return diffHours === 0 && diffMinutes === 0
      ? "now"
      : diffHours === 0 && diffMinutes === 1
      ? `${diffMinutes} min ago`
      : diffHours === 0 && diffMinutes > 1
      ? `${diffMinutes} mins ago`
      : diffHours > 0 && diffHours < 24
      ? `${diffHours} hrs ago`
      : timeDate;
  };

  return (
    <StyledContainer>
      <StyledTopBar>Notifications ({filterUnread.length} unread)</StyledTopBar>
      <div className="projectsContainerNotification">
        {context.notifications.map((el: any, idx: number) => {
          return (
            <StyledNotification
              key={idx}
              read={el.read}
              onClick={() => updateNotificationsRead(idx)}
            >
              <span className="exclamation">!</span>
              <span className="title">{el.message}</span>
              <span className="timeAgo">{formatCreatedAt(el.createdAt)}</span>
              <button onClick={() => updateNotificationDelete(idx)}>X</button>
              {el.message.includes("APPROVED") && (
                <button className="confirmAttendance">OK</button>
              )}
            </StyledNotification>
          );
        })}
      </div>
    </StyledContainer>
  );
};

interface IPropsNotifaction {
  read: boolean;
}

const StyledNotification = styled.div<IPropsNotifaction>`
  background: aliceblue;
  box-shadow: -7px 0px 1px -2px ${(props) => (props.read ? "lightgray" : "#4a9fff")};
  border-radius: 15px;
  width: 100%;
  height: max-content;
  padding: 10px 20px;
  display: grid;
  grid-template-columns: max-content 1fr 1fr 1fr;
  grid-column: 1/3;
  column-gap: 10px;
  position: relative;
  .exclamation {
    grid-column: 1/1;
    grid-row: 1/3;
    font-size: 4rem;
  }

  .title {
    font-size: 1.4rem;
    grid-column: 2/5;
    align-self: center;
    grid-row: 1/1;
    font-family: "LightFont";
  }

  button {
    position: absolute;
    top: -5px;
    left: calc(100% - 15px);
    width: max-content;
    height: max-content;
    padding: 5px 8px;
    font-size: 1.4rem;
    background-color: tomato;
    border-radius: 50%;
    border: none;
    color: aliceblue;
  }

  .confirmAttendance {
    border-radius: 10px;
    top: calc(100% - 27.5px);
    left: calc(100% - 35px);
    background-color: #7cff7c;
    color: #397839;
  }
  .timeAgo {
    color: gray;
    grid-column: 2/2;
    grid-row: 2/2;
    font-size: 1.2rem;
  }
`;

export default Notifications;
