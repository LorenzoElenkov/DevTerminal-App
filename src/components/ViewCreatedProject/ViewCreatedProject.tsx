import React, { useContext, useEffect, useRef, useState } from "react";

import styled from "styled-components";
import { StyledSearchResult } from "../Inside/SearchPage/SearchPage";
import authContext from "../../context/auth-context";
import applicantsIcon from "../images/applicants.png";
import membersIcon from "../images/members.png";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import ReactSelect from "react-select";
const ViewCreatedProject: React.FC<IProps> = (props) => {
  const backdropRef = useRef<any>(null);

  const [filteredApplicants, setFilteredApplicants] = useState<any>([]);
  const [applicantState, setApplicantState] = useState<any>(null);
  const [sendApplicantState, setSendApplicantState] = useState<any>(null);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);

  const context = useContext(authContext);

  const onClickOutside = (e: any) => {
    if (e.target === backdropRef.current) {
      props.close();
    }
  };

  useEffect(() => {
    setFilteredApplicants(props.data.applicants);
  }, []);

  const handleFilterApplicants = (state: any) => {
    if (state === "All") {
      setFilteredApplicants(props.data.applicants);
    } else {
      setFilteredApplicants(
        props.data.applicants.filter((x: any) => x.currentState === state)
      );
    }
  };

  const requestBody = {
    query: `
            mutation {
                approveApplication(approveInput: {id: "${applicantState?.id}", changedState: "${applicantState?.state}", user: "${applicantState?.user}", message: "Your application for '${props.data.title}' has been ${applicantState?.state.toUpperCase()}.${applicantState?.state === 'Approved' ? ' Click here to confirm your attendance!' : ''}"}) {
                    currentState
                }
            }
        `,
  };

  const changeApplicantStatus = () => {
    setLoading(true);
    props.isLoading(true);
    setError("");
    props.error("");
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
      .then((data) => {
        if (!data.errors) {
          setFetchSuccess(true);
          props.fetchSuccess(true);
          props.fetchMessage("Application state changed!");
        } else {
          props.error(data.errors[0].message);
          setError("error");
        }
      });
  };

  useEffect(() => {
    if (loading && fetchSuccess) {
      setTimeout(() => {
        setFetchSuccess(false);
        props.fetchSuccess(false);
        props.isLoading(false);
      }, 2000);
    }
    if (loading && error !== "") {
      setTimeout(() => {
        props.isLoading(false);
        props.error("");
        setError("");
      }, 2000);
    }
  }, [loading, fetchSuccess, error]);
  console.log(applicantState);
  return (
    <StyledBackdrop ref={backdropRef} onClick={(e) => onClickOutside(e)}>
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
        <div className="members">
          <img src={membersIcon} alt="" />
          <span className="membersNumber">
            {props.data.members.length} / {props.data.roles.length + 1}{" "}
            <span>members</span>
          </span>
        </div>
      </StyledSearchResult>
      <StyledApplicantsWindow>
        <h3>Applicants</h3>
        <ReactSelect
          options={filterOptions}
          defaultValue={filterOptions[0]}
          className="filterApplicants"
          styles={customStyles2}
          onChange={(e: any) => handleFilterApplicants(e.value)}
        />
        {props.data.applicants.length > 0 ? (
          filteredApplicants.map((el: any, idx: number) => {
            return (
              <StyledApplicantSingle
                className="applicantWindow"
                key={idx}
                state={el.currentState}
                avatarIcon={el.user.avatarIcon}
                avatarIconColor={el.user.avatarIconColor}
                avatarBackground={el.user.avatarBackground}
                thisConfirm={el._id === applicantState?.id}
              >
                <h2>{el.role}</h2>
                <p>{el.message ? el.message : "No message"}</p>
                <div className="divider" />
                <div className="author">
                  <div className="avatarBackground" />
                  <img src={avatarIcons[Number(el.user.avatarIcon)]} alt="" />
                  <span className="authorName">
                    {el.user.nickname === context.nickname
                      ? "You"
                      : el.user.nickname}
                  </span>
                </div>
                <ReactSelect
                  options={applicationOptions}
                  placeholder="Pending"
                  styles={customStyles2}
                  className="judge"
                  isSearchable={false}
                  onChange={(e: any) =>
                    setApplicantState({
                      id: el._id,
                      state: e.value === "Approve" ? "Approved" : "Rejected",
                      user: el.user._id
                    })
                  }
                />
                {applicantState?.id === el._id && (
                  <button className="confirm" onClick={changeApplicantStatus}>Confirm</button>
                )}
              </StyledApplicantSingle>
            );
          })
        ) : (
          <span className="noApplicants">No applicants yet</span>
        )}
      </StyledApplicantsWindow>
    </StyledBackdrop>
  );
};

