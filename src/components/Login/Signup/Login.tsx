import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


import searchIcon from "../../images/atIcon.png";
import passIcon from "../../images/passIcon.png";

import { globalContext, socket } from "../../../context/auth-context";

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  display: grid;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const StyledContainer = styled.div<IContainer>`
  margin-top: -25vh;
  width: 500px;
  height: max-content;
  background: aliceblue;
  padding: 30px 70px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
  border-radius: 15px;
  position: relative;
  h1 {
    grid-column: 1/4;
    font-size: 3.5rem;
    font-family: "MainFont";
    text-align: center;
    background: linear-gradient(to right, #6564db, #29ffbf);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
  h5 {
    grid-column: 1/4;
    font-size: 1.2rem;
    color: gray;
    font-family: "LightFont";
    margin-bottom: 20px;
    justify-self: center;
  }
  label {
    grid-column: 1/4;
    position: relative;
  }
  label:nth-child(${(props) => (props.error === "" ? 3 : 4)}):before {
    position: absolute;
    content: "";
    background: url(${searchIcon});
    background-repeat: no-repeat;
    background-size: 75%;
    width: 30px;
    height: calc(1.6rem + 10px);
    top: 15px;
    left: 7px;
  }
  label:nth-child(${(props) => (props.error === "" ? 5 : 6)}):before {
    position: absolute;
    content: "";
    background: url(${passIcon});
    background-repeat: no-repeat;
    background-size: 75%;
    width: 30px;
    height: calc(1.6rem + 10px);
    top: 15px;
    left: 7px;
  }
  input {
    grid-column: 1/4;
    font-size: 1.5rem;
    padding: 10px 5px 10px 35px;
    margin-top: -5px;
  }
  .errorSpan {
    grid-column: 1/4;
    font-size: 1.5rem;
    color: red;
    justify-self: center;
    font-family: "LightFont";
    border: 1px solid red;
    padding: 5px 20px;
  }
  .submit {
    grid-column: 1/4;
    border: none;
    background: #6564db;
    padding: 5px 30px;
    width: max-content;
    justify-self: center;
    color: white;
    font-size: 1.8rem;
    font-family: "LightFont";
    border-radius: 15px;
    margin-top: 20px;
  }
  .submit:hover {
    cursor: pointer;
  }
  .divider {
    width: 100%;
    border-top: 0.5px solid #cad2d8;
    margin-top: 20px;
  }
  h3 {
    grid-column: 1/4;
    margin-top: 10px;
    margin-bottom: 10px;
    justify-self: center;
    font-family: "LightFont";
    font-size: 1.2rem;
    color: gray;
  }
  .facebook {
    background: #338bff;
  }
  .google {
    background: tomato;
    justify-self: end;
  }
  .facebook,
  .google {
    width: 80%;
    color: white;
    padding: 5px 10px;
    border: none;
  }
`;

const Login: FC<IProps> = ({ close }: IProps) => {
  const context = useContext(globalContext);

  const containerRef = useRef<any>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      close("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const emailHandler = () => {
    if (emailRef.current) {
      setEmailValue(emailRef.current.value);
    }
  };

  const passHandler = () => {
    if (passRef.current) {
      setPassValue(passRef.current.value);
    }
  };

  const requestBody = {
    query: `
            query { 
                login(email: "${emailValue}", password: "${passValue}") {
                    userId,
                    token,
                    nickname,
                    email,
                    role,
                    bio,
                    skills,
                    avatarIcon,
                    avatarIconColor,
                    avatarBackground
                    notifications {
                      state
                      read
                      message
                    }
                    rooms
                    github
                }
            }
        `,
  };

  const loginHandler = (e: any) => {
    e.preventDefault();
    setError("");

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
      .then((resData) => {
        if (resData.errors) {
          setError(resData.errors[0].message);
        } else if (resData.data.login.token) {
          socket.connect();
          socket.on("connect", () => {
            // currently sending online status online on Login.
            socket.emit("send_online_status", {user: resData.data.login.userId, socketId: socket.id});
            context.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.nickname,
              resData.data.login.email,
              resData.data.login.bio,
              resData.data.login.role,
              resData.data.login.skills,
              resData.data.login.avatarIcon,
              resData.data.login.avatarIconColor,
              resData.data.login.avatarBackground,
              resData.data.login.notifications,
              resData.data.login.rooms,
              resData.data.login.github,
              socket.id
            );
            close("");
            navigate("/profile");
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StyledBackground>
      <StyledContainer ref={containerRef} error={error}>
        <h1>Login</h1>
        <h5>Hey there! We are so happy to see you again!</h5>
        {error !== "" && <span className="errorSpan">{error}</span>}
        <label htmlFor="email" aria-label="Enter your email" />
        <input
          type="email"
          placeholder="Email"
          ref={emailRef}
          onChange={emailHandler}
        />
        <label htmlFor="password" aria-label="Enter your password" />
        <input
          type="password"
          placeholder="Password"
          ref={passRef}
          onChange={passHandler}
        />
        <button className="submit" onClick={(e) => loginHandler(e)}>
          Sign in
        </button>
        <h3>or</h3>
        <button className="facebook">Facebook</button>
        <button className="google">Google</button>
      </StyledContainer>
    </StyledBackground>
  );
};

export default Login;

interface IProps {
  close(menu: string): void;
}

interface IContainer {
  ref: any;
  error: string;
}
