import React, { useContext } from "react";
import styled from "styled-components";
import { isContext } from "vm";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import githubLogo from "../images/github.png";
import { globalContext } from "../../context/auth-context";
import { Link, useNavigate } from "react-router-dom";

const MyProfilePage: React.FC<IProps> = (props) => {
  const context = useContext(globalContext);
  const navigate = useNavigate();
  return (
    <StyledContainer>
      <div className="topBar">
        <h3>Profile</h3>
        {props._id === context.userId && (
          <button
            className="profile--edit-button"
            onClick={() => navigate("/profile")}
          >
            Edit
          </button>
        )}
      </div>
      <StyledProfileBody
        avatarBackground={props.avatarBackground}
        avatarIconColor={props.avatarIconColor}
      >
        <div className="profile--avatar_and_nickname">
          <div className="profile--avatarBackground" />
          <img
            className="profile--avatarIcon"
            alt="This profile avatar icon"
            src={avatarIcons[props.avatarIcon]}
          />
          <span className="profile--user-nickname">{props.nickname}</span>
          <span className="profile--user-role">{props.role}</span>
          {props._id !== context.userId && (
            <Link
              to={"/profile/chats"}
              className="profile--user-direct-message-button"
            >
              Send message
            </Link>
          )}
        </div>
        {props.github && (
          <a
            href={"https://github.com/" + props.github}
            rel="noreferrer"
            className="profile--user-github"
            target="_blank"
          >
            <img src={githubLogo} alt="This profile github link" />
          </a>
        )}
        <div className="profile--user-bio">
          <span className="profile--user-bio-title">Biography</span>
          <span className="profile--user-bio-subtitle">A bit about me</span>
          <span className="profile--user-bio-text">{props.bio}</span>
        </div>
        <div className="divider" />
        <div className="profile--user-stacks">
          <span className="profile--user-stacks-title">Tech Stacks</span>
          <span className="profile--user-stacks-subtitle">
            What I'm good at
          </span>
          <div className="profile--user-stacks-container">
            {props.stacks?.map((x: any) => {
              return (
                <div className="profile--user-stacks-item">
                  <div />
                  {x}
                </div>
              );
            })}
          </div>
        </div>
      </StyledProfileBody>
    </StyledContainer>
  );
};

interface IProps {
  _id: string | null | undefined;
  nickname: string | null | undefined;
  role: string | null | undefined;
  bio: string | null | undefined;
  stacks: string[] | null | undefined;
  avatarIcon: number;
  avatarIconColor: string | null | undefined;
  avatarBackground: string | null | undefined;
  github: string | null | undefined;
}

interface StyledProps {
  avatarBackground: string | null | undefined;
  avatarIconColor: string | null | undefined;
}

const StyledContainer = styled.div`
  margin-top: 100px;
  padding: 0 20px;
  width: 100%;
  height: max-content;
  grid-column: 2/3;
  font-family: "LightFont";
  display: flex;
  flex-direction: column;
  gap: 20px;
  .topBar {
    font-size: 2rem;
    background-color: aliceblue;
    padding: 20px;
    border-radius: 15px;
    box-shadow: -7px 0px 1px -2px #6564db;
    display: flex;
    justify-content: space-between;
  }
  h3 {
    font-size: 1.8rem;
    align-self: center;
  }
  .profile--edit-button {
    padding: 7.5px 15px;
    background-color: #6564db;
    border: none;
    border-radius: 15px;
    color: white;
    font-family: "LightFont";
    font-size: 1.4rem;
    align-self: center;
  }
`;

const StyledProfileBody = styled.div<StyledProps>`
  background-color: aliceblue;
  border-radius: 15px;
  width: 100%;
  min-width: 600px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 20px;
  padding: 20px;

  .profile--avatar_and_nickname {
    grid-column: 1/4;
    display: grid;
    grid-template-columns: max-content 1fr 1fr;
    grid-template-rows: max-content max-content;
    column-gap: 10px;

    .profile--avatarBackground {
      background-color: ${(props) => props.avatarBackground};
      border-radius: 50%;
      width: 60px;
      height: 60px;
      grid-column: 1/1;
      grid-row: 1/3;
      justify-self: center;
      align-self: center;
    }

    .profile--avatarIcon {
      width: 40px;
      height: 40px;
      grid-column: 1/1;
      grid-row: 1/3;
      justify-self: center;
      align-self: center;
      filter: invert(
        ${(props) => (props.avatarIconColor === "#000000" ? 0 : 1)}
      );
    }

    .profile--user-nickname {
      grid-column: 2/2;
      grid-row: 1/2;
      align-self: end;
      font-size: 2rem;
    }

    .profile--user-role {
      grid-column: 2/2;
      grid-row: 2/3;
      font-size: 1.4rem;
      color: gray;
    }

    .profile--user-direct-message-button {
      grid-column: 3/3;
      grid-row: 1/3;
      justify-self: end;
      align-self: center;
      border: none;
      background-color: #6564db;
      padding: 7.5px 15px;
      color: white;
      font-size: 1.4rem;
      border-radius: 15px;
      font-family: "LightFont";
      text-decoration: none;
    }
  }

  .profile--user-github {
    grid-column: 1/4;
    margin-left: 70px;
    margin-top: -20px;
    width: max-content;
    img {
      width: 30px;
      height: 30px;
    }
  }

  .profile--user-bio,
  .profile--user-stacks {
    grid-column: 1/4;
    display: flex;
    flex-direction: column;
  }

  .divider {
    width: 100%;
    background-color: lightgray;
    height: 1px;
    grid-column: 1/4;
  }

  .profile--user-bio,
  .profile--user-stacks {
    span:nth-child(1) {
      font-size: 1.8rem;
    }

    span:nth-child(2) {
      font-size: 1.2rem;
      color: gray;
    }

    span:nth-child(3) {
      font-size: 1.4rem;
      margin-top: 10px;
    }
  }

  .profile--user-stacks-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;

    .profile--user-stacks-item {
      min-width: 180px;
      max-width: calc(50% - 10px);
      padding: 5px;
      font-size: 1.4rem;
      display: flex;
      gap: 10px;
      div {
        width: 6px;
        height: 6px;
        background-color: black;
        border-radius: 50%;
        align-self: center;
      }
    }
  }
`;

export default MyProfilePage;
