import React, { FC, useContext, useEffect, useRef, useState } from "react";

import styled from "styled-components";
import Select from "react-select";
import { CirclePicker } from "react-color";

import { globalContext, socket } from "../../context/auth-context";
import UpdatePassword from "./UpdatePassword";
import Notifications from "../Notifications/Notifications";

// NEED TO CLEAN THIS ENTIRE COMPONENT A BIT, PERHAPS BREAK IT DOWN TOO!

const EditMyProfile: React.FC<IProps> = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [stacks, setStacks] = useState<String[]>([]);

  const [userData, setUserData] = useState<any>({});

  const [loading, setLoading] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [error, setError] = useState("");

  const [avatarColor, setAvatarColor] = useState<string>("#f44336");
  const [avatarImage, setAvatarImage] = useState<number>(0);
  const [avatarInvert, setAvatarInvert] = useState<string>("#fff");

  const [changingPassword, setChangingPassword] = useState<boolean>(false);

  const context = useContext(globalContext);

  const requestBody = {
    query: `
            mutation {
                updateUser(updateInput: {
                    id: "${context.userId}",
                    firstName: "${
                      firstName.trim() !== ""
                        ? firstName.trim()
                        : context.nickname?.split(" ")[0]
                    }",
                    lastName: "${
                      lastName.trim() !== ""
                        ? lastName.trim()
                        : context.nickname?.split(" ")[1]
                    }",
                    role: "${role.trim() !== "" ? role.trim() : context.role}",
                    bio: "${bio.trim() !== "" ? bio.trim() : context.bio}",
                    stacks: [${
                      stacks.length !== 0
                        ? stacks.map((x) => {
                            return '"' + x + '",';
                          })
                        : context.stacks.map((x) => {
                            return '"' + x + '",';
                          })
                    }],
                    avatarIcon: "${avatarImage}",
                    avatarIconColor: "${avatarInvert}",
                    avatarBackground: "${avatarColor}",
                }) {
                    _id
                    nickname
                    role
                    bio
                    skills
                    avatarIcon
                    avatarIconColor
                    avatarBackground
                }
            }
        `,
  };

  const updateUser = () => {
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
          context.updateUser(
            bio,
            role,
            stacks,
            firstName + " " + lastName,
            avatarImage,
            avatarInvert,
            avatarColor,
            [...context.notifications]
          );
          setHasUpdated(true);
          props.fetchSuccess(true);
          props.fetchMessage("Profile successfully modified!");
        } else {
          props.error(data.errors[0].message);
          setError(data.errors[0].message);
        }
      });
  };

  useEffect(() => {
    setTimeout(() => {
      if (loading && hasUpdated) {
        setHasUpdated(false);
        props.fetchSuccess(false);
        setLoading(false);
        props.isLoading(false);
      } else if (loading && error !== "") {
        setError("");
        props.error("");
        setLoading(false);
        props.isLoading(false);
      }
    }, 2000);
  }, [loading, error, hasUpdated]);

  useEffect(() => {
    if (
      context.bio !== null &&
      context.role !== null &&
      context.nickname !== null &&
      context.stacks !== [] &&
      context.avatarIcon !== null &&
      context.avatarIconColor !== null &&
      context.avatarBackground !== null
    ) {
      setUserData({
        nickname:
          context.nickname?.split(" ")[0] +
          " " +
          context.nickname?.split(" ")[1],
        bio: context.bio,
        role: context.role,
        stacks: context.stacks,
        avatarIcon: context.avatarIcon,
        avatarIconColor: context.avatarIconColor,
        avatarBackground: context.avatarBackground,
        notifications: context.notifications,
      });
      setFirstName(context.nickname?.split(" ")[0]);
      setLastName(context.nickname.split(" ")[1]);
      setRole(context.role);
      setBio(context.bio);
      setStacks(context.stacks);
    } else {
      setError("Please fill out your account details!");
      props.error("Please fill out your account details!");
      props.fetchSuccess(true);
      props.isLoading(true);
      setTimeout(() => {
        props.isLoading(false);
        props.fetchSuccess(false);
        props.error("");
      }, 2000);
    }
    setAvatarInvert(context.avatarIconColor);
    setAvatarImage(context.avatarIcon);
    setAvatarColor(context.avatarBackground);
  }, []);

  const changeHandler = (el: any) => {
    let rawData = [];
    for (let i = 0; i < el.length; i++) {
      rawData.push(el[i].value);
    }
    setStacks(rawData);
    defaultStacksHandler(rawData);
  };

  const defaultStacksHandler = (arr: any[]) => {
    let arrayToReturn: any[] = [];
    let arrayToFill: any[] = [];
    for (let i = 0; i < arr.length; i++) {
      arrayToFill = stackOptions.filter((x) => x.value === arr[i]);
      arrayToReturn.push(arrayToFill[0]);
    }
    return arrayToReturn;
  };

  const colorChange = (color: any, event: any) => {
    setAvatarColor(color.hex);
  };

  const avatarChange = (state: string) => {
    if (state === "next") {
      if (avatarImage < 14) {
        setAvatarImage(avatarImage + 1);
      } else {
        setAvatarImage(0);
      }
    } else {
      if (avatarImage > 0) {
        setAvatarImage(avatarImage - 1);
      } else {
        setAvatarImage(14);
      }
    }
  };

  const inputHandler = (e: any, state: string, el: any) => {
    if (state === "firstName") {
      setFirstName(e.target.value);
    } else if (state === "lastName") {
      setLastName(e.target.value);
    } else if (state === "role") {
      setRole(e.target.value);
    } else if (state === "bio") {
      setBio(e.target.value);
    }
  };

  return (
    <globalContext.Consumer>
      {(context) => {
        return (
          <StyledContainer>
            <StyledTopBar>Edit profile</StyledTopBar>
            <StyledBody
              image={avatarImage}
              bgColor={avatarColor}
              inverted={avatarInvert}
            >
              <label className="imageLabel">Profile picture</label>
              <button className="prevIcon" onClick={() => avatarChange("prev")}>
                {"<"}
              </button>
              <div className="imageInput left">
                <div className="imageInputContainer">
                  {avatarIcons.map((x: any, y: number) => {
                    return (
                      <img
                        key={avatarIcons[y]}
                        src={avatarIcons[y]}
                        alt=""
                        className="imagePicker"
                      />
                    );
                  })}
                </div>
              </div>
              <button className="nextIcon" onClick={() => avatarChange("next")}>
                {">"}
              </button>
              <div className="colorPickers">
                <div className="colorPickerTop">
                  <h2>Icon color</h2>
                  <CirclePicker
                    width="100%"
                    circleSize={24}
                    className="colorPicker"
                    onChangeComplete={(color, event) => {
                      setAvatarInvert(color.hex);
                      console.log(color.hex);
                    }}
                    colors={["#fff", "#000"]}
                  />
                </div>
                <div className="colorPickerBottom">
                  <h2>Background color</h2>
                  <CirclePicker
                    width="100%"
                    circleSize={24}
                    className="colorPicker"
                    onChangeComplete={colorChange}
                  />
                </div>
              </div>
              <label className="firstLabel">First name</label>
              <input
                type="text"
                className="firstInput"
                onChange={(e: any) => inputHandler(e, "firstName", null)}
                placeholder={userData.nickname?.split(" ")[0]}
                value={firstName}
              />
              <label className="lastLabel">Last name</label>
              <input
                type="text"
                className="lastInput"
                onChange={(e: any) => inputHandler(e, "lastName", null)}
                placeholder={userData.nickname?.split(" ")[1]}
                value={lastName}
              />
              <label className="bioLabel">Biography</label>
              <input
                type="text"
                className="bioInput"
                onChange={(e: any) => inputHandler(e, "bio", null)}
                placeholder={userData.bio}
                value={bio}
              />
              <label className="roleLabel">Role</label>
              <input
                type="text"
                className="roleInput"
                onChange={(e: any) => inputHandler(e, "role", null)}
                placeholder={userData.role}
                value={role}
              />
              <label className="stacksLabel">Tech Stacks</label>
              <Select
                defaultValue={defaultStacksHandler(context.stacks)}
                closeMenuOnSelect={false}
                options={stackOptions}
                isMulti
                styles={customStyles}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder={
                  userData.stacks !== null
                    ? userData.stacks?.join(", ")
                    : "Type your skill and hit enter!"
                }
                className="stacksInput"
                onChange={(e: any) => changeHandler(e)}
              />
              <div className="divider" />
              <label className="emailLabel">Email</label>
              <input
                type="text"
                className="emailInput"
                value={context.email}
                disabled
              />
              <label className="passwordLabel">Password</label>
              {changingPassword ? (
                <>
                  <UpdatePassword
                    setUpdate={() => {
                      setHasUpdated(true);
                      setLoading(true);
                      props.isLoading(true);
                      props.fetchSuccess(true);
                      props.fetchMessage("Password successfully changed!");
                    }}
                    setError={(err) => {setError(err); setLoading(true); props.isLoading(true); props.fetchSuccess(false); props.error(err)}}
                  />
                </>
              ) : (
                <button
                  className="passwordButton"
                  onClick={() => setChangingPassword(true)}
                >
                  Change password
                </button>
              )}

              <button className="submit" onClick={updateUser}>
                Update
              </button>
            </StyledBody>
          </StyledContainer>
        );
      }}
    </globalContext.Consumer>
  );
};

