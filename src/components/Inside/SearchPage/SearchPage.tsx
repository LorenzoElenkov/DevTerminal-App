import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import searchIcon from "../../images/searchIcon.png";
import applicantsIcon from "../../images/applicants.png";
import membersIcon from "../../images/members.png";

import { globalContext, socket } from "../../../context/auth-context";

import Select from "react-select";

import { avatarIcons } from "../../EditMyProfile/EditMyProfile";
import ApplyProject from "../../ApplyProject/ApplyProject";
import { Link } from "react-router-dom";

const options = [
  { value: -1, label: "Newest" },
  { value: 1, label: "Oldest" },
];

const customStyles = {
  menu: (provided: any, state: any) => ({
    ...provided,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "1.2rem",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: "15px",
    fontSize: "3rem",
    border: "1px solid gray",
  }),
};

const customStyles2 = {
  menu: (provided: any, state: any) => ({
    ...provided,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "1.2rem",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: "15px",
    fontSize: "3rem",
    border: "1px solid gray",
  }),
  multiValueLabel: (provided: any, state: any) => ({
    fontSize: "1.3rem",
    padding: "2px 4px",
  }),
};

const SearchPage: React.FC<IProps> = (props) => {
  const isOverflow = (element: any) => {
    return element.scrollHeight > element.clientHeight;
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [applyProjectID, setApplyProjectID] = useState<string[]>([]);

  const [exactMatch, setExactMatch] = useState<boolean>(false);

  const [roleSearch, setRoleSearch] = useState<any>("");
  const [windowX, setWindowX] = useState<number | null>(null);
  const [filtersAdded, setFiltersAdded] = useState<number>(0);

  const filtersArray = useRef<any>([]);
  const [filtersLevel, setFiltersLevel] = useState<any>([]);
  const [filtersStacks, setFilterStacks] = useState<any>([]);
  const [filterTimezones, setFilterTimezones] = useState<any>([]);
  const [filterApplicants, setFilterApplicants] = useState<any>([]);

  const [stacksOptions, setStacksOptions] = useState<any>([]);

  const context = useContext(globalContext);
  const [fetchedProjects, setFetchedProjects] = useState<any>(null);
  const [projectsQueryCount, setProjectsQueryCount] = useState<number>(0);
  const [queryPages, setQueryPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [clickedProject, setClickedProject] = useState<any>(undefined);

  const [resultsPerPage, setResultsPerPage] = useState<number>(30);
  const [sortBy, setSortBy] = useState<number>(-1);

  const elLength = useRef<number>(0);

  const closeApplicationWindow = () => {
    setClickedProject(undefined);
  };

  const clearAllFilters = (element: any) => {
    let checkedNum = 0;
    if (element.className === "clearAll") {
      for (let i = 0; i < filtersArray.current.length; i++) {
        filtersArray.current[i].checked = false;
        setFiltersLevel([]);
        setFilterStacks([]);
        setFilterTimezones([]);
        setFilterApplicants([]);
        elLength.current = 0;
        setStacksOptions([]);
      }
      setFiltersAdded(0);
    } else if (element.className === "clearExp") {
      for (let i = 0; i < 3; i++) {
        if (filtersArray.current[i].checked) checkedNum++;
        filtersArray.current[i].checked = false;
        setFiltersLevel([]);
      }
      setFiltersAdded((prevState) => prevState - checkedNum);
    } else if (element.className === "clearTech") {
      for (let i = 3; i < 6; i++) {
        if (filtersArray.current[i].checked) checkedNum++;
        filtersArray.current[i].checked = false;
        setFilterStacks([]);
      }
      setFiltersAdded((prevState) => prevState - checkedNum);
    } else if (element.className === "clearZone") {
      for (let i = 6; i < 11; i++) {
        if (filtersArray.current[i].checked) checkedNum++;
        filtersArray.current[i].checked = false;
        setFilterTimezones([]);
      }
      setFiltersAdded((prevState) => prevState - checkedNum);
    } else if (element.className === "clearAppl") {
      for (let i = 11; i < filtersArray.current.length; i++) {
        if (filtersArray.current[i].checked) checkedNum++;
        filtersArray.current[i].checked = false;
        setFilterApplicants([]);
      }
      setFiltersAdded((prevState) => prevState - checkedNum);
    } else if (element.className === "moreThan3") {
      for (let i = 6; i < 11; i++) {
        if (filtersArray.current[i].checked) checkedNum++;
        filtersArray.current[i].checked = false;
        setFilterTimezones([]);
      }
      setFiltersAdded((prevState) => prevState - checkedNum);
    }
  };
  let addRemoveTimeout: NodeJS.Timeout;

  const addRemoveMoreBtn = (timer: number) => {
    clearTimeout(addRemoveTimeout);
    addRemoveTimeout = setTimeout(() => {
      const container = document.querySelectorAll(".wrapper");
      container.forEach((parent) => {
        if (isOverflow(parent)) {
          parent.lastElementChild?.classList.add("btn-show");
          parent.lastElementChild?.addEventListener("click", (e: any) => {
            e.target.parentElement.classList.add("showAll");
            parent.lastElementChild?.classList.remove("btn-show");
          });
        } else {
          parent.lastElementChild?.classList.remove("btn-show");
        }
      });
      setWindowX(window.innerWidth);
    }, timer);
  };

  addRemoveMoreBtn(200);

  useEffect(() => {
    window.addEventListener("resize", () => {
      addRemoveMoreBtn(200);
    });
  }, []);

  useEffect(() => {
    fetchSearchProjects();
  }, [currentPage]);

  const requestBodyCount = {
    query: `
        query {
            countAllProjects(filter: {
                role: "${roleSearch}",
                levels: [${filtersLevel.map((x: any) => {
                  return '"' + x + '",';
                })}],
                  stack: [${filtersStacks.map((x: any) => {
                    return '"' + x + '",';
                  })}],
                  timezone: [${filterTimezones.map((x: any) => {
                    return '"' + x + '",';
                  })}],
                  applicants: [${filterApplicants.map((x: any) => {
                    return '"' + x + '",';
                  })}],
                  exactMatch: ${exactMatch}
            })
        }  
    `,
  };

  const requestBody = {
    query: `
            query {
                projects(filter: {
                    role: "${roleSearch}",
                    levels: [${filtersLevel.map((x: any) => {
                      return '"' + x + '",';
                    })}],
                    stack: [${filtersStacks.map((x: any) => {
                      return '"' + x + '",';
                    })}],
                    timezone: [${filterTimezones.map((x: any) => {
                      return '"' + x + '",';
                    })}],
                    applicants: [${filterApplicants.map((x: any) => {
                      return '"' + x + '",';
                    })}],
                    exactMatch: ${exactMatch}
                    sortBy: ${sortBy},
                    resultsPerPage: ${resultsPerPage},
                    currentPage: ${currentPage}
                }) {
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
                      nickname
                      role
                      bio
                      skills
                      avatarIcon
                      avatarIconColor
                      avatarBackground
                      github
                    }
                    applicantsCount
                    members {
                      user {
                        _id
                      }
                      role
                    }
                }
            }
        `,
  };

  const fetchSearchProjects = () => {
    setIsLoading(true);
    props.isLoading(true);
    props.error("");
    setFetchedProjects([]);
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
          if (currentPage === 1) {
            fetch("http://localhost:8000/graphql", {
              method: "POST",
              body: JSON.stringify(requestBodyCount),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${context.token}`,
              },
            })
              .then((res2) => {
                return res2.json();
              })
              .then((data2) => {
                setProjectsQueryCount(data2.data.countAllProjects);
                setQueryPages(() => {
                  let array = [];
                  for (
                    let i = 1;
                    i <=
                    Math.ceil(data2.data.countAllProjects / resultsPerPage);
                    i++
                  ) {
                    array.push(i);
                  }
                  return array;
                });
              });
          }
          props.fetchSuccess(true);
          props.fetchMessage("Results are fetched!");
          setIsLoading(false);
          console.log(data.data.projects);
          setFetchedProjects(data.data.projects);
        } else {
          props.error(data.errors[0].message);
          console.log(data.errors[0].message);
        }
        setTimeout(() => {
          props.isLoading(false);
          props.fetchSuccess(false);
          props.error("");
          props.fetchMessage("");
        }, 2000);
      });
  };

  let requestBody2 = {
    query: `
    mutation {
        applyProject(applyInput: {
            project: "${applyProjectID[0]}",
            user: "${context.userId}",
            message: "${applyProjectID[1]}",
            role: "${applyProjectID[2]}"
        }) {
            _id
        }
    }
`,
  };

  const applyProject = () => {
    props.isLoading(true);
    props.fetchSuccess(false);
    props.error("");
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody2),
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
          props.fetchMessage("Application submitted!");
          props.fetchSuccess(true);
        } else {
          props.error(data.errors[0].message);
        }
        setTimeout(() => {
          props.isLoading(false);
          props.fetchMessage("");
          props.fetchSuccess(false);
          props.error("");
        }, 3000);
        setApplyProjectID([]);
      });
  };

  useEffect(() => {
    if (applyProjectID.length > 0) {
      applyProject();
    }
  }, [applyProjectID]);

  return (
    <StyledContainer>
      <StyledSearchContainer>
        <StyledSearchField>
          <h3>
            Search Roles {!isLoading && `(${projectsQueryCount} results)`}
          </h3>
          <label htmlFor="search" />
          <input
            type="search"
            id="search"
            placeholder="Front end dev, Back end dev, UI/UX Designer..."
            onChange={(e: any) => setRoleSearch(e.target.value)}
            value={roleSearch}
          />
          <button onClick={() => fetchSearchProjects()}>Search</button>
          <label>
            <input
              type="checkbox"
              checked={exactMatch}
              onChange={() => setExactMatch(!exactMatch)}
              className="checkboxRegex"
            />
            <span>Exact match?</span>
          </label>
        </StyledSearchField>
        <StyledSearchResultsContainer>
          {fetchedProjects?.length === 0 && (
            <span className="noResults">No results found</span>
          )}
          {fetchedProjects?.map((el: any, idx: number) => {
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
                        <span
                          key={idxx}
                          className={
                            roleSearch.includes(ele.role) && !ele.taken
                              ? "timezoneBox yourRole"
                              : roleSearch.includes(ele.role) && ele.taken
                              ? "timezoneBox taken yourRole"
                              : !roleSearch.includes(ele.role) && !ele.taken
                              ? "timezoneBox"
                              : !roleSearch.includes(ele.role) &&
                                ele.taken &&
                                "timezoneBox taken"
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
                        <span
                          key={idxx}
                          className={
                            filtersStacks.includes(ele)
                              ? "timezoneBox yourStack"
                              : "timezoneBox"
                          }
                        >
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
                        <span
                          key={idxx}
                          className={
                            filterTimezones.includes(ele)
                              ? "timezoneBox yourZone"
                              : "timezoneBox"
                          }
                        >
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
                      {el.applicantsCount > 1 || el.applicantsCount < 1
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
                  className="applyButton"
                  onClick={() => {
                    // setApplyProjectID(el._id);
                    setClickedProject({
                      ...el,
                    });
                  }}
                >
                  View
                </button>
              </StyledSearchResult>
            );
          })}
        </StyledSearchResultsContainer>
        {!isLoading && queryPages.length > 0 && (
          <StyledSearchFieldPagination>
            {currentPage !== 1 && (
              <button onClick={() => setCurrentPage(1)}>{"<"}</button>
            )}
            {3 < currentPage && (
              <>
                <button
                  className="notCurrent"
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                <span>...</span>
              </>
            )}
            {queryPages.map((page: any, idx: number) => {
              if (idx < currentPage + 2 && idx > currentPage - 4) {
                return (
                  <button
                    key={idx}
                    className={
                      currentPage === idx + 1 ? undefined : "notCurrent"
                    }
                    onClick={() => {
                      setCurrentPage(idx + 1);
                    }}
                  >
                    {page}
                  </button>
                );
              } else {
                return null;
              }
            })}
            {currentPage + 2 < queryPages.length && (
              <>
                <span>...</span>
                <button
                  className="notCurrent"
                  onClick={() => setCurrentPage(queryPages.length)}
                >
                  {queryPages[queryPages.length - 1]}
                </button>
              </>
            )}
            {currentPage !== queryPages.length && (
              <button onClick={() => setCurrentPage(currentPage + 1)}>
                {">"}
              </button>
            )}
          </StyledSearchFieldPagination>
        )}
      </StyledSearchContainer>
      <StyledFilterContainer>
        <StyledFilterJob>
          <h3>Filters ({filtersAdded})</h3>
          <button
            onClick={(e) => clearAllFilters(e.target)}
            className="clearAll"
          >
            Clear all
          </button>
        </StyledFilterJob>
        <StyledSearchFieldDetails>
          <div className="sortBy">
            <span>Sort results:</span>
            <Select
              options={options}
              styles={customStyles}
              defaultValue={options[0]}
              className="selectSort"
              isSearchable={false}
              onChange={(el) => {
                if (el) {
                  setSortBy(el.value);
                }
              }}
            />
          </div>
          <div className="showResultsPerPage">
            <span>Results per page:</span>
            <Select
              styles={customStyles}
              className="selectPage"
              options={resultsPage}
              defaultValue={resultsPage[3]}
              isSearchable={false}
              onChange={(el) => {
                if (el) {
                  setResultsPerPage(el.value);
                }
              }}
            />
          </div>
        </StyledSearchFieldDetails>
        <StyledFilterLevel>
          <div>
            <h3>Experience Level</h3>
            <button
              onClick={(e) => clearAllFilters(e.target)}
              className="clearExp"
            >
              Clear
            </button>
          </div>
          <div>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[0] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFiltersLevel((prevValues: any) => {
                      return [...prevValues, "Entry"];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFiltersLevel(
                      filtersLevel.filter((x: any) => x !== "Entry")
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>Entry </span>
              </span>
            </label>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[1] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFiltersLevel((prevValues: any) => {
                      return [...prevValues, "Intermediate"];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFiltersLevel(
                      filtersLevel.filter((x: any) => x !== "Intermediate")
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>Intermediate </span>
              </span>
            </label>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[2] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFiltersLevel((prevValues: any) => {
                      return [...prevValues, "Expert"];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFiltersLevel(
                      filtersLevel.filter((x: any) => x !== "Expert")
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>Expert </span>
              </span>
            </label>
          </div>
        </StyledFilterLevel>
        <StyledFilterLevel>
          <div>
            <h3>Tech Stack</h3>
          </div>
          <div>
            <Select
              options={stackOptions}
              isMulti
              styles={customStyles2}
              placeholder="Type or select..."
              onChange={(el, actionMeta) => {
                let rawData = [];
                if (actionMeta.action === "select-option") {
                  elLength.current += 1;
                  for (let i = 0; i < el.length; i++) {
                    rawData.push(el[i].value);
                    setFiltersAdded(filtersAdded + 1);
                  }
                } else if (actionMeta.action === "clear") {
                  setFiltersAdded(filtersAdded - elLength?.current);
                  elLength.current = 0;
                } else if (actionMeta.action === "remove-value") {
                  setFiltersAdded(filtersAdded - 1);
                  elLength.current -= 1;
                }
                setStacksOptions(el);
                setFilterStacks(rawData);
              }}
              value={stacksOptions}
            />
          </div>
        </StyledFilterLevel>
        <StyledFilterTimezone>
          <div>
            <h3>Timezone difference</h3>
            <button
              onClick={(e) => clearAllFilters(e.target)}
              className="clearZone"
            >
              Clear
            </button>
          </div>
          <div>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[3] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  let myTimezone = new Date().getTimezoneOffset();
                  let myUTC: string | number = -myTimezone / 60;
                  if (myUTC >= 0 && myUTC < 10) {
                    myUTC = myUTC.toString().padStart(3, "+0");
                  } else if (myUTC < 0) {
                    myUTC = (-myUTC).toString().padStart(2, "0");
                    myUTC = "-" + myUTC;
                  }
                  if (e.target.checked) {
                    setFilterTimezones((prevValues: any) => {
                      return [...prevValues, myUTC];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFilterTimezones(
                      filterTimezones.filter((x: any) => x !== myUTC)
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>My timezone</span>
              </span>
            </label>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[4] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  let myTimezone = new Date().getTimezoneOffset();
                  let myUTCplus1: string | number = -(myTimezone + 60) / 60;
                  let myUTCminus1: string | number = -(myTimezone - 60) / 60;
                  if (myUTCminus1 >= 0 && myUTCminus1 < 10) {
                    myUTCminus1 = myUTCminus1.toString().padStart(3, "+0");
                  } else if (myUTCminus1 < 0) {
                    myUTCminus1 = (-myUTCminus1).toString().padStart(2, "0");
                    myUTCminus1 = "-" + myUTCminus1;
                  }

                  if (myUTCplus1 >= 0 && myUTCplus1 < 10) {
                    myUTCplus1 = myUTCplus1.toString().padStart(3, "+0");
                  } else if (myUTCplus1 < 0) {
                    myUTCplus1 = (-myUTCplus1).toString().padStart(2, "0");
                    myUTCplus1 = "-" + myUTCplus1;
                  }
                  if (e.target.checked) {
                    setFilterTimezones((prevValues: any) => {
                      return [...prevValues, myUTCplus1, myUTCminus1];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFilterTimezones(
                      filterTimezones.filter(
                        (x: any) => x !== myUTCplus1 && x !== myUTCminus1
                      )
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>+/- 1 hour </span>
              </span>
            </label>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[5] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  let myTimezone = new Date().getTimezoneOffset();
                  let myUTCplus2: string | number = -(myTimezone + 120) / 60;
                  let myUTCminus2: string | number = -(myTimezone - 120) / 60;

                  if (myUTCminus2 >= 0 && myUTCminus2 < 10) {
                    myUTCminus2 = myUTCminus2.toString().padStart(3, "+0");
                  } else if (myUTCminus2 < 0) {
                    myUTCminus2 = (-myUTCminus2).toString().padStart(2, "0");
                    myUTCminus2 = "-" + myUTCminus2;
                  }

                  if (myUTCplus2 >= 0 && myUTCplus2 < 10) {
                    myUTCplus2 = myUTCplus2.toString().padStart(3, "+0");
                  } else if (myUTCplus2 < 0) {
                    myUTCplus2 = (-myUTCplus2).toString().padStart(2, "0");
                    myUTCplus2 = "-" + myUTCplus2;
                  }

                  if (e.target.checked) {
                    setFilterTimezones((prevValues: any) => {
                      return [...prevValues, myUTCminus2, myUTCplus2];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFilterTimezones(
                      filterTimezones.filter(
                        (x: any) => x !== myUTCplus2 && x !== myUTCminus2
                      )
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>+/- 2 hours </span>
              </span>
            </label>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[6] = el;
                }}
                type="checkbox"
                // If i want to make it perfectly correct I have to check if current UTC offset is close to the either edge (e.g UTC+12, convert 2 hours difference to UTC+10 and UTC-10).
                onChange={(e) => {
                  let myTimezone = new Date().getTimezoneOffset();
                  let myUTCplus3: string | number = -(myTimezone + 180) / 60;
                  let myUTCminus3: string | number = -(myTimezone - 180) / 60;

                  if (myUTCminus3 >= 0 && myUTCminus3 < 10) {
                    myUTCminus3 = myUTCminus3.toString().padStart(3, "+0");
                  } else if (myUTCminus3 < 0) {
                    myUTCminus3 = (-myUTCminus3).toString().padStart(2, "0");
                    myUTCminus3 = "-" + myUTCminus3;
                  }

                  if (myUTCplus3 >= 0 && myUTCplus3 < 10) {
                    myUTCplus3 = myUTCplus3.toString().padStart(3, "+0");
                  } else if (myUTCplus3 < 0) {
                    myUTCplus3 = (-myUTCplus3).toString().padStart(2, "0");
                    myUTCplus3 = "-" + myUTCplus3;
                  }

                  if (e.target.checked) {
                    setFilterTimezones((prevValues: any) => {
                      return [...prevValues, myUTCplus3, myUTCminus3];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFilterTimezones(
                      filterTimezones.filter(
                        (x: any) => x !== myUTCminus3 && x !== myUTCplus3
                      )
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>+/- 3 hours </span>
              </span>
            </label>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[7] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  let moreThan3Hrs: string[] = [];
                  let myTimezone = -new Date().getTimezoneOffset() / 60;
                  for (let i = myTimezone - 4; i > -13; i--) {
                    let item: string | undefined;
                    if (i >= 0 && i < 10) {
                      item = i.toString().padStart(3, "+0");
                    } else if (i < 0) {
                      item = (-i).toString().padStart(2, "0");
                      item = "-" + item;
                    } else {
                      item = "+" + i.toString();
                    }
                    moreThan3Hrs.push(item);
                  }
                  for (let k = myTimezone + 4; k < 13; k++) {
                    let item: string | undefined;
                    if (k >= 0 && k < 10) {
                      item = k.toString().padStart(3, "+0");
                    } else if (k < 0) {
                      item = (-k).toString().padStart(2, "0");
                      item = "-" + item;
                    } else {
                      item = "+" + k.toString();
                    }
                    moreThan3Hrs.push(item);
                  }
                  if (e.target.checked) {
                    setFilterTimezones((prevValues: any) => {
                      return [...prevValues, ...moreThan3Hrs];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFilterTimezones(
                      filterTimezones.filter(
                        (x: any) => !moreThan3Hrs.includes(x)
                      )
                    );
                    setFiltersAdded(filtersAdded - 1);
                    clearAllFilters(e.target);
                  }
                }}
                className="moreThan3"
              />
              <span>
                <span>More than 3 hours </span>
              </span>
            </label>
          </div>
        </StyledFilterTimezone>
        <StyledFilterApplicants>
          <div>
            <h3>Applicants</h3>
            <button
              onClick={(e) => clearAllFilters(e.target)}
              className="clearAppl"
            >
              Clear
            </button>
          </div>
          <div>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[8] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilterApplicants((prevValues: any) => {
                      return [...prevValues, 0, 1, 2, 3, 4];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFilterApplicants(
                      filterApplicants.filter((x: any) => x > 4)
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>Less than 5 </span>
              </span>
            </label>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[9] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilterApplicants((prevValues: any) => {
                      return [...prevValues, 5, 6, 7, 8, 9, 10];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFilterApplicants(
                      filterApplicants.filter((x: any) => x < 5 || x > 10)
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>5 to 10 </span>
              </span>
            </label>
            <label>
              <input
                ref={(el) => {
                  if (filtersArray.current) filtersArray.current[10] = el;
                }}
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilterApplicants((prevValues: any) => {
                      let maxApplicantCount = [];
                      for (let i = 11; i < 501; i++) {
                        maxApplicantCount.push(i);
                      }
                      return [...prevValues, ...maxApplicantCount];
                    });
                    setFiltersAdded(filtersAdded + 1);
                  } else {
                    setFilterApplicants(
                      filterApplicants.filter((x: any) => x < 11 || x > 500)
                    );
                    setFiltersAdded(filtersAdded - 1);
                  }
                }}
              />
              <span>
                <span>More than 10 </span>
              </span>
            </label>
          </div>
        </StyledFilterApplicants>
      </StyledFilterContainer>
      {clickedProject !== undefined && (
        <ApplyProject
          data={clickedProject}
          close={closeApplicationWindow}
          apply={(message: string, role: string) => {
            setApplyProjectID([clickedProject._id, message, role]);
          }}
        />
      )}
    </StyledContainer>
  );
};

export default SearchPage;

interface IProps {
  isLoading(state: boolean): void;
  fetchSuccess(state: boolean): void;
  fetchMessage(message: string): void;
  error(message: string): void;
}

interface ProjectContainerProps {
  backgroundColor: string;
  iconColor: string;
}

const StyledContainer = styled.div`
  height: max-content;
  padding: 0px 0 50px 0;
  display: grid;
  grid-template-columns: 3.5fr 0.75fr 1%;
  font-family: "LightFont";
  grid-column: 2/3;
`;

const StyledSearchContainer = styled.div`
  height: max-content;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 40px;
  padding-top: 100px;
  grid-column: 1/3;
  margin: 0 20px;
  column-gap: 10px;
`;

const StyledSearchField = styled.div`
  grid-column: 1/1;
  grid-row: 1/1;
  background: aliceblue;
  border-radius: 15px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr max-content;
  row-gap: 10px;
  box-shadow: -7px 0px 1px -2px #6564db;
  min-width: 700px;
  max-width: max-content;
  & > h3 {
    font-size: 1.6rem;
    font-family: "LightFont";
    letter-spacing: 0.5px;
    grid-column: 1/3;
  }
  & > label {
    position: relative;
    grid-column: 1/2;
  }
  & > label:not(:last-child):before {
    content: "";
    position: absolute;
    background: url(${searchIcon});
    background-repeat: no-repeat;
    background-size: 75%;
    width: 25px;
    height: calc(1.6rem + 10px);
    top: 20px;
    left: 10px;
  }

  & > label:last-child {
    display: flex;
    gap: 5px;
    align-items: center;
    input {
      transform: scale(1.2, 1.2);
      accent-color: #6f3fff;
    }
    span {
      font-size: 1.2rem;
    }
  }

  & > input {
    grid-column: 1/2;
    font-size: 1.6rem;
    padding: 7.5px 0px 7.5px 35px;
    border-radius: 15px;
    border: 1px solid gray;
    font-family: "LightFont";
  }
  & > .selectSearch {
    font-size: 5rem;
    font-family: "LightFont";
    margin-left: 10px;
  }

  & > button {
    padding: 10px 20px;
    font-size: 1.4rem;
    background-color: #6564db;
    border-radius: 15px;
    border: none;
    color: white;
    width: max-content;
    margin-left: 10px;
    font-family: "LightFont";
  }
`;

const StyledSearchFieldDetails = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  border-radius: 15px;
  gap: 10px;
  padding: 20px;
  background-color: aliceblue;
  border-radius: 15px;
  .sortBy {
    span {
      font-size: 1.2rem;
    }
  }
  .showResultsPerPage {
    span {
      font-size: 1.2rem;
    }
  }
`;

const StyledSearchFieldPagination = styled.div`
  grid-column: 1/3;
  grid-row: 3/3;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
  gap: 10px;
  button {
    background: none;
    border: none;
    font-size: 1.6rem;
  }
  button.notCurrent {
    color: lightgray;
  }
  span {
    font-size: 1.6rem;
  }
`;

export const StyledSearchResultsContainer = styled.div`
  grid-column: 1/3;
  grid-row: 2/2;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .noResults {
    font-size: 2rem;
    text-align: center;
  }
  /* @media screen and (min-width: 1500px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 20px;
    column-gap: 10px;
  } */
`;

export const StyledSearchResult = styled.div<ProjectContainerProps>`
  background: aliceblue;
  border-radius: 15px;
  width: 100%;
  height: max-content;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 5px;
  h3 {
    font-size: 2rem;
    font-family: "RegularFont";
    grid-column: 1/5;
    letter-spacing: 0.5px;
  }
  h5 {
    font-size: 1.2rem;
    color: gray;
    letter-spacing: 1px;
    grid-column: 1/5;
  }
  .description {
    margin-top: 15px;
    font-size: 1.6rem;
    letter-spacing: 0.3px;
    color: gray;
    grid-column: 1/5;
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

  .rolesContainer {
    border-top: 1px solid lightgray;
    margin-top: 20px;
  }
  .rolesContainer,
  .stacksContainer {
    border-bottom: 1px solid lightgray;
  }
  .timezoneContainer,
  .stacksContainer,
  .rolesContainer {
    grid-column: 1/5;
    display: flex;
    flex-direction: column;
    /* height: max-content; */
    padding: 5px 0px;

    & > span {
      font-size: 1.2rem;
      color: gray;
    }

    & > .wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      row-gap: 7px;
      overflow: hidden;
      max-height: 4.4rem;
      position: relative;
      padding: 5px 0px;
    }

    & > .wrapper.showAll {
      max-height: none;
    }

    & > .wrapper > button.btn-expand {
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

    & > .wrapper > button.btn-show {
      display: block;
      margin-top: 5px;
    }

    .timezoneBox {
      font-size: 1.4rem;
      padding: 7.5px 20px;
      background: #ccd3da;
      border-radius: 15px;
    }
    .yourRole {
      background: #0eff97;
      color: black;
    }
    .taken {
      text-decoration: line-through;
      opacity: 0.5;
    }
    .timezoneBox.yourRole.taken {
      background: #0eff97;
      text-decoration: line-through;
      opacity: 0.5;
    }
    .yourStack {
      background: #54c3ff;
      color: white;
    }
    .yourZone {
      background: #6564db;
      color: white;
    }
  }
  .divider {
    grid-column: 1/5;
    width: 100%;
    border-bottom: 1px solid lightgray;
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
      background-color: ${(props) => props.backgroundColor};
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
      filter: invert(${(props) => (props.iconColor === "#000000" ? 0 : 1)});
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

const StyledFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 250px;
  margin-top: 100px;
`;

const StyledFilterJob = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  background: aliceblue;
  border-radius: 15px;
  h3 {
    font-size: 2rem;
    font-family: "RegularFont";
    letter-spacing: 0.5px;
  }
  button {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #6564db;
    letter-spacing: 0.5px;
    padding: 5px 0px 5px 5px;
    font-family: "LightFont";
  }
  button:hover {
    cursor: pointer;
  }
`;

const StyledFilterLevel = styled.div`
  padding: 20px;
  background: aliceblue;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  & > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    gap: 3px;
    h3 {
      font-size: 1.4rem;
      font-family: "RegularFont";
      letter-spacing: 0.5px;
    }
    button {
      background: none;
      border: none;
      color: #6564db;
      font-family: "LightFont";
      font-size: 1.2rem;
    }
    button:hover {
      cursor: pointer;
    }
  }

  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 7.5px;
  }

  & > div:nth-child(2) > label {
    display: flex;
    align-items: center;

    & > span {
      font-size: 1.2rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    & > span > span {
      font-size: 1.4rem;
    }
    & > span > span:nth-child(2) {
      color: gray;
      font-size: 1.2rem;
    }
    input {
      margin-right: 5px;
    }
  }
`;

const StyledFilterApplicants = styled.div`
  padding: 20px;
  background: aliceblue;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  & > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    gap: 3px;

    h3 {
      font-size: 1.4rem;
      font-family: "RegularFont";
      letter-spacing: 0.5px;
    }
    button {
      background: none;
      border: none;
      color: #6564db;
      font-family: "LightFont";
      font-size: 1.2rem;
    }
    button:hover {
      cursor: pointer;
    }
  }

  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 7.5px;
  }

  & > div:nth-child(2) > label {
    display: flex;
    align-items: center;

    & > span {
      font-size: 1.2rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    & > span > span {
      font-size: 1.4rem;
    }
    & > span > span:nth-child(2) {
      color: gray;
      font-size: 1.2rem;
    }
    input {
      margin-right: 5px;
    }
  }
`;

const StyledFilterTimezone = styled.div`
  padding: 20px;
  background: aliceblue;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  & > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    gap: 3px;

    h3 {
      font-size: 1.4rem;
      font-family: "RegularFont";
      letter-spacing: 0.5px;
    }
    button {
      background: none;
      border: none;
      color: #6564db;
      font-family: "LightFont";
      font-size: 1.2rem;
    }
    button:hover {
      cursor: pointer;
    }
  }

  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 7.5px;
  }

  & > div:nth-child(2) > label {
    display: flex;
    align-items: center;

    & > span {
      font-size: 1.2rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    & > span > span {
      font-size: 1.4rem;
    }
    & > span > span:nth-child(2) {
      color: gray;
      font-size: 1.2rem;
    }
    input {
      margin-right: 5px;
    }
  }
`;

const stackOptions = [
  { value: "JavaScript", label: "JavaScript" },
  //value JavaA and label Java so it does not also filters Javascript due to regex
  { value: "Javaa", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "C#", label: "C#" },
  { value: "C/C++", label: "C/C++" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Node.js", label: "Node.js" },
  { value: "PHP", label: "PHP" },
  { value: "Golang", label: "Golang" },
  { value: "Kotlin", label: "Kotlin" },
  { value: "Scala", label: "Scala" },
  { value: "Ruby", label: "Ruby" },
  { value: "Swift", label: "Swift" },
  { value: "Perl", label: "Perl" },
  { value: "Objective-C", label: "Objective-C" },
  { value: "VBA", label: "VBA" },
  { value: "Rust", label: "Rust" },
  { value: "Haskell", label: "Haskell" },
  { value: "Assembly", label: "Assembly" },
  { value: "Julia", label: "Julia" },
  { value: "HTML/CSS", label: "HTML/CSS" },
  //value Reactjs and label React so it does not also filters React Native due to regex
  { value: "Reactjs", label: "React" },
  { value: "Angular", label: "Angular" },
  { value: ".NET", label: ".NET" },
  { value: "Spring", label: "Spring" },
  { value: "Vue.js", label: "Vue.js" },
  { value: "jQuery", label: "jQuery" },
  { value: "Laravel", label: "Laravel" },
  { value: "WordPress", label: "WordPress" },
  { value: "Symfony", label: "Symfony" },
  { value: "React Native", label: "React Native" },
  { value: "Express.js", label: "Express.js" },
  { value: "Django", label: "Django" },
  { value: "Flutter", label: "Flutter" },
  { value: "Flask", label: "Flask" },
  { value: "Ruby on Rails", label: "Ruby on Rails" },
  { value: "Unity", label: "Unity" },
  { value: "Xamarin", label: "Xamarin" },
  { value: "Unreal Engine", label: "Unreal Engine" },
  { value: "Gatsby", label: "Gatsby" },
  { value: "SQL", label: "SQL" },
  { value: "MySQL", label: "MySQL" },
  { value: "MS SQL", label: "MS SQL" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "DynamoDB", label: "DynamoDB" },
  { value: "MariaDB", label: "MariaDB" },
  { value: "Firebase", label: "Firebase" },
  { value: "SQLite", label: "SQLite" },
];

const resultsPage = [
  { value: 12, label: "12" },
  { value: 18, label: "18" },
  { value: 24, label: "24" },
  { value: 30, label: "30" },
];
