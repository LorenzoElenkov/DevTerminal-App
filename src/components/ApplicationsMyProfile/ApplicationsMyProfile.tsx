import React, { useContext, useEffect, useState } from "react";
import { StyledTopBar } from "../EditMyProfile/EditMyProfile";
import { StyledContainer } from "../ProjectsMyProfile/ProjectsMyProfile";
import authContext from "../../context/auth-context";
import ReactSelect from "react-select";
import styled from "styled-components";

const ApplicationsMyProfile: React.FC<IProps> = (props) => {
  const [projectsToPrint, setProjectsToPrint] = useState<any>([]);
  const [applicationsFetched, setApplicationsFetched] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [error, setError] = useState("");

  const context = useContext(authContext);

  const requestBody = {
    query: `
                query {
                    findUser(userId: "${context.userId}") {
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
          setFetchMessage("All applications fetched!");
          props.fetchMessage("All applications fetched!");
          setApplicationsFetched(data.data.findUser);
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


  return (
    <StyledContainer>
      <StyledTopBar className="topBar">
        <span>Applications ( results)</span>
        <ReactSelect options={applicationOptions} defaultValue={applicationOptions[0]} styles={customStyles2} isSearchable={false}/>
      </StyledTopBar>

    </StyledContainer>
  );
};

interface IProps {
  isLoading(state: boolean): void;
  fetchSuccess(state: boolean): void;
  fetchMessage(message: string): void;
  error(message: string): void;
}

const applicationOptions = [
    { label: "All", value: "All"},
    { label: "Approved", value: "Approved"},
    { label: "Pending", value: "Pending"},
    { label: "Rejected", value: "Rejected"},
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

const StyledApplicationResult = styled.div`

`;

export default ApplicationsMyProfile;
