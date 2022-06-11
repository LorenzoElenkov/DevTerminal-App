import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import styled from "styled-components";
import AuthContext from "../../context/auth-context";

const CreateProject: React.FC<IProps> = (props) => {
  const titleRef = useRef<any>();
  const descriptionRef = useRef<any>();
  const rolesRef = useRef<any>();
  const levelRef = useRef<any>();
  const stacksRef = useRef<any>();
  const timezoneRef = useRef<any>();

  const [roleValues, setRolesValues] = useState<String[]>([]);
  const [levelValues, setLevelValues] = useState<String[]>([]);
  const [stackValues, setStackValues] = useState<String[]>([]);
  const [timezoneValues, setTimezoneValues] = useState<String[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
  const [error, setError] = useState<String>("");

  const context = useContext(AuthContext);

  
  const requestBody = {
    query: `
            mutation {
                createProject(projectInput: {
                    title: "${titleRef.current?.value}",
                    description: "${descriptionRef.current?.value}",
                    roles: [${roleValues.map((x) => {
                      return '"' + x + '",';
                    })}],
                    level: [${levelValues.map((x) => {
                      return '"' + x + '",';
                    })}],
                    stacks: [${stackValues.map((x) => {
                      return '"' + x + '",';
                    })}],
                    timezone: [${timezoneValues.map((x) => {
                      return '"' + x + '",';
                    })}],
                    user: "${context.userId}"
                }) {
                    _id
                    roles
                    level
                    stacks
                    timezone
                }
            }
        `,
  };

  const createProject = () => {
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
          props.fetchSuccess(true)
          props.fetchMessage('Project successfully created!')
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

  const changeHandler = (el: any, state: string) => {
    let rawData = [];
    if (state === "level") {
      for (let i = 0; i < el.length; i++) {
        rawData.push(el[i].value);
      }
      setLevelValues(rawData);
    } else if (state === "roles") {
      for (let i = 0; i < el.length; i++) {
        rawData.push(el[i].value);
      }
      setRolesValues(rawData);
    } else if (state === "stacks") {
      for (let i = 0; i < el.length; i++) {
        rawData.push(el[i].value);
      }
      setStackValues(rawData);
    } else if (state === "timezones") {
      for (let i = 0; i < el.length; i++) {
        rawData.push(el[i].value.slice(3, 6));
      }
      setTimezoneValues(rawData);
    }
  };


  return (
    <StyledContainer>
      <span className="containerLabel">Create a project</span>
      <label className="titleLabel">Title:</label>
      <input className="title" type="text" ref={titleRef} />
      <label className="descLabel">Description:</label>
      <input className="description" type="text" ref={descriptionRef} />
      <label className="rolesLabel">Roles:</label>
      <CreatableSelect
        ref={rolesRef}
        isMulti
        className="roles"
        onChange={(el) => changeHandler(el, "roles")}
        styles={customStyles2}
        placeholder={"Type a role and hit ENTER to add..."}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
      <label className="levelsLabel">Level:</label>
      <Select
        ref={levelRef}
        closeMenuOnSelect={false}
        styles={customStyles}
        options={levelOptions}
        isMulti
        name="levels"
        className="levels"
        onChange={(el) => changeHandler(el, "level")}
      />
      <label className="stacksLabel">Stacks:</label>
      <Select
        ref={stacksRef}
        closeMenuOnSelect={false}
        styles={customStyles3}
        options={stackOptions}
        isMulti
        name="stacks"
        className="stacks"
        onChange={(el) => changeHandler(el, "stacks")}
      />
      <label className="timezonesLabel">Timezone(s):</label>
      <Select
        ref={timezoneRef}
        closeMenuOnSelect={false}
        styles={customStyles3}
        options={timezoneOptions}
        isMulti
        name="timezones"
        className="timezones"
        onChange={(el) => changeHandler(el, "timezones")}
      />
      <button onClick={createProject}>Create</button>
    </StyledContainer>
  );
};

export default CreateProject;

interface IProps {
  isLoading(state: boolean): void;
  fetchSuccess(state: boolean): void;
  fetchMessage(message: string): void;
  error(message: string): void;
}

const myTimezoneCalc = (time: string) => {
  let myTimezoneRaw = -(new Date().getTimezoneOffset()) / 60;
  let myTimezonePure: string | undefined;
  if (myTimezoneRaw >= 0 && myTimezoneRaw < 10) {
    myTimezonePure = myTimezoneRaw.toString().padStart(3, "+0");
  } else if (myTimezoneRaw < 0) {
    myTimezonePure = (-myTimezoneRaw).toString().padStart(2, "0");
    myTimezonePure = "-" + myTimezonePure;
  } else {
    myTimezonePure = "+" + myTimezoneRaw;
  }
  if (time.includes(myTimezonePure)) {
    return `${time} (My Timezone)`;
  } else {
    return time;
  }
}

const levelOptions = [
  { value: "Entry", label: "Entry" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Expert", label: "Expert" },
];
const timezoneOptions = [
  { value: "UTC-12:00", label: myTimezoneCalc("UTC-1200") },
  { value: "UTC-11:00", label: myTimezoneCalc("UTC-1100") },
  { value: "UTC-10:00", label: myTimezoneCalc("UTC-1000") },
  { value: "UTC-09:00", label: myTimezoneCalc("UTC-0900") },
  { value: "UTC-08:00", label: myTimezoneCalc("UTC-0800") },
  { value: "UTC-07:00", label: myTimezoneCalc("UTC-0700") },
  { value: "UTC-06:00", label: myTimezoneCalc("UTC-0600") },
  { value: "UTC-05:00", label: myTimezoneCalc("UTC-0500") },
  { value: "UTC-04:00", label: myTimezoneCalc("UTC-0400") },
  { value: "UTC-03:00", label: myTimezoneCalc("UTC-0300") },
  { value: "UTC-02:00", label: myTimezoneCalc("UTC-0200") },
  { value: "UTC-01:00", label: myTimezoneCalc("UTC-0100") },
  { value: "UTC+00:00", label: myTimezoneCalc("UTC+0000") },
  { value: "UTC+01:00", label: myTimezoneCalc("UTC+0100") },
  { value: "UTC+02:00", label: myTimezoneCalc("UTC+0200") },
  { value: "UTC+03:00", label: myTimezoneCalc("UTC+0300") },
  { value: "UTC+04:00", label: myTimezoneCalc("UTC+0400") },
  { value: "UTC+05:00", label: myTimezoneCalc("UTC+0500") },
  { value: "UTC+06:00", label: myTimezoneCalc("UTC+0600") },
  { value: "UTC+07:00", label: myTimezoneCalc("UTC+0700") },
  { value: "UTC+08:00", label: myTimezoneCalc("UTC+0800") },
  { value: "UTC+09:00", label: myTimezoneCalc("UTC+0900") },
  { value: "UTC+10:00", label: myTimezoneCalc("UTC+1000") },
  { value: "UTC+11:00", label: myTimezoneCalc("UTC+1100") },
  { value: "UTC+12:00", label: myTimezoneCalc("UTC+1200") },
];
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

const customStyles = {
  menu: (provided: any, state: any) => ({
    ...provided,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "1.2rem",
    padding: "5px 0px 5px 5px",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    fontSize: "3rem",
    border: "1px solid gray",
    padding: "0",
  }),
};

const customStyles3 = {
  menu: (provided: any, state: any) => ({
    ...provided,
  }),
  menuList: (provided: any, state: any) => ({
    ...provided,
    height: "115px",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "1.2rem",
    padding: "5px 0px 5px 5px",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    fontSize: "3rem",
    border: "1px solid gray",
    padding: "0",
  }),
};

const customStyles2 = {
  menu: (provided: any, state: any) => ({
    ...provided,
    display: "none",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    display: "none",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    fontSize: "3rem",
    border: "1px solid gray",
  }),
};

const StyledContainer = styled.div`
  min-width: 600px;
  background-color: aliceblue;
  margin: 0 20px;
  padding: 20px;
  box-shadow: -7px 0px 1px -2px #6564db;
  border-radius: 15px;
  height: max-content;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: "LightFont";
  row-gap: 10px;
  column-gap: 50px;
  margin-top: 100px;
  input,
  label,
  span,
  .level {
    font-size: 1.4rem;
  }
  .title,
  .titleLabel,
  .description,
  .descLabel {
    grid-column: 1/3;
  }
  .rolesLabel,
  .stacksLabel,
  .roles,
  .stacks {
    grid-column: 1/1;
  }
  .levelsLabel,
  .timezonesLabel,
  .levels,
  .timezones {
    grid-column: 2/2;
  }

  .rolesLabel,
  .levelsLabel {
    grid-row: 6/6;
    margin-top: 20px;
  }
  .stacksLabel,
  .timezonesLabel {
    grid-row: 8/8;
  }

  input {
    padding: 7px 5px;
    font-family: "LightFont";
    border: 1px solid gray;
    border-radius: 5px;
  }
  input:hover {
    border: 1px solid #a3a3a3;
  }
  span:nth-child(1) {
    font-size: 2rem;
    grid-column: 1/3;
  }
  button {
    width: max-content;
    padding: 8px 30px;
    font-size: 1.6rem;
    font-family: "LightFont";
    background-color: #6564db;
    color: white;
    border: none;
    border-radius: 15px;
    margin-top: 30px;
    grid-column: 1/3;
    justify-self: end;
  }
  .containerLabel {
      margin-bottom: 20px;
      justify-self: center;
  }
`;

export const StyledFetchModal = styled.div`
    position: fixed;
    top: 92vh;
    left: 20px;
    /* width: 270px; */
    width: max-content;
    height: max-content;
    padding: 10px;
    background: aliceblue;
    font-size: 1.5rem;
    font-family: 'LightFont';
    z-index: 4;
  &.success {
    box-shadow: -7px 0px 1px -2px #a6ff6e;
  }
  &.failed {
    box-shadow: -7px 0px 1px -2px tomato;
  }
  &.loading_small_modal {
    box-shadow: -7px 0px 1px -2px gray;
  }
`;
