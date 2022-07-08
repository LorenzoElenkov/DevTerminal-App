import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { globalContext, socket } from "../../context/auth-context";
import ApplicationsMyProfile from "../ApplicationsMyProfile/ApplicationsMyProfile";
import CreateProject from "../CreateProject/CreateProject";
import EditMyProfile from "../EditMyProfile/EditMyProfile";

import ProjectsMyProfile from "../ProjectsMyProfile/ProjectsMyProfile";

const MyProfile: React.FC<IProp> = ({ subMenu, isLoading, fetchSuccess, fetchMessage, error }) => {
  const context = useContext(globalContext);
  const joinRooms = () => {
    socket.emit("roomsJoin", context.rooms);
  }

  useEffect(() => {
    if (context.token !== '') {
      joinRooms();
    }
  },[context.token])
  return (
    <globalContext.Consumer>
      {(context) => {
        return (
          <>
            {context.token !== "" ? (
              <StyledContainer>
                {subMenu === "edit_profile" && <EditMyProfile isLoading={isLoading} fetchSuccess={fetchSuccess} fetchMessage={fetchMessage} error={error}/>}
                {subMenu === "create_project" && <CreateProject isLoading={isLoading} fetchSuccess={fetchSuccess} fetchMessage={fetchMessage} error={error}/>}
                {subMenu === "" && <ProjectsMyProfile isLoading={isLoading} fetchSuccess={fetchSuccess} fetchMessage={fetchMessage} error={error}/>}
                {subMenu === "applications" && <ApplicationsMyProfile isLoading={isLoading} fetchSuccess={fetchSuccess} fetchMessage={fetchMessage} error={error}/>}
              </StyledContainer>
            ) : (
              <StyledContainer>
                <span>You must log in to access your profile page</span>
              </StyledContainer>
            )}
          </>
        );
      }}
    </globalContext.Consumer>
  );
};

export default MyProfile;

interface IProp {
  subMenu: string;
  isLoading(state: boolean): void;
  fetchSuccess(state: boolean): void;
  fetchMessage(message: string): void;
  error(message: string): void;
}

interface IProps {
  avatarIcon: number;
  avatarIconColor: string;
  avatarBackground: string;
}

const StyledContainer = styled.aside`
  padding: 0px 0 50px 0;
  display: grid;
  /* grid-template-columns: 1fr; */
  grid-template-columns: 1fr 0.5fr 0.5fr;
  grid-template-rows: repeat(auto-fit, max-content);
  font-family: "LightFont";
  grid-column: 2/4;
  & > span {
    grid-column: 1/5;
    justify-self: center;
    font-size: 2rem;
  }
`;

export const StyledProfileContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  grid-column: 1/3;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 270px;
  height: 100vh;
  padding-top: 49px;
  background-color: #f2f2f2;
  box-shadow: inset -5px 0 10px 0px rgba(0, 0, 0, 0.1);
  font-family: "LightFont";
`;

export const StyledProfileCard = styled.div<IProps>`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 20px 20px;
  gap: 5px;
  margin: 20px;
  border-bottom: 1px solid lightgray;
  img {
    width: 40px;
    aspect-ratio: 1/1;
    grid-column: 1/1;
    grid-row: 1/3;
    align-self: center;
    justify-self: center;
  }
  .avatarName {
    font-size: 2rem;
    font-family: "MainFont";
    grid-column: 2/2;
    grid-row: 1/1;
    font-size: 1.5rem;
  }
  .avatarRole {
    font-size: 1.1rem;
    color: gray;
    grid-column: 2/2;
    grid-row: 2/2;
  }

  .avatarIcon {
    width: 30px;
    aspect-ratio: 1/1;
    grid-column: 1/1;
    grid-row: 1/3;
    align-self: center;
    justify-self: center;
    filter: invert(${(props) => (props.avatarIconColor === "#000000" ? 0 : 1)});
  }
  .avatarBackground {
    width: 40px;
    aspect-ratio: 1/1;
    grid-column: 1/1;
    grid-row: 1/3;
    align-self: center;
    justify-self: center;
    background-color: ${(props) => props.avatarBackground};
    border-radius: 50%;
  }
`;
