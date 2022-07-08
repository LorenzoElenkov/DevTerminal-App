import React, { useContext } from "react";
import styled from "styled-components";

import applicantsIcon from "../images/applicants.png";
import authorAvatar from "../images/authorAvatar.png";

import { globalContext, socket } from "../../context/auth-context";

const ProjectContainer: React.FC<IProps> = ({
  _id,
  title,
  description,
  level,
  stacks,
  roles,
  timezone,
  creator,
  // applicants,
  applicantsCount
}) => {
  const context = useContext(globalContext);
  return (
    <globalContext.Consumer>
      {(context) => {
        return (
          <StyledSearchResult>
            <h3 className="title">{title}</h3>
            <h5 className="expLevel">{level.join(" / ")}</h5>
            <span className="description">{description}</span>
            <div className="rolesContainer">
              {roles.map((y: any, idx: number) => {
                return <span className="roleBox" key={idx}>{roles[idx]}</span>;
              })}
              <button className="btn-expand">More...</button>
            </div>
            <span className="divider"></span>
            <div className="author">
              <img src={authorAvatar} alt="" />
              <span className="authorName">{context.userId === creator ? 'You' : creator}</span>
            </div>
            <div className="applicants">
              <img src={applicantsIcon} alt="" />
              <span className="applicantsNumber">
                {applicantsCount}
                <span> applicants</span>
              </span>
            </div>
            <button className="applyButton">View now</button>
          </StyledSearchResult>
        );
      }}
    </globalContext.Consumer>
  );
};

export default ProjectContainer;

interface IProps {
  _id: string;
  title: string;
  description: string;
  level: [string];
  stacks: [string];
  roles: [string];
  timezone: [string];
  creator: string;
  // applicants: [string];
  applicantsCount: number;
}

export const StyledSearchResult = styled.div`
  background: aliceblue;
  border-radius: 15px;
  width: 100%;
  height: max-content;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 5px;
  h3 {
    font-size: 2rem;
    font-family: "RegularFont";
    grid-column: 1/4;
    letter-spacing: 0.5px;
  }
  h5 {
    font-size: 1.2rem;
    color: gray;
    letter-spacing: 1px;
    grid-column: 1/4;
  }
  .description {
    margin-top: 15px;
    font-size: 1.6rem;
    letter-spacing: 0.3px;
    color: gray;
    grid-column: 1/4;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    @supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .timezoneContainer,
  .rolesContainer {
    grid-column: 1/4;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    overflow: hidden;
    max-height: 3.5rem;
    position: relative;
    margin-top: 15px;

    &.showAll {
      max-height: none;
    }

    .btn-expand {
      display: none;
      position: absolute;
      right: 0px;
      top: 0px;
      padding: 7.5px 10px;
      background-color: #6564db;
      border: none;
      border-radius: 15px;
      color: white;
      font-size: 1.4rem;
      font-family: "LightFont";
    }

    .btn-show {
      display: block;
    }

    .timezoneBox,
    .roleBox {
      font-size: 1.4rem;
      padding: 7.5px 20px;
      background: #ccd3da;
      border-radius: 15px;
    }
    .yourZone {
      background: #6564db;
      color: white;
    }
  }
  .divider {
    margin-top: 15px;
    grid-column: 1/4;
    width: 100%;
    border-bottom: 1px solid lightgray;
  }
  .author {
    margin-top: 15px;
    margin-right: 10px;
    display: flex;
    flex-wrap: nowrap;
    gap: 5px;
    align-items: center;
    img {
      width: 40px;
    }
    .authorName {
      font-size: 1.4rem;
      font-family: "RegularFont";
    }
  }
  .applicants {
    margin-top: 15px;
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    align-items: center;
    img {
      width: 40px;
    }
    .applicantsNumber {
      font-size: 2rem;
      font-family: "RegularFont";

      span {
        color: gray;
      }
    }
  }
  .applyButton {
    margin-top: 15px;
    margin-left: 10px;
    border: none;
    border-radius: 15px;
    background: tomato;
    height: max-content;
    width: max-content;
    justify-self: end;
    padding: 10px 30px;
    color: white;
    font-size: 1.6rem;
    font-family: "LightFont";
  }
`;
