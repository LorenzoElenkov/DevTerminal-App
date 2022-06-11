import React, { useContext, useRef, useState } from "react";

import styled from "styled-components";
// import { StyledSearchResult } from "../ProjectContainer/ProjectContainer";
import { StyledSearchResult } from "../Inside/SearchPage/SearchPage";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import applicantsIcon from "../images/applicants.png";
import authContext from "../../context/auth-context";
const ApplyProject: React.FC<IProps> = (props) => {
  const context = useContext(authContext);
  const backdropRef = useRef(null);

  const [messageValue, setMessageValue] = useState<string>(''); 

  const onClickOutside = (e: any) => {
    if (e.target === backdropRef.current) {
      props.close();
    }
  }
  return (
    <StyledBackdrop onClick={(e) => onClickOutside(e)} ref={backdropRef}>
      <StyledSearchResult
        className="applyWindow"
        backgroundColor={props.data.author.avatarBackground}
        iconColor={props.data.author.avatarIconColor}
      >
        <button className="closeWindow" onClick={props.close}>X</button>
        <h3 className="role">{props.data.title}</h3>
        <h5 className="expLevel">{props.data.level.join(" / ")}</h5>
        <span className="description">{props.data.description}</span>
        <div className="rolesContainer">
          <span>Looking for </span>
          <div className="wrapper">
            {props.data.roles.map((ele: any, idxx: number) => {
              return (
                <span key={idxx} className="timezoneBox">
                  {ele}
                </span>
              );
            })}
            <button className="btn-expand">More...</button>
          </div>
        </div>
        <div className="stacksContainer">
          <span>Tech stacks </span>
          <div className="wrapper">
            {props.data.stacks.map((ele: any, idxx: number) => {
              return (
                <span key={idxx} className="timezoneBox">
                  {ele}
                </span>
              );
            })}
            <button className="btn-expand">More...</button>
          </div>
        </div>
        <div className="timezoneContainer">
          <span>Timezones </span>
          <div className="wrapper">
            {props.data.timezone.map((ele: any, idxx: number) => {
              return (
                <span key={idxx} className="timezoneBox">
                  GMT{ele}
                </span>
              );
            })}
            <button className="btn-expand">More...</button>
          </div>
        </div>
        <span className="divider"></span>
        <div className="author">
          <div className="avatarBackground" />
          <img src={avatarIcons[Number(props.data.author.avatarIcon)]} alt="" />
          <span className="authorName">
            {props.data.author.nickname === context.nickname
              ? "You"
              : props.data.author.nickname}
          </span>
        </div>
        <div className="applicants">
          <img src={applicantsIcon} alt="" />
          <span className="applicantsNumber">
            {props.data.applicantsCount} <span>applicants</span>
          </span>
        </div>
      </StyledSearchResult>
      <StyledApplicationMessage>
        <h2>Message</h2>
        <input type="text" placeholder="(Optional) Type any additional information you want to share..." value={messageValue} onChange={(e) => setMessageValue(e.target.value)}/>
        <button
          className="applyButton"
          onClick={() => {
              props.apply(messageValue);
          }}
        >
          Apply
        </button>
      </StyledApplicationMessage>
    </StyledBackdrop>
  );
};

export default ApplyProject;

interface IProps {
  data: {
    _id: string;
    title: string;
    description: string;
    level: string[];
    roles: string[];
    stacks: string[];
    timezone: string[];
    applicantsCount: string[];
    author: {
      _id: string;
      email: string;
      nickname: string;
      avatarIcon: string;
      avatarIconColor: string;
      avatarBackground: string;
    };
  };
  close(): void;
  apply(message: string): void;
}

const StyledApplicationMessage = styled.div`
  width: 50%;
  background-color: aliceblue;
  border-radius: 15px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat (3, 1fr);
  row-gap: 15px;
  h2 {
    font-size: 1.6rem;
    grid-column: 1/4;
  }

  input {
    font-size: 1.4rem;
    padding: 5px 0 5px 5px;
    grid-column: 1/4;
    font-family: 'LightFont';
  }

  .applyButton {
    border: none;
    border-radius: 15px;
    background: tomato;
    height: max-content;
    width: max-content;
    justify-self: end;
    grid-column: 3/3;
    padding: 10px 30px;
    color: white;
    font-size: 1.6rem;
    font-family: "LightFont";
  }
`;

const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding: 30px 0;
  align-items: center;
  z-index: 3;
  overflow-y: scroll;
  .applyWindow {
    width: 50%;
    position: relative;

    .closeWindow {
      position: absolute;
      top: -15px;
      left: calc(100% - 25px);
      background-color: tomato;
      font-size: 2rem;
      padding: 10px 15px;
      border-radius: 50%;
      border: none;
      color: aliceblue;
    }
    .description {
      white-space: normal;
      text-overflow: clip;
      overflow: visible;

      @supports (-webkit-line-clamp: 999) {
        overflow: visible;
        text-overflow: clip;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 999;
        -webkit-box-orient: vertical;
      }
    }
  }
`;