export default EditMyProfile;

interface IProps {
  isLoading(state: boolean): void;
  fetchSuccess(state: boolean): void;
  fetchMessage(message: string): void;
  error(message: string): void;
}

interface IPropsImage {
  image: number;
  bgColor: string;
  inverted: string;
}

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
    border: "1px solid lightgray",
    padding: "0",
  }),
};

export const avatarIcons = [
  "https://img.icons8.com/ios/50/000000/bad-piggies.png",
  "https://img.icons8.com/ios/50/000000/pacman.png",
  "https://img.icons8.com/ios/50/000000/gary-the-snail.png",
  "https://img.icons8.com/ios/50/000000/squidward-tentacles.png",
  "https://img.icons8.com/ios/50/000000/ninja-head.png",
  "https://img.icons8.com/ios/50/000000/rick-sanchez.png",
  "https://img.icons8.com/ios/50/000000/patrick-star.png",
  "https://img.icons8.com/ios/50/000000/alien.png",
  "https://img.icons8.com/ios/50/000000/frankensteins-monster.png",
  "https://img.icons8.com/ios/50/000000/walter-white.png",
  "https://img.icons8.com/ios/50/000000/minion-1.png",
  "https://img.icons8.com/ios/50/000000/gandalf.png",
  "https://img.icons8.com/ios/50/000000/moon-man.png",
  "https://img.icons8.com/ios/50/000000/jason-voorhees.png",
  "https://img.icons8.com/ios/50/000000/slender-man.png",
];

const stackOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "Java", label: "Java" },
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
  { value: "React", label: "React" },
  { value: "Angular", label: "Angular" },
  { value: ".NET", label: ".NET" },
  { value: "Spring", label: "Spring" },
  { value: "Vue.js", label: "Vue.js" },
  { value: "jQuery", label: "jQuery" },
  { value: "Laravel", label: "Laravel" },
  { value: "WordPress", label: "WordPress" },
  { value: "Symfony", label: "Symfony" },
  { value: "ReactNative", label: "ReactNative" },
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

export const StyledContainer = styled.div`
  height: max-content;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 850px;
  margin-top: 100px;

  &.viewProject {
    margin-top: 20px;
    padding: 0 20px;
    width: 100%;
  }

  .details {
    display: flex;
    gap: 20px;
  }

  .members_chat {
    display: flex;
    gap: 20px;
  }
`;

export const StyledTopBar = styled.div`
  background-color: aliceblue;
  border-radius: 15px;
  box-shadow: -7px 0px 1px -2px #6564db;
  padding: 20px;
  margin: 0 20px;
  font-size: 1.8rem;
`;

const StyledBody = styled.div<IPropsImage>`
  border-radius: 15px;
  margin: 0 20px;
  padding: 20px;
  background-color: aliceblue;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  row-gap: 10px;
  .firstLabel,
  .roleLabel,
  .firstInput,
  .roleInput,
  .imageLabel,
  .imageInput {
    grid-column: 1/1;
    font-size: 1.4rem;
  }
  .lastLabel,
  .stacksLabel,
  .lastInput,
  .stacksInput {
    grid-column: 2/2;
    font-size: 1.4rem;
  }
  .bioLabel,
  .bioInput {
    grid-column: 1/3;
    font-size: 1.4rem;
  }
  .passwordLabel {
    font-size: 1.4rem;
    grid-column: 2/2;
    grid-row: 11/11;
    margin-top: 20px;
  }
  .passwordButton,
  .updatePassButton {
    grid-column: 2/2;
    width: max-content;
    padding: 5px 10px;
    font-size: 1.4rem;
    background: #6564db;
    border: none;
    color: white;
    border-radius: 10px;
  }
  .submit {
    border: none;
    background: #6564db;
    color: white;
    width: max-content;
    justify-self: end;
    align-self: center;
    padding: 5px 20px;
    font-size: 1.4rem;
    border-radius: 10px;
    grid-column: 2/2;
    grid-row: 9/9;
    margin-bottom: 20px;
  }
  .divider {
    height: 1px;
    background-color: lightgray;
    width: 100%;
    grid-column: 1/3;
  }
  .lastLabel {
    grid-row: 3/3;
  }
  .stacksLabel {
    grid-row: 7/7;
  }
  input {
    padding: 5px 10px;
    border: 1px solid lightgray;
  }
  .emailLabel {
    font-size: 1.4rem;
    grid-column: 1/1;
    margin-top: 20px;
  }
  .emailInput {
    font-size: 1.4rem;
    grid-column: 1/1;
  }
  input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .roleInput {
    height: max-content;
  }
  .colorPickers {
    grid-column: 2/2;
    grid-row: 2/2;
    margin-bottom: 20px;
  }

  .colorPickers span {
    font-size: 1.2rem;
  }

  h2 {
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: 300;
  }

  .colorPickers > .colorPickerTop {
    margin-bottom: 20px;
  }

  .imageInput.left {
    grid-column: 1/1;
    grid-row: 2/2;
    width: 60px;
    background: ${(props) => props.bgColor};
    height: 60px;
    align-self: center;
    justify-self: center;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
  }

  .imageInputContainer {
    position: absolute;
    left: ${(props) => props.image * -52.5 + "px"};
    display: flex;
    gap: 7.5px;
    height: 100%;
    transition: left 0.3s ease-out;
  }

  .imageInput.left img {
    width: 45px;
    height: 45px;
    margin-top: 7.5px;
    filter: invert(${(props) => (props.inverted === "#000000" ? 0 : 1)});
  }

  .imageInput.left img:nth-child(1) {
    margin-left: 7.5px;
  }

  .prevIcon,
  .nextIcon {
    grid-column: 1/1;
    grid-row: 2/2;
    border: none;
    background: none;
    justify-self: center;
    font-size: 3rem;
    color: gray;
    margin-left: 100px;
  }

  .prevIcon {
    margin-left: -100px;
  }

  .oldPasswordInput,
  .newPasswordInput1,
  .newPasswordInput2 {
    font-size: 1.4rem;
    grid-column: 2/2;
  }
  .updatePassButton {
    justify-self: end;
    padding: 5px 17.5px;
  }
`;
