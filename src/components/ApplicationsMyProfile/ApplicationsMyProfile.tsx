import React, { useContext, useEffect, useState } from "react";
import { StyledTopBar } from "../EditMyProfile/EditMyProfile";
import { StyledContainer } from "../ProjectsMyProfile/ProjectsMyProfile";
import { globalContext } from "../../context/auth-context";
import ReactSelect from "react-select";
import styled from "styled-components";

import applicantsIcon from "../images/applicants.png";
import membersIcon from "../images/members.png";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import { Link } from "react-router-dom";

const ApplicationsMyProfile: React.FC<IProps> = (props) => {
  const [projectsToPrint, setProjectsToPrint] = useState<any>([]);
  const [applicationsFetched, setApplicationsFetched] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [error, setError] = useState("");

  const context = useContext(globalContext);

  const requestBody = {
    query: `
                query {
                    applications(userId: "${context.userId}") {
                        _id
                        currentState
                        message
                        role
                        project {
                            _id
                            title
                            description
                            roles {
                              role
                              taken
                            }
                            members {
                                user {
                                  _id
                                }
                                role
                            }
                            applicantsCount
                            author {
                                _id
                                nickname
                                avatarIcon
                                avatarIconColor
                                avatarBackground
                                bio
                                role
                                skills
                                github
                            }
                        }
                    }
                }
            `,
  };

  const fetchCreated = () => {
    setIsLoading(true);
    props.isLoading(true);
    setError("");
    props.error("");
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
        if (!data.errors) {
          setFetchSuccess(true);
          props.fetchSuccess(true);
          setFetchMessage("All applications fetched!");
          props.fetchMessage("All applications fetched!");
          //   const applications = data.data.findUser.appliedProjects.map(
          //     (x: any) => x.project
          //   );
          console.log(data.data);
          setProjectsToPrint(data.data.applications);
          setApplicationsFetched(data.data.applications);
        } else {
          if (data.errors[0].message.includes("Project.title")) {
            props.error("No applications found!");
          } else {
            console.log(data.errors[0].message);
            props.error(data.errors[0].message);
          }
          setError("error");
        }
      });
  };

  useEffect(() => {
    setTimeout(() => {
      if (isLoading && fetchSuccess) {
        setIsLoading(false);
        props.isLoading(false);
        setFetchSuccess(false);
        props.fetchSuccess(false);
      } else if (isLoading && !fetchSuccess && error !== "") {
        setIsLoading(false);
        props.isLoading(false);
        setError("");
        props.error("");
      }
    }, 2000);
  }, [isLoading, fetchSuccess, error]);

  useEffect(() => {
    fetchCreated();
  }, []);

  const filterApplications = (option: any, results: any[]) => {
    if (option === "All") {
      setProjectsToPrint(results);
    } else {
      setProjectsToPrint(results.filter((x: any) => x.currentState === option));
    }
  };

  return (
    <StyledContainer>
      <StyledTopBar className="topBar">
        <span>Applications ({applicationsFetched.length} results)</span>
        <ReactSelect
          options={applicationOptions}
          defaultValue={applicationOptions[0]}
          styles={customStyles2}
          isSearchable={false}
          onChange={(e: any) =>
            filterApplications(e.value, applicationsFetched)
          }
        />
      </StyledTopBar>
      <div className="projectsContainer">
        {projectsToPrint.map((el: any, idx: number) => {
          return (
            <StyledApplicationResult
              key={idx}
              state={el.currentState}
              avatarIconColor={el.project.author.avatarIconColor}
              avatarBackground={el.project.author.avatarBackground}
            >
              <h2>{el.role}</h2>
              <p className={el.message ? "message" : "noMessage"}>
                {el.message ? el.message : "No message"}
              </p>
              <div className="divider" />
              <h3>Project details</h3>
              <span>{el.project.title}</span>
              <span>{el.project.description}</span>
              <div className="divider" />
              <div className="details">
                <Link
                  to={"/myprofile/" + el.project.author._id}
                  className="profile"
                  onClick={() => {
                    context.setBrowsingUser({
                      _id: el.project.author._id,
                      stacks: el.project.author.skills,
                      bio: el.project.author.bio,
                      role: el.project.author.role,
                      nickname: el.project.author.nickname,
                      avatarIcon: el.project.author.avatarIcon,
                      avatarIconColor: el.project.author.avatarIconColor,
                      avatarBackground: el.project.author.avatarBackground,
                      github: el.project.author.github,
                    });
                  }}
                >
                  <div className="author">
                    <div className="avatarBackground" />
                    <img
                      src={avatarIcons[el.project.author.avatarIcon]}
                      alt=""
                    />
                    <span className="authorName">
                      {el.project.author.nickname === context.nickname
                        ? "You"
                        : el.project.author.nickname}
                    </span>
                  </div>
                </Link>
                <div className="applicants">
                  <img src={applicantsIcon} alt="" />
                  <span className="applicantsNumber">
                    {el.project.applicantsCount}{" "}
                    <span>
                      {el.project.applicantsCount > 1 ||
                      el.project.applicantsCount < 1
                        ? "applicants"
                        : "applicant"}
                    </span>
                  </span>
                </div>
                <div className="members">
                  <img src={membersIcon} alt="" />
                  <span className="membersNumber">
                    {el.project.members.length} / {el.project.roles.length + 1}{" "}
                    <span>members</span>
                  </span>
                </div>
              </div>
            </StyledApplicationResult>
          );
        })}
      </div>
    </StyledContainer>
  );
};

