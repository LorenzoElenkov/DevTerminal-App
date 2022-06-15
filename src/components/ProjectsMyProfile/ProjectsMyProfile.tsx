import React, { useState, useEffect, useContext } from "react";
import ReactSelect from "react-select";
import styled from "styled-components";
import AuthContext from "../../context/auth-context";
import { StyledTopBar } from "../EditMyProfile/EditMyProfile";
import { StyledSearchResult } from "../Inside/SearchPage/SearchPage";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import applicantsIcon from "../images/applicants.png";
import membersIcon from "../images/members.png";
import ViewCreatedProject from "../ViewCreatedProject/ViewCreatedProject";

const ProjectsMyProfile: React.FC<IProps> = (props) => {
  const context = useContext(AuthContext);

  const [projectsToPrint, setProjectsToPrint] = useState<any>([]);
  const [projectsFetched, setProjectsFetched] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [error, setError] = useState("");

  const [clickedProject, setClickedProject] = useState<any>(undefined);

  const requestBody = {
    query: `
            query {
                findUser(userId: "${context.userId}") {
                    createdProjects {
                        _id
                        title
                        description
                        roles
                        level
                        stacks
                        timezone
                        author {
                          avatarIcon
                          avatarIconColor
                          avatarBackground
                          nickname
                      }
                        applicants {
                          _id
                          currentState
                          message
                          user {
                            _id
                            nickname
                            avatarIcon
                            avatarIconColor
                            avatarBackground
                          }
                          role
                        }
                        applicantsCount
                        members {
                          _id
                        }
                    }
                    inProjects {
                        _id
                        title
                        description
                        roles
                        level
                        stacks
                        timezone
                        author {
                          avatarIcon
                          avatarIconColor
                          avatarBackground
                          nickname
                      }
                      applicantsCount
                      members {
                        _id
                      }
                    }
                    appliedProjects {
                      project {
                        _id
                        title
                        description
                        roles
                        level
                        stacks
                        timezone
                        author {
                          avatarIcon
                          avatarIconColor
                          avatarBackground
                          nickname
                        }
                        applicantsCount
                        members {
                          _id
                        }
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
        // console.log(data);
        if (!data.errors) {
          setFetchSuccess(true);
          props.fetchSuccess(true);
          setFetchMessage("All projects fetched!");
          props.fetchMessage("All projects fetched!");
          setProjectsFetched(data.data.findUser);
        } else {
          if (data.errors[0].message.includes("Project.title")) {
            props.error("No projects found!");
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
    if (
      projectsFetched !== null &&
      projectsFetched.createdProjects.length > 0
    ) {
      changeProjectsFilter({ value: "Created" });
    }
  }, [projectsFetched]);

  useEffect(() => {
    fetchCreated();
  }, []);

  const changeProjectsFilter = (e: any) => {
    if (e.value === "Created") {
      setProjectsToPrint(projectsFetched.createdProjects);
    } else if (e.value === "Partaking") {
      let filteredProjects = projectsFetched.inProjects.filter((x: any) => x.author.nickname !== context.nickname)
      setProjectsToPrint(filteredProjects);
    } else if (e.value === "Applied for") {
      const appliedProjects = projectsFetched.appliedProjects.map(
        (x: any) => x.project
      );
      setProjectsToPrint(appliedProjects);
    }
  };

  const checkApplicants = (state: string, applicants: any) => {
    let count = 0;
    applicants?.forEach((el: any) => {
      if (el.currentState === state) {
        count++;
      }
    })
    return count;
  };

  return (
    <StyledContainer>
      <StyledTopBar className="topBar">
        <span>Projects ({projectsToPrint.length} results)</span>
        <ReactSelect
          options={selectOptions}
          defaultValue={selectOptions[0]}
          styles={customStyles2}
          onChange={changeProjectsFilter}
          isSearchable={false}
        />
      </StyledTopBar>
      <div className="projectsContainer">
        {projectsToPrint.map((el: any, idx: number) => {
          return (
            <>
              <StyledSearchResult
                key={idx}
                backgroundColor={el.author.avatarBackground}
                iconColor={el.author.avatarIconColor}
                className="result"
              >
                <h3 className="role">{el.title}</h3>
                <h5 className="expLevel">{el.level.join(" / ")}</h5>
                <span className="description">{el.description}</span>
                <div className="rolesContainer">
                  <span>Looking for </span>
                  <div className="wrapper">
                    {el.roles.map((ele: any, idxx: number) => {
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
                    {el.stacks.map((ele: any, idxx: number) => {
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
                    {el.timezone.map((ele: any, idxx: number) => {
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
                  <img src={avatarIcons[el.author.avatarIcon]} alt="" />
                  <span className="authorName">
                    {el.author.nickname === context.nickname
                      ? "You"
                      : el.author.nickname}
                  </span>
                </div>
                <div className="applicants">
                  <img src={applicantsIcon} alt="" />
                  <span className="applicantsNumber">
                    {el.applicantsCount}{" "}
                    <span>
                      {el.applicantsCount < 1 || el.applicantsCount > 1
                        ? "applicants"
                        : "applicant"}
                    </span>
                  </span>
                </div>
                <div className="members">
                  <img src={membersIcon} alt="" />
                  <span className="membersNumber">
                    {el.members.length} / {el.roles.length + 1}{" "}
                    <span>members</span>
                  </span>
                </div>
                <button
                  className="viewButton"
                  onClick={() => {
                    setClickedProject({
                      ...el
                    })
                  }}
                >
                  View
                </button>
              </StyledSearchResult>
              {el.author.nickname === context.nickname && (
                <StyledResultCreatedDetails key={`${idx}:${el.author}`}>
                  <h2>Applicants</h2>
                  <div>
                    <span>Approved: {checkApplicants('Approved', el.applicants)}</span>
                  </div>
                  <div>
                    <span>Pending: {checkApplicants('Pending', el.applicants)}</span>
                  </div>
                  <div>
                    <span>Rejected: {checkApplicants('Rejected', el.applicants)}</span>
                  </div>
                </StyledResultCreatedDetails>
              )}
            </>
          );
        })}
      </div>
      {clickedProject !== undefined && (
        <ViewCreatedProject close={() => setClickedProject(undefined)} data={clickedProject} isLoading={props.isLoading} fetchSuccess={props.fetchSuccess} fetchMessage={props.fetchMessage} error={props.error}/>
      )}
    </StyledContainer>
  );
};

export default ProjectsMyProfile;

interface IProps {
  isLoading(state: boolean): void;
  fetchSuccess(state: boolean): void;
  fetchMessage(message: string): void;
  error(message: string): void;
}

interface ProjectProps {
  _id: string;
  title: string;
  description: string;
  roles: [string];
  level: [string];
  stacks: [string];
  timezone: [string];
}

export const customStyles2 = {
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

const selectOptions = [
  {
    value: "Created",
    label: "Created",
  },
  {
    value: "Partaking",
    label: "Partaking",
  },
  {
    value: "Applied for",
    label: "Applied for",
  },
];

export const StyledContainer = styled.div`
  min-width: 850px;
  margin-top: 100px;
  grid-column: 1/4;

  .topBar {
    max-width: 72%;
    min-width: 400px;
    height: max-content;
    padding: 20px;
    margin: 0 20px;
    gap: 40px;
    background-color: aliceblue;
    /* grid-column: 3/5; */
    border-radius: 15px;
    box-shadow: -7px 0px 1px -2px #6564db;
    font-size: 2.8rem;
    display: flex;
    justify-content: space-between;
    span {
      align-self: center;
    }
    button {
      font-family: "RegularFont";
      font-size: 1.4rem;
      padding: 5px 10px;
      background: #6564db;
      border: none;
      border-radius: 15px;
      color: white;
      height: max-content;
      align-self: center;
    }
  }

  .projectsContainer, .projectsContainerNotification {
    margin: 0 20px;
    margin-top: 20px;
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 10px;

    .result {
      grid-column: 1/2;
    }

    .resultCreatedData {
      grid-column: 2/2;
    }
  }
  .projectsContainerNotification {
    gap: 20px;
  }
`;

const StyledResultCreatedDetails = styled.div`
  min-width: 300px;
  background-color: aliceblue;
  height: max-content;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;

  h2 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 20px;
  }

  span {
    font-size: 1.4rem;
  }
`;
