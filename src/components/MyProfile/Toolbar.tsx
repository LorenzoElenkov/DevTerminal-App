import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import projectsIcon from "../images/projects.png";
import projectsPickedIcon from "../images/projectsPicked.png";
import applicationsIcon from "../images/applications.png";
import applicationsPickedIcon from "../images/applicationPicked.png";
import settingsIcon from "../images/settings.png";
import settingsPickedIcon from "../images/settingsPicked.png";
import searchIcon from "../images/searchIcon.png";
import searchPicked from "../images/searchPicked.png";
import { Link } from "react-router-dom";

import { globalContext, socket } from "../../context/auth-context";

const Toolbar: React.FC<IProps> = ({ submenu, changeMenu }) => {
  const [innerMenu, setInnerMenu] = useState("");
  const context = useContext(globalContext);
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
  }, [submenu]);

  return (
    <StyledContainer>
      <img src={submenu === "search" ? searchPicked : searchIcon} alt="" className={submenu === "search" ? "active" : ""}/>
      <Link
        to="/search"
        className={submenu === "search" ? "active" : ""}
        onClick={() => {
          changeMenu("search");
          setInnerMenu("");
        }}
      >
        Search
      </Link>

      <img
        src={submenu === "" || submenu.includes("project") ? projectsPickedIcon : projectsIcon}
        alt=""
        className={
          submenu === "" || submenu.includes("project") ? "active" : ""
        }
      />
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
          My projects
        </Link>
      </div>

      <img
        src={submenu.includes("applications") ? applicationsPickedIcon : applicationsIcon}
        alt=""
        className={submenu.includes("applications") ? "active" : ""}
      />
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

      <img
        src={submenu === "edit_profile" ? settingsPickedIcon : settingsIcon}
        alt=""
        className={submenu === "edit_profile" ? "active" : ""}
      />
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
  row-gap: 10px;
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
    padding: 5px 0;
    padding-left: 5px;
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
  div:nth-child(6) {
    margin-top: -10px;
    margin-bottom: 20px;
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
    background-color: #e1e1e1;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    color: #6564db;
  }
  & > img {
    width: 28px;
    justify-self: center;
    align-self: center;
    padding: 5px;
  }

  & > img.active {
    background-color: #e1e1e1;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

`;
