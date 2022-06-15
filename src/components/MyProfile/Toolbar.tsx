import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import projectsIcon from "../images/projects.png";
import applicationsIcon from "../images/applications.png";
import settingsIcon from "../images/settings.png";
import notificationsIcon from "../images/notifications.png";
import { Link } from "react-router-dom";

import authContext from "../../context/auth-context";

const Toolbar: React.FC<IProps> = ({ submenu, changeMenu }) => {
  const [innerMenu, setInnerMenu] = useState("");
  const context = useContext(authContext);
  const [notifications, setNotifications] = useState<any>(null);
  const requestBody = {
    query: `
            query {
                findUser(userId: "${context.userId}") {
                    notifications {
                        project
                        state
                        read
                        message
                        createdAt
                    }
                }
            }
        `,
  };

  const updateNotifications = () => {
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        context.updateNotifications(data.data.findUser.notifications);
        if (!data.errors) {
        } else {
          console.log(data.errors[0].message);
        }
      });
  };

  useEffect(() => {
    updateNotifications();
  },[submenu])


  return (
    <StyledContainer>
      <span>Menu</span>
      <img src={projectsIcon} alt="" />
      <button
        className={
          submenu === "" || submenu.includes("project") ? "active" : ""
        }
        onClick={() => setInnerMenu("projects")}
      >
        Projects
      </button>

      <div className={innerMenu === "projects" ? "open" : "closed"}>
        <Link
          to="/profile"
          onClick={() => {
            changeMenu("create_project");
            setInnerMenu("");
          }}
        >
          Add new
        </Link>
      </div>
      <div className={innerMenu === "projects" ? "open" : "closed"}>
        <Link
          to="/profile"
          onClick={() => {
            changeMenu("");
            setInnerMenu("");
          }}
        >
          View projects
        </Link>
      </div>
      <div className={innerMenu === "projects" ? "open" : "closed"}>
        <Link
          to="/search"
          className="linkSearch"
          onClick={() => {
            changeMenu("search_projects");
            setInnerMenu("");
          }}
        >
          Search
        </Link>
      </div>

      <img src={applicationsIcon} alt="" />
      <Link
        to="/profile"
        className={submenu.includes("applications") ? "active" : ""}
        onClick={() => {
          changeMenu("applications");
          setInnerMenu("");
        }}
      >
        Applications
      </Link>

      <img src={notificationsIcon} alt="" />
      <Link
        to="/profile"
        className={submenu === "notifications" ? "active" : ""}
        onClick={() => {
          changeMenu("notifications");
          setInnerMenu("");
        }}
      >
        {context.notifications?.filter((x: any) => !x.read).length > 0 && `(${context.notifications?.filter((x: any) => !x.read).length}) `}Notifications
      </Link>
      <img src={settingsIcon} alt="" />
      <Link
        to="/profile"
        className={submenu === "edit_profile" ? "active" : ""}
        onClick={() => {
          changeMenu("edit_profile");
          setInnerMenu("");
        }}
      >
        Settings
      </Link>
    </StyledContainer>
  );
};

export default Toolbar;

interface IProps {
  submenu: string;
  changeMenu(menu: string): void;
}

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr;
  column-gap: 5px;
  margin: 0 20px;
  position: relative;
  grid-column: 3/4;
  padding: 0 20px;
  span {
    font-size: 1.3rem;
    margin-bottom: 20px;
    padding: 0 5px;
    font-weight: 600;
    grid-column: 1/3;
  }
  button,
  .linkSearch,
  a {
    border: none;
    background-color: transparent;
    font-size: 1.3rem;
    font-family: "LightFont";
    text-align: start;
    grid-column: 2/3;
    border-bottom: 1px solid transparent;
    text-decoration: none;
    color: black;
  }
  & > button,
  a {
    padding: 10px 0;
  }
  .linkSearch {
    color: black;
    text-decoration: none;
    margin-left: 10px;
  }
  div {
    grid-column: 2/2;
    display: flex;
  }
  div:nth-child(6),
  div:nth-child(11) {
    margin-bottom: 10px;
  }
  div > button {
    margin-left: 10px;
  }

  div > a {
    margin-left: 10px;
  }

  div.closed {
    display: none;
  }

  div.open {
    display: block;
    padding: 10px 0;
  }

  button:hover,
  a:hover {
    font-weight: 600;
  }
  button.active,
  a.active {
    font-weight: 600;
    border-bottom: 1px solid lightgray;
    /* width: max-content; */
  }
  & > img {
    width: 18px;
    justify-self: center;
    align-self: center;
  }

  /* div {
        width: 100%;
        position: absolute;
        height: 20px;
        background-color: aliceblue;
        top: 100%;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    } */
`;