interface IProps {
  isLoading(state: boolean): void;
  fetchSuccess(state: boolean): void;
  fetchMessage(message: string): void;
  error(message: string): void;
}

interface IPropsApplication {
  state: string;
  avatarIconColor: string;
  avatarBackground: string;
}

const applicationOptions = [
  { label: "All", value: "All" },
  { label: "Approved", value: "Approved" },
  { label: "Pending", value: "Pending" },
  { label: "Rejected", value: "Rejected" },
];

const customStyles2 = {
  menu: (provided: any, state: any) => ({
    ...provided,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "1.4rem",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    fontSize: "3.4rem",
    border: "1px solid gray",
    width: "140px",
  }),
};

const StyledApplicationResult = styled.div<IPropsApplication>`
  padding: 20px;
  height: max-content;
  border-radius: 15px;
  background-color: aliceblue;
  grid-column: 1/2;
  display: flex;
  flex-direction: column;
  gap: 10px;

  box-shadow: -7px 0px 1px -2px ${(props) => (props.state === "Approved" ? "#008148" : props.state === "Pending" ? "#FCBA04" : "#E94F37")};

  h2 {
    font-size: 1.8rem;
  }
  .message {
    font-size: 1.4rem;
    color: gray;
  }
  .noMessage {
    font-size: 1.2rem;
    color: #a9a9a9;
  }
  h3 {
    font-size: 1.6rem;
  }

  span:nth-child(5) {
    font-size: 1.6rem;
  }

  span:nth-child(6) {
    font-size: 1.4rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: gray;
    @supports (-webkit-line-clamp: 2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .divider {
    width: 100%;
    background-color: #bdbdbd;
    height: 1px;
  }

  .details {
    display: flex;
    /* justify-content: space-between; */
    gap: 10%;
  }
  .profile {
    text-decoration: none;
    color: black;
  }
  .author {
    margin-top: 15px;
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

  .applicants,
  .members {
    margin-top: 15px;
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    align-items: center;
    img {
      width: 40px;
      filter: opacity(0.6);
    }
    .applicantsNumber,
    .membersNumber {
      font-size: 2rem;
      font-family: "RegularFont";

      span {
        color: gray;
      }
    }
  }

  .applyButton,
  .viewButton {
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

export default ApplicationsMyProfile;