const filterOptions = [
  { value: "All", label: "All" },
  { value: "Approved", label: "Approved" },
  { value: "Pending", label: "Pending" },
  { value: "Rejected", label: "Rejected" },
];

const applicationOptions = [
  { value: "Approve", label: "Approve" },
  { value: "Reject", label: "Reject" },
];

const customStyles2 = {
  menu: (provided: any, state: any) => ({
    ...provided,
    width: "min-content",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "1.4rem",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    fontSize: "3.4rem",
    border: "1px solid gray",
    width: "100%",
  }),
};

const StyledApplicantsWindow = styled.div`
  background-color: aliceblue;
  height: max-content;
  width: 50%;
  border-radius: 15px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  h3 {
    font-size: 2rem;
    align-self: center;
  }
  .filterApplicants {
    justify-self: end;
  }

  .noApplicants {
    font-size: 1.6rem;
    justify-self: center;
    grid-column: 1/3;
    margin-bottom: 30px;
  }
`;

interface IApplicantProps {
  state: string;
  avatarIcon: string;
  avatarIconColor: string;
  avatarBackground: string;
  thisConfirm: boolean;
}

const StyledApplicantSingle = styled.div<IApplicantProps>`
  grid-column: 1/3;
  margin-bottom: 5px;
  background-color: #dee4ea;
  padding: 20px;
  border-radius: 15px;
  margin-left: 7px;
  box-shadow: -7px 0px 1px -2px ${(props) => (props.state === "Approved" ? "#008148" : props.state === "Pending" ? "#FCBA04" : "#E94F37")};
  display: grid;
  grid-template-columns: 4fr 1fr;
  row-gap: 10px;
  column-gap: 5px;
  .confirm {
    grid-column: 2/2;
    grid-row: 4/5;
    align-self: end;
    justify-self: center;
    border-radius: 10px;
    border: none;
    background-color: #6564db;
    color: white;
    padding: 5px 10px;
    width: max-content;
    font-size: 1.4rem;
  }
  .judge {
    grid-column: 2/2;
    grid-row: 1/5;
    align-self: center;
  }
  h2 {
    font-size: 1.4rem;
    grid-column: 1/2;
  }
  p {
    font-size: 1.2rem;
    grid-column: 1/2;
    margin-bottom: 5px;
    color: #434343;
  }
  .divider {
    width: 100%;
    height: 1px;
    background-color: darkgray;
    grid-column: 1/2;
  }
  .author {
    grid-column: 1/2;

    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 5px;
    align-items: center;
    .avatarBackground {
      background-color: ${(props) => props.avatarBackground};
      width: 40px;
      height: 40px;
      grid-column: 1/1;
      grid-row: 1/1;
      justify-self: center;
      border-radius: 50%;
    }
    img {
      width: 30px;
      grid-column: 1/1;
      grid-row: 1/1;
      justify-self: center;
      filter: invert(
        ${(props) => (props.avatarIconColor === "#000000" ? 0 : 1)}
      );
    }
    .authorName {
      font-size: 1.4rem;
      font-family: "RegularFont";
    }
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

interface IProps {
  close(): void;
  isLoading(state: boolean): void;
  fetchSuccess(state: boolean): void;
  fetchMessage(message: string): void;
  error(message: string): void;

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
    };
    applicants: [
      {
        _id: string;
        currentState: string;
        message: string;
        user: {
          _id: string;
          nickname: string;
          avatarIcon: string;
          avatarIconColor: string;
          avatarBackground: string;
        };
      }
    ];
  };
}

export default ViewCreatedProject;
