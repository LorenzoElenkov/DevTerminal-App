import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';

import searchIcon from '../../images/atIcon.png';
import passIcon from '../../images/passIcon.png';


const StyledBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(5px);
    display: grid;
    justify-content: center;
    align-items: center;
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
        font-family: 'MainFont';
        text-align: center;
        background: linear-gradient(to right, #6564DB, #29FFBF);
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
        font-family: 'LightFont';
        margin-bottom: 20px;
        justify-self: center;
    }
    label {
        grid-column: 1/4;
        position: relative;
    }
    label:nth-child(3):before {
        position: absolute;
        content: '';
        background: url(${searchIcon});
        background-repeat: no-repeat;
        background-size: 75%;
        width: 30px;
        height: calc(1.6rem + 10px);
        top: 15px;
        left: 7px;
    }
    label:nth-child(5):before {
        position: absolute;
        content: '';
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
    .submit {
        grid-column: 1/4;
        border: none;
        background: #6564DB;
        padding: 5px 30px;
        width: max-content;
        justify-self: center;
        color: white;
        font-size: 1.8rem;
        font-family: 'LightFont';
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
        font-family: 'LightFont';
        font-size: 1.2rem;
        color: gray;
    }
    .facebook {
        column-gap: 1/1;
        background: #338bff;

    }
    .google {
        column-gap: 2/2;
        background: tomato;
        justify-self: end;
    }
    .facebook, .google {
        width: 80%;
        color: white;
        padding: 5px 10px;
        border: none;
        grid-row: 9/9;
    }
`;

const Login: FC<IProps> = ({close}: IProps) => {
    const containerRef = useRef<any>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            close('');
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    },[]);

  return (
    <StyledBackground>
        <StyledContainer ref={containerRef}>
            <h1>Login</h1>
            <h5>Hey there! We are so happy to see you again!</h5>
            <label htmlFor='email' aria-label='Enter your email'/>
            <input type='email' placeholder='Email'/>
            <label htmlFor='password' aria-label='Enter your password'/>
            <input type='password' placeholder='Password'/>
            <button className='submit'>Sign in</button>
            <h3>or</h3>
            <button className='facebook'>Facebook</button>
            <button className='google'>Google</button>
        </StyledContainer>
    </StyledBackground>
  )
}

export default Login;

interface IProps {
    close(menu: string): void;
}

interface IContainer {
    ref: any;
}