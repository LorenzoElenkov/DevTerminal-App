import React, { useContext, useEffect, useRef, useState } from "react";

import styled from "styled-components";
import { StyledSearchResult } from "../Inside/SearchPage/SearchPage";
import { globalContext, socket } from "../../context/auth-context";
import applicantsIcon from "../images/applicants.png";
import membersIcon from "../images/members.png";
import verticalDots from "../images/verticalDots.png";
import { avatarIcons, StyledContainer } from "../EditMyProfile/EditMyProfile";
import ReactSelect from "react-select";
import ProjectChat from "../Chats/ProjectChat";
import KickMemberModal from "../KickMemberModal/KickMemberModal";
import TransferOwnerModal from "../TransferOwnerModal/TransferOwnerModal";
import LeaveProjectModal from "../LeaveProjectModal/LeaveProjectModal";
const ViewCreatedProject: React.FC<IProps> = (props) => {
  const backdropRef = useRef<any>(null);

  const [projectsData, setProjectsData] = useState<any>(props.data);

  const [filteredApplicants, setFilteredApplicants] = useState<any>([]);
  const [applicantState, setApplicantState] = useState<any>(null);

  const [isOptions, setIsOptions] = useState<any>({
    state: false,
    index: undefined,
  });

  const [kickModal, setKickModal] = useState<any>({
    state: false,
    user: undefined,
  });
  const [transferModal, setTransferModal] = useState<any>({
    state: false,
    user: undefined,
  });
  const [leaveModal, setLeaveModal] = useState<any>({ state: false });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);

  const [onlineMembers, setOnlineMembers] = useState<any>([]);

  const context = useContext(globalContext);

  const fetchOnlineSockets = () => {
    socket.emit("fetch_room_online_users", projectsData._id);
  };

  useEffect(() => {
    fetchOnlineSockets();

    socket.on("send_room_online_users", (data) => {
      setOnlineMembers(data);
    });

    return () => {
      socket.off("send_room_online_users");
    };
  }, []);

  const checkOnlineStatus = (user: string) => {
    for (let i in onlineMembers) {
      if (onlineMembers[i].userId === user) {
        return true;
      }
    }
    return false;
  };

  const onClickOutside = (e: any) => {
    if (e.target === backdropRef.current) {
      props.close();
    }
  };

  useEffect(() => {
    setFilteredApplicants(projectsData.applicants);
  }, [projectsData.applicants]);

  const handleFilterApplicants = (state: any) => {
    if (state === "All") {
      setFilteredApplicants(projectsData.applicants);
    } else {
      setFilteredApplicants(
        projectsData.applicants.filter((x: any) => x.currentState === state)
      );
    }
  };

  const leaveHandler2 = (state: boolean) => {
    setLeaveModal({ state: state });
    setIsOptions({ ...isOptions, state: false });
  };

  const leaveHandler = (projectId: string) => {
    props.isLoading(true);
    setLoading(true);
    console.log(projectId);
    const leaveBody = {
      query: `
              mutation {
                leaveProject(projectId: "${projectId}") {
                  nickname
                }
              }  
      `,
    };
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(leaveBody),
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
          props.fetchMessage("Successfully left the project!");
          props.close();
          setLeaveModal({ state: false });
        } else {
          props.error(data.errors[0].message);
          setError("error");
        }
      });
  };

  const transferOwner = (userId: string) => {
    props.isLoading(true);
    setLoading(true);
    setTransferModal({ state: false, user: undefined });
    const transferBody = {
      query: `
              mutation {
                transferOwner(projectId: "${projectsData._id}", toUserId: "${userId}", fromUserId: "${context.userId}") {
                  author {
                    _id
                    nickname
                    avatarIcon
                    avatarIconColor
                    avatarBackground
                  }
                }
              }  
      `,
    };
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(transferBody),
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
          props.fetchMessage("Project owner has changed!");
          setProjectsData({
            ...projectsData,
            author: data.data.transferOwner.author,
          });
          console.log(data.data.transferOwner.author);
          setIsOptions({ ...isOptions, state: false });
        } else {
          props.error(data.errors[0].message);
          setError("error");
        }
      });
  };

  const transferHandler2 = (user: string, state: boolean) => {
    setTransferModal({ state: state, user: user });
    setIsOptions({ isOptions, state: false });
  };

  const kickHandler2 = (user: string, state: boolean) => {
    setKickModal({ state: state, user: user });
    setIsOptions({ ...isOptions, state: false });
  };

  const kickHandler = (userId: string) => {
    props.isLoading(true);
    setLoading(true);
    setKickModal({ state: false, user: undefined });
    const kickBody = {
      query: `
              mutation {
                kickMember(projectId: "${projectsData._id}", userId: "${userId}", reason: "") {
                  _id
                  members {
                    user { 
                      _id
                      nickname
                      avatarIcon
                      avatarIconColor
                      avatarBackground
                    }
                    role
                  }
                }
              }  
      `,
    };
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(kickBody),
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
          props.fetchMessage("User removed from project!");
          setProjectsData({
            ...projectsData,
            members: projectsData.members.filter(
              (x: any) => userId !== x.user._id
            ),
          });
          setIsOptions({ ...isOptions, state: false });
        } else {
          props.error(data.errors[0].message);
          setError("error");
        }
      });
  };

  const requestBody = {
    query: `
            mutation {
              approveApplication(approveInput: {id: "${
                applicantState?.id
              }", changedState: "${applicantState?.state}",
              user: "${applicantState?.user}", 
              message: "Your application for '${
                projectsData.title
              }' has been ${applicantState?.state.toUpperCase()}.${
      applicantState?.state === "Approved" &&
      " Check 'Applications' to confirm!"
    }"}) {
                currentState
                user {
                  _id
                  nickname
                  avatarIcon
                  avatarIconColor
                  avatarBackground
                }
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
          const newApplicants = [];
          for (let i of projectsData.applicants) {
            if (i.user._id === applicantState.user) {
              newApplicants.push({
                ...i,
                currentState: data.data.approveApplication.currentState,
              });
            } else {
              newApplicants.push(i);
            }
          }
          if (data.data.approveApplication.currentState === "Approved") {
            setProjectsData({
              ...projectsData,
              members: [
                ...projectsData.members,
                data.data.approveApplication.currentState === "Approved" && {
                  user: data.data.approveApplication.user,
                  role: applicantState.role,
                },
              ],
              applicants: newApplicants,
            });
          } else {
            setProjectsData({
              ...projectsData,
              members: [...projectsData.members],
              applicants: newApplicants,
            });
          }
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

  return (
    <StyledContainer className="viewProject">
      <StyledSearchResult
        className="applyWindow"
        backgroundColor={projectsData.author.avatarBackground}
        iconColor={projectsData.author.avatarIconColor}
      >
        <h3 className="role">{projectsData.title}</h3>
        <h5 className="expLevel">{projectsData.level.join(" / ")}</h5>
        <span className="description">{projectsData.description}</span>
        <div className="rolesContainer">
          <span>Looking for </span>
          <div className="wrapper">
            {projectsData.roles.map((ele: any, idxx: number) => {
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
            {projectsData.stacks.map((ele: any, idxx: number) => {
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
            {projectsData.timezone.map((ele: any, idxx: number) => {
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
          <img
            src={avatarIcons[Number(projectsData.author.avatarIcon)]}
            alt=""
          />
          <span className="authorName">
            {projectsData.author.nickname === context.nickname
              ? "You"
              : projectsData.author.nickname}
          </span>
        </div>
        <div className="applicants">
          <img src={applicantsIcon} alt="" />
          <span className="applicantsNumber">
            {projectsData.applicantsCount} <span>applicants</span>
          </span>
        </div>
        <div className="members">
          <img src={membersIcon} alt="" />
          <span className="membersNumber">
            {projectsData.members.length} / {projectsData.roles.length + 1}{" "}
            <span>members</span>
          </span>
        </div>
      </StyledSearchResult>
      <div className="details">
        {projectsData.author._id === context.userId && (
          <StyledApplicantsWindow>
            <h3>Applicants</h3>
            <ReactSelect
              options={filterOptions}
              defaultValue={filterOptions[0]}
              className="filterApplicants"
              styles={customStyles2}
              onChange={(e: any) => handleFilterApplicants(e.value)}
            />
            {projectsData.applicants.length > 0 ? (
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
                      <img
                        src={avatarIcons[Number(el.user.avatarIcon)]}
                        alt=""
                      />
                      <span className="authorName">
                        {el.user.nickname === context.nickname
                          ? "You"
                          : el.user.nickname}
                      </span>
                    </div>
                    {el.currentState === "Pending" ? (
                      <>
                        <ReactSelect
                          options={applicationOptions}
                          placeholder={el.currentState}
                          styles={customStyles2}
                          className="judge"
                          isSearchable={false}
                          onChange={(e: any) =>
                            setApplicantState({
                              id: el._id,
                              state:
                                e.value === "Approve" ? "Approved" : "Rejected",
                              user: el.user._id,
                              role: el.role,
                            })
                          }
                        />
                        {applicantState?.id === el._id && (
                          <button
                            className="confirm"
                            onClick={changeApplicantStatus}
                          >
                            Confirm
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="currentState">{el.currentState}</span>
                    )}
                  </StyledApplicantSingle>
                );
              })
            ) : (
              <span className="noApplicants">No applicants yet</span>
            )}
          </StyledApplicantsWindow>
        )}
      </div>
      <div className="members_chat">
        <StyledApplicantsWindow
          className="members"
          author={projectsData.author._id}
        >
          <h3 className="members">Members</h3>
          {projectsData.members.map((el: any, idx: number) => {
            return (
              <StyledMembersSingle
                className="applicantWindow"
                key={idx}
                avatarIcon={el.user.avatarIcon}
                avatarIconColor={el.user.avatarIconColor}
                avatarBackground={el.user.avatarBackground}
              >
                <div className="member">
                  <div className="avatarBackground" />
                  <img
                    src={avatarIcons[Number(el.user.avatarIcon)]}
                    alt=""
                    className="avatarImg"
                  />
                  <span className="memberName">
                    {el.user.nickname === context.nickname
                      ? "You"
                      : el.user.nickname}
                    {checkOnlineStatus(el.user._id) ? (
                      <div className="onlineDot" />
                    ) : (
                      <div className="offlineDot" />
                    )}
                  </span>
                  <span className="memberRole">{el.role}</span>
                  {(el.user._id === context.userId ||
                    projectsData.author._id === context.userId) && (
                    <button
                      className="memberOptionsBut"
                      onClick={() =>
                        setIsOptions({ state: !isOptions.state, index: idx })
                      }
                    />
                  )}
                  {isOptions.state === true && isOptions.index === idx && (
                    <div className="memberOptions">
                      {el.user._id === context.userId && (
                        <button
                          className="leaveBut"
                          disabled={el.user._id === projectsData.author._id}
                          onClick={() => leaveHandler2(true)}
                        >
                          Leave
                        </button>
                      )}
                      {el.user._id !== context.userId &&
                        context.userId === projectsData.author._id && (
                          <>
                            <button
                              className="makeOwnerBut"
                              onClick={() => transferHandler2(el.user, true)}
                            >
                              Make owner
                            </button>
                            <button
                              className="kickBut"
                              // onClick={() => kickHandler(el.user._id)}
                              onClick={() => kickHandler2(el.user, true)}
                            >
                              Kick
                            </button>
                          </>
                        )}
                    </div>
                  )}
                </div>
              </StyledMembersSingle>
            );
          })}
        </StyledApplicantsWindow>
        <ProjectChat
          projectId={projectsData._id}
          users={projectsData.members}
          chatId={projectsData.chat._id}
        />
        {leaveModal.state && (
          <LeaveProjectModal
            leaveHandler={() => leaveHandler(projectsData._id)}
            close={() => setLeaveModal({ ...leaveModal, state: false })}
            projectName={props.data.title}
          />
        )}
        {transferModal.state && (
          <TransferOwnerModal
            transferHandler={() => transferOwner(transferModal.user._id)}
            close={() => setTransferModal({ ...transferModal, state: false })}
            user={transferModal.user}
            projectName={props.data.title}
          />
        )}
        {kickModal.state && (
          <KickMemberModal
            kickHandler={() => kickHandler(kickModal.user._id)}
            close={() => setKickModal({ ...kickModal, state: false })}
            user={kickModal.user}
            projectName={props.data.title}
          />
        )}
      </div>
    </StyledContainer>
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

interface Members {
  author?: string;
}

const StyledApplicantsWindow = styled.div<Members>`
  background-color: aliceblue;
  height: max-content;
  border-radius: 15px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
  &.members {
    width: 50%;
    grid-row: 3/3;
  }

  h3 {
    font-size: 2rem;
    align-self: center;
  }
  h3.members {
    margin-top: 6px;
    margin-bottom: 6px;
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

interface IMembersProps {
  avatarIcon: string;
  avatarIconColor: string;
  avatarBackground: string;
}

const StyledMembersSingle = styled.div<IMembersProps>`
  grid-column: 1/3;
  margin-bottom: 5px;
  display: flex;
  position: relative;
  .member {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    grid-template-rows: 1fr 1fr;
    gap: 5px;
    width: 100%;
    .avatarBackground {
      background-color: ${(props) => props.avatarBackground};
      width: 40px;
      height: 40px;
      grid-column: 1/1;
      grid-row: 1/3;
      justify-self: center;
      align-self: center;
      border-radius: 50%;
    }
    .avatarImg {
      width: 30px;
      grid-column: 1/1;
      grid-row: 1/3;
      justify-self: center;
      align-self: center;
      filter: invert(
        ${(props) => (props.avatarIconColor === "#000000" ? 0 : 1)}
      );
    }

    .memberName {
      display: flex;
      gap: 5px;
    }

    .memberName > .onlineDot,
    .offlineDot {
      width: 6px;
      height: 6px;
      background-color: green;
      border-radius: 50%;
      align-self: center;
      position: relative;
    }

    .memberName > .offlineDot {
      background-color: #ff2828;
    }

    .onlineDot::after,
    .offlineDot::after {
      content: "online";
      position: absolute;
      top: calc(50% - 10px);
      left: calc(100% + 4px);
      display: none;
      width: max-content;
      height: max-content;
      padding: 2px 4px;
      background-color: white;
      border: 1px solid lightgray;
      z-index: 10;
      font-size: 1.2rem;
    }

    .offlineDot::after {
      content: "offline";
    }

    .memberName > .onlineDot:hover::after,
    .memberName > .offlineDot:hover::after {
      display: block;
    }

    .memberName,
    .memberRole {
      font-size: 1.4rem;
      font-family: "RegularFont";
      grid-row: 1/1;
      grid-column: 2/2;
    }
    .memberRole {
      grid-row: 2/2;
      color: gray;
      margin-top: -2.5px;
      font-size: 1.2rem;
    }
    .memberOptionsBut {
      background-color: transparent;
      border: none;
      border-radius: 10px;
      grid-column: 3/3;
      grid-row: 1/3;
      justify-self: end;
      background-image: url(${verticalDots});
      background-repeat: no-repeat;
      background-size: contain;
      background-position-y: 50%;
      width: 16px;
    }

    .memberOptions {
      position: absolute;
      z-index: 5;
      top: 0;
      left: calc(100%);
      width: max-content;
      height: 100%;
      padding: 10px 20px;
      display: flex;
      gap: 5px;
      background-color: aliceblue;
      border: 1px solid lightgray;
      button {
        font-size: 1.2rem;
        padding: 6px 12px;
        font-family: "LightFont";
        float: right;
        background-color: #6564db;
        border: none;
        border-radius: 10px;
        width: max-content;
        align-self: center;
        color: white;
      }
      button:disabled {
        background-color: gray;
        cursor: not-allowed;
      }
      button:disabled:hover:after {
        content: "Must not be owner of this project before leaving";
        width: max-content;
        height: max-content;
        padding: 3px 6px;
        top: -20%;
        left: 50%;
        position: absolute;
        background-color: tomato;
      }
    }
  }
`;

const StyledApplicantSingle = styled.div<IApplicantProps>`
  grid-column: 1/3;
  margin-bottom: 5px;
  background-color: #dee4ea;
  padding: 20px;
  border-radius: 15px;
  margin-left: 7px;
  box-shadow: -7px 0px 1px -2px ${(props) => (props.state === "Approved" ? "#008148" : props.state === "Pending" ? "#FCBA04" : "#E94F37")};
  display: grid;
  grid-template-columns: 3.5fr 1fr;
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

  .currentState {
    font-size: 1.6rem;
    grid-row: 1/5;
    grid-column: 2/2;
    align-self: center;
    justify-self: center;
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
  innerMenu: string;

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
    chat: {
      _id: string;
    };
  };
}

export default ViewCreatedProject;
