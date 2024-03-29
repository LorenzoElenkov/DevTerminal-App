import React, { useState, useEffect, useContext, useRef } from "react";
import ReactSelect from "react-select";
import styled from "styled-components";
import { globalContext, socket } from "../../context/auth-context";
import { StyledTopBar } from "../EditMyProfile/EditMyProfile";
import { StyledSearchResult } from "../Inside/SearchPage/SearchPage";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import applicantsIcon from "../images/applicants.png";
import membersIcon from "../images/members.png";
import ViewCreatedProject from "../ViewCreatedProject/ViewCreatedProject";
import { Link } from "react-router-dom";

const ProjectsMyProfile: React.FC<IProps> = (props) => {
  const context = useContext(globalContext);

  useEffect(() => {
    context.setBrowsingUser(null);
  },[]);

  const [projectsToPrint, setProjectsToPrint] = useState<any>([]);
  const [projectsFetched, setProjectsFetched] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [error, setError] = useState("");

  const [filterOption, setFilterOption] = useState<any>({
    value: "Created",
    label: "Created",
  });

  const [clickedProject, setClickedProject] = useState<any>(undefined);
  const [innerMenu, setInnerMenu] = useState<string>("project");

  const requestBody = {
    query: `
            query {
                findUser(userId: "${context.userId}") {
                  createdProjects {
                    _id
                    title
                    description
                    roles {
                      role
                      taken
                    }
                    level
                    stacks
                    timezone
                    author {
                      _id
                      avatarIcon
                      avatarIconColor
                      avatarBackground
                      nickname
                      role
                      skills
                      github
                      bio
                    }
                    applicants {
                      _id
                      currentState
                      message
                      user {
                        _id
                        nickname
                        role
                        bio
                        skills
                        avatarIcon
                        avatarIconColor
                        avatarBackground
                        github
                      }
                      role
                    }
                    applicantsCount
                    members {
                      user {
                        _id
                        nickname
                        role
                        bio
                        skills
                        avatarIcon
                        avatarIconColor
                        avatarBackground
                        github
                      }
                      role
                    }
                    chat { 
                      _id
                    }
                  }
                  inProjects {
                    _id
                    title
                    description
                    roles {
                      role
                      taken
                    }
                    level
                    stacks
                    timezone
                    author {
                      _id
                      avatarIcon
                      avatarIconColor
                      avatarBackground
                      nickname
                      role
                      skills
                      github
                      bio
                    }
                    applicants {
                      _id
                      currentState
                      message
                      user {
                        _id
                        nickname
                        role
                        bio
                        skills
                        avatarIcon
                        avatarIconColor
                        avatarBackground
                        github
                      }
                      role
                    }
                    applicantsCount
                    members {
                      user {
                        _id
                        nickname
                        role
                        bio
                        skills
                        avatarIcon
                        avatarIconColor
                        avatarBackground
                        github
                      }
                      role
                    }
                    chat { 
                      _id
                    }
                  }
                  appliedProjects {
                    project {
                      _id
                      title
                      description
                      roles {
                        role
                        taken
                      }
                      level
                      stacks
                      timezone
                      author {
                        _id
                        avatarIcon
                        avatarIconColor
                        avatarBackground
                        nickname
                        role
                        skills
                        github
                        bio
                      }
                      applicantsCount
                      members {
                        role
                      }
                    }
                  }
                }
            }
        `,
  };

  const fetchCreated = (controller: AbortController) => {
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
      signal: controller.signal
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
          console.log(data.data.findUser);
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
    if (projectsFetched !== null) {
      changeProjectsFilter({ value: filterOption.value });
    }
  }, [projectsFetched]);

  useEffect(() => {
    let controller = new AbortController();
    if (!clickedProject) {
      fetchCreated(controller);
    }
    return () => {
      controller?.abort();
    }
  }, [clickedProject]);

  const changeProjectsFilter = (e: any) => {
    if (e.value === "Created") {
      setFilterOption({ value: "Created", label: "Created" });
      setProjectsToPrint(projectsFetched.createdProjects);
    } else if (e.value === "Partaking") {
      setFilterOption({ value: "Partaking", label: "Partaking" });
      let filteredProjects = projectsFetched.inProjects.filter(
        (x: any) => x.author._id !== context.userId
      );
      setProjectsToPrint(filteredProjects);
    } else if (e.value === "Applied for") {
      setFilterOption({ value: "Applied for", label: "Applied for" });
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
    });
    return count;
  };

  return (
    <StyledContainer>
      {clickedProject === undefined && (
        <>
          <StyledTopBar className="topBar">
            <span>Projects ({projectsToPrint.length} results)</span>
            <ReactSelect
              options={selectOptions}
              defaultValue={selectOptions[0]}
              styles={customStyles2}
              onChange={changeProjectsFilter}
              value={filterOption}
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
                            <span
                              key={idxx}
                              className={
                                ele.taken ? "timezoneBox taken" : "timezoneBox"
                              }
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
                    <Link
                      to={"/myprofile/" + el.author._id}
                      className="profile"
                      onClick={() => {
                        context.setBrowsingUser({
                          _id: el.author._id,
                          stacks: el.author.skills,
                          bio: el.author.bio,
                          role: el.author.role,
                          nickname: el.author.nickname,
                          avatarIcon: el.author.avatarIcon,
                          avatarIconColor: el.author.avatarIconColor,
                          avatarBackground: el.author.avatarBackground,
                          github: el.author.github,
                        });
                      }}
                    >
                      <div className="author">
                        <div className="avatarBackground" />
                        <img src={avatarIcons[el.author.avatarIcon]} alt="" />
                        <span className="authorName">
                          {el.author.nickname === context.nickname
                            ? "You"
                            : el.author.nickname}
                        </span>
                      </div>
                    </Link>
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
                    {filterOption.value !== "Applied for" && (
                      <button
                        className="viewButton"
                        onClick={() => {
                          setClickedProject({
                            ...el,
                          });
                        }}
                      >
                        View
                      </button>
                    )}
                  </StyledSearchResult>
                  {el.author.nickname === context.nickname && (
                    <StyledResultCreatedDetails key={`${idx}:${el.author}`}>
                      <h2>Applicants</h2>
                      <div>
                        <span>
                          Approved: {checkApplicants("Approved", el.applicants)}
                        </span>
                      </div>
                      <div>
                        <span>
                          Pending: {checkApplicants("Pending", el.applicants)}
                        </span>
                      </div>
                      <div>
                        <span>
                          Rejected: {checkApplicants("Rejected", el.applicants)}
                        </span>
                      </div>
                    </StyledResultCreatedDetails>
                  )}
                </>
              );
            })}
          </div>
        </>
      )}
      {clickedProject !== undefined && (
        <>
          <StyledTopBar className="topBar projectBar">
            <button
              className="closeWindow"
              onClick={() => setClickedProject(undefined)}
            >
              {"<<"}
            </button>
            <span className="back">Back</span>
          </StyledTopBar>
          <ViewCreatedProject
            close={() => setClickedProject(undefined)}
            data={clickedProject}
            isLoading={props.isLoading}
            fetchSuccess={props.fetchSuccess}
            fetchMessage={props.fetchMessage}
            error={props.error}
            innerMenu={innerMenu}
          />
        </>
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
    border-radius: 15px;
    box-shadow: -7px 0px 1px -2px #6564db;
    font-size: 2.8rem;
    display: flex;
    justify-content: space-between;

    &.projectBar {
      display: flex;
      justify-content: left;
      gap: 5px;
      background-color: transparent;
      box-shadow: none;
      padding: 0;
    }

    span {
      align-self: center;
    }
    span.back {
      font-size: 1.6rem;
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

    .closeWindow {
      background: transparent;
      color: black;
      border: 1px solid black;
      font-size: 1.2rem;
      padding: 0.2rem 0.8rem;
    }
  }

  .projectsContainer,
  .projectsContainerNotification {
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
