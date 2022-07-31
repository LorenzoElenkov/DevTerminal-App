import React, { useContext, useEffect, useRef, useState } from "react";

import styled, { keyframes } from "styled-components";
// import { StyledSearchResult } from "../ProjectContainer/ProjectContainer";
import { StyledSearchResult } from "../Inside/SearchPage/SearchPage";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import applicantsIcon from "../images/applicants.png";
import { globalContext, socket } from "../../context/auth-context";
import ReactSelect from "react-select";
import membersIcon from "../images/members.png";
import { Link } from "react-router-dom";

const ApplyProject: React.FC<IProps> = (props) => {
  const context = useContext(globalContext);
  const backdropRef = useRef(null);

  const roleSelectRef = useRef<any>(null);

  const [roleSelectValue, setRoleSelectValue] = useState<string>("");
  const [messageValue, setMessageValue] = useState<string>("");

  const onClickOutside = (e: any) => {
    if (e.target === backdropRef.current) {
      props.close();
    }
  };

  useEffect(() => {
    roleOptions.length = 0;
    props.data.roles.map((x: any) => {
      return roleOptions.push({ value: x.role, label: x.role });
    });
  }, []);

  const changeRoleSelect = (e: any) => {
    setRoleSelectValue(e.value);
  };

  return (
    <StyledBackdrop onClick={(e) => onClickOutside(e)} ref={backdropRef}>
      <StyledSearchResult
        className="applyWindow"
        backgroundColor={props.data.author.avatarBackground}
        iconColor={props.data.author.avatarIconColor}
      >
        <button className="closeWindow" onClick={props.close}>
          X
        </button>
        <h3 className="role">{props.data.title}</h3>
        <h5 className="expLevel">{props.data.level.join(" / ")}</h5>
        <span className="description">{props.data.description}</span>
        <div className="rolesContainer">
          <span>Looking for </span>
          <div className="wrapper">
            {props.data.roles.map((ele: any, idxx: number) => {
              return (
                <span
                  key={idxx}
                  className={ele.taken ? "timezoneBox taken" : "timezoneBox"}
                >
                  {ele.role}
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
        <Link
          to={"/myprofile/" + props.data.author._id}
          className="profile"
          onClick={() => {
            context.setBrowsingUser({
              _id: props.data.author._id,
              stacks: props.data.author.skills,
              bio: props.data.author.bio,
              role: props.data.author.role,
              nickname: props.data.author.nickname,
              avatarIcon: props.data.author.avatarIcon,
              avatarIconColor: props.data.author.avatarIconColor,
              avatarBackground: props.data.author.avatarBackground,
              github: props.data.author.github,
            });
          }}
        >
          <div className="author">
            <div className="avatarBackground" />
            <img
              src={avatarIcons[Number(props.data.author.avatarIcon)]}
              alt=""
            />
            <span className="authorName">
              {props.data.author.nickname === context.nickname
                ? "You"
                : props.data.author.nickname}
            </span>
          </div>
        </Link>
        <div className="applicants">
          <img src={applicantsIcon} alt="" />
          <span className="applicantsNumber">
            {props.data.applicantsCount} <span>applicants</span>
          </span>
        </div>
        <div className="members">
          <img src={membersIcon} alt="" />
          <span className="membersNumber">
            {props.data.members.length} / {props.data.roles.length + 1}{" "}
            <span>members</span>
          </span>
        </div>
      </StyledSearchResult>
      <span className="arrowDown">\/</span>
      <StyledApplicationMessage>
        <h1>Application</h1>
        <h2>Applying for role</h2>
        <ReactSelect
          options={roleOptions}
          isSearchable={false}
          placeholder="Role"
          styles={customStyles2}
          ref={roleSelectRef}
          onChange={changeRoleSelect}
        />
        <h2>Message</h2>
        <input
          type="text"
          placeholder="(Optional) Type any additional information you want to share..."
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
        />
        <button
          className="applyButton"
          onClick={() => {
            props.apply(messageValue, roleSelectValue);
          }}
          disabled={roleSelectValue === ""}
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
    members: string[];
    author: {
      _id: string;
      email: string;
      nickname: string;
      avatarIcon: string;
      avatarIconColor: string;
      avatarBackground: string;
      bio: string;
      role: string;
      skills: string;
      github: string;
    };
  };
  close(): void;
  apply(message: string, role: string): void;
}

const roleOptions: any = [];

const customStyles2 = {
  menu: (provided: any, state: any) => ({
    ...provided,
    width: "300px",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "1.4rem",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    fontSize: "3.4rem",
    border: "1px solid gray",
    width: "300px",
  }),
};

const StyledApplicationMessage = styled.div`
  width: 50%;
  background-color: aliceblue;
  border-radius: 15px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat (3, 1fr);
  row-gap: 15px;

  h1 {
    font-size: 2.2rem;
    grid-column: 1/4;
    justify-self: center;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 1.6rem;
    grid-column: 1/4;
  }
  h2:nth-child(4) {
    margin-top: 10px;
  }

  input {
    font-size: 1.4rem;
    padding: 5px 0 5px 5px;
    grid-column: 1/4;
    font-family: "LightFont";
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

  .applyButton:disabled {
    background: gray;
    cursor: not-allowed;
  }
`;

const arrowAnimation = keyframes`
  0% { transform: translateY(0)}
  25% { transform: translateY(10px) }
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
  .arrowDown {
    color: white;
    letter-spacing: -0.4rem;
    font-size: 3rem;
    font-weight: 900;
    animation: ${arrowAnimation} 3s infinite;
    animation-fill-mode: forwards;
  }
`;
