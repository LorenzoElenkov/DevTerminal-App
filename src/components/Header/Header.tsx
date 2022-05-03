import React, { useState } from 'react';

import styled, { keyframes } from 'styled-components';

import searchIcon from '../images/searchIcon.png';

const Header: React.FC<IProps> = ({abc}: IProps) => {
  const [loginOrSignup, setLoginOrSignup] = useState('');

  const handle = (menu: string) => {
    abc(menu);
  };

    
  return (
    <StyledNav className='nav'>
        <StyledLogo column='2'>DevTerminal</StyledLogo>
        <StyledButton column='3'>Home</StyledButton>
        <StyledButton column='4'>Features</StyledButton>
        <StyledButton column='5'>Pricing</StyledButton>
        <StyledButton column='6'>F.A.Q.</StyledButton>
        {/* <StyledSearchBar column='8'>
            <label htmlFor='search'/>
            <input id='search' type='text' autoComplete='false' placeholder='Search projects...'/>
        </StyledSearchBar> */}
        <StyledButton column='9' onClick={() => handle('login')}>Login</StyledButton>
        <StyledButton column='10' onClick={() => handle('signup')}>Sign up</StyledButton>
    </StyledNav>
  )
}

export default Header;


interface IProps {
    abc(menu: string): void;
}

interface IButtonProps {
    className?: string;
    column: string;
}

interface ISearchProps {
    className?: string;
    column: string;
}

interface ILogo {
    className?: string;
    column: string;
}

const StyledNav = styled.nav`
    /* position: absolute;
    top: 0;
    left: 0; */
    width: 100%;
    height: 48px;
    display: grid;
    grid-template-columns: 50px max-content repeat(4, max-content) 1fr repeat(3, max-content) 50px;
    grid-template-rows: max-content;
    align-items: center;
    column-gap: 10px;
    padding: 10px 0;
    background: white;
    z-index: 0;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
`;

const StyledSearchBar = styled.div<ISearchProps>`
    grid-column: ${props => props.column};
    height: 100%;
    width: 100%;
    font-family: 'LightFont';
    align-self: end;

    label {
        font-size: 1.4rem;
        color: black;
        position: relative;
    }

    input {
        font-size: 1.2rem;
        padding: 5px 5px 5px 25px;
        width: 0px;
        visibility: hidden;
        outline: 1px solid lightgray;
        transition: width 0.4s ease-in-out;
        border: none;
    }

    input:hover, input:focus {
        visibility: visible;
        width: 200px;
    }


    label::before {
        position: absolute;
        content: '';
        background: url(${searchIcon});
        /* background: red; */
        background-repeat: no-repeat;
        background-size: 75%;
        width: 25px;
        height: calc(1.6rem + 10px);
        top: -1px;
        left: 4px;
    }
`;

const buttonAnimTop = keyframes`

    0% {
        top: -100%;
        width: 5px;
        left: calc(100% - 20px);
    }
    30% {
        top: -5%;
        width: 5px;
        left: calc(100% - 20px);

    }
    60% {
        top: -5%;
        width: 5px;
        left: calc(100% - 20px);
    }
    100% {
        top: -5%;
        width: calc(100% - 30px);
        left: 15px;
    }
`;

const buttonAnimBottom = keyframes`

    0% {
        opacity: 0;
        top: 200%;
        width: 5px;
        left: 15px;
    }
    15% {
        opacity: 0;
    }
    30% {
        top: 90%;
        width: 5px;
        left: 15px;
        opacity: 1;
    }
    60% {
        top: 90%;
        width: 5px;
        left: 15px;
    }
    100% {
        top: 90%;
        width: calc(100% - 30px);
        left: 15px;
    }
`;


const StyledButton = styled.button<IButtonProps>`
    height: max-content;
    grid-column: ${props => props.column};
    padding: ${props => props.column > '6' ? '5px 20px' : '5px 15px'};
    background: ${props => props.column !== '10' ? 'transparent' : 'linear-gradient(45deg, #29FFBF, #6564DB 20%)'};
    background-size: 200%;
    background-position: 300% 100%;
    color: ${props => props.column === '10' ? 'white' : 'black'};
    border: none;
    border-left: ${props => props.column === '3' && '1px solid black'};
    letter-spacing: 0.5px;
    border-radius: ${props => props.column === '10' ? '15px' : 'none'};
    font-size: 1.4rem;
    font-family: ${props => props.column === '10' ? 'MainFont' : 'LightFont'};
    transition: background-position 0.2s ease-in-out;
    position: relative;
        &:hover {
            cursor: pointer;
            background-position: 200% 100%;
        }

        &:not(:last-child):hover:before {
            top: -5%;
            animation: ${buttonAnimTop} 0.5s;
        }

        &:not(:last-child):hover:after {
            top: 90%;
            opacity: 1;
            animation: ${buttonAnimBottom} 0.5s;
        }

        &:not(:last-child):before {
            content: '';
            position: absolute;
            top: -100%;
            left: 15px;
            border-radius: 10px;
            width: calc(100% - 30px);
            height: 5px;
            background: linear-gradient(to right, #29FFBF, #6564DB);
            z-index: -1;
        }

        &:not(:last-child):after {
            content: '';
            position: absolute;
            top: 200%;
            left: 15px;
            border-radius: 10px;
            width: calc(100% - 30px);
            height: 5px;
            opacity: 0;
            background: linear-gradient(to right, #29FFBF, #6564DB);
            z-index: -1;
        }
`;

const StyledLogo = styled.span<ILogo>`
    grid-column: ${props => props.column};
    font-family: 'MainFont';
    font-size: 2rem;
    padding: 0 10px;
    cursor: pointer;
    
    background-color: white;
    background-image: linear-gradient(to right, #29FFBF 0%, #6564DB 35%, #6564DB 35%, #29FFBF 100%);
    background-size: 110%;
    background-repeat: repeat;
    
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    transition: all 0.25s ease-in-out;
        &:hover {
            background-size: 250%;
        }
    
`;