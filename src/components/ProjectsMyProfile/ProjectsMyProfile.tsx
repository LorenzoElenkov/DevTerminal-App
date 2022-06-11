import React, { useState, useEffect, useContext } from "react";
import ReactSelect from "react-select";
import styled from "styled-components";
import AuthContext from "../../context/auth-context";
import { StyledTopBar } from "../EditMyProfile/EditMyProfile";
import { StyledSearchResult } from "../Inside/SearchPage/SearchPage";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import applicantsIcon from "../images/applicants.png";

const ProjectsMyProfile: React.FC<IProps> = (props) => {
  const context = useContext(AuthContext);

  const [projectsToPrint, setProjectsToPrint] = useState<any>([]);
  const [projectsFetched, setProjectsFetched] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [error, setError] = useState("");

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
                        applicantsCount
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
        console.log(data);
        if (!data.errors) {
          setFetchSuccess(true);
          props.fetchSuccess(true);
          setFetchMessage("All projects fetched!");
          props.fetchMessage("All projects fetched!");
          setProjectsFetched(data.data.findUser);
        } else {
          if (data.errors[0].message.includes('Project.title')) {
            props.error('No projects found!');
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
    // if (e.value === "All") {
    //   let createdAndInProjects = projectsFetched.createdProjects.concat(
    //     projectsFetched.inProjects.filter(
    //       (i: any) => projectsFetched.createdProjects.indexOf(i) > 0
    //     )
    //   );
    //   let allProjects = [
    //     ...createdAndInProjects,
    //     ...projectsFetched.appliedProjects,
    //   ];
    //   console.log(allProjects);
    //   setProjectsToPrint(allProjects);
    // } else 
    if (e.value === "Created") {
      setProjectsToPrint(projectsFetched.createdProjects);
    } else if (e.value === "Partaking") {
      setProjectsToPrint(projectsFetched.inProjects);
    } else if (e.value === "Applied for") {
      const appliedProjects = projectsFetched.appliedProjects.map((x: any) => x.project);
      setProjectsToPrint(appliedProjects);
    }
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
            <StyledSearchResult
              key={idx}
              backgroundColor={el.author.avatarBackground}
              iconColor={el.author.avatarIconColor}
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
                  {el.applicantsCount} <span>applicants</span>
                </span>
              </div>
              <button
                className="applyButton"
                onClick={() => {
                  // setApplyProjectID(el._id);
                }}
              >
                View
              </button>
            </StyledSearchResult>
          );
        })}
      </div>
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
  .createdProjects {
    display: flex;
    flex-direction: column;
  }

  .topBar {
    height: max-content;
    padding: 20px;
    margin: 0 20px;
    gap: 40px;
    background-color: aliceblue;
    grid-column: 3/5;
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

  .projectsContainer {
    margin: 0 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
