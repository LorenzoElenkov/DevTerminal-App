import React from 'react';
import mainImg from '../images/mainimage2.png';

import styled, { keyframes } from 'styled-components';

const LandingPage: React.FC = () => {
  return (
    <StyledContainer>
        <StyledMainImage src={mainImg} alt=''/>
        <StyledMainText>
            <StyledMainTitle><span>The platform</span> where developers come together to create amazing things</StyledMainTitle>
            <StyledMainSubtitle>Connecting with hundreds of other developers is easier now with DevTerminal.<br />Browse projects of other developers or create one yourself - get help for bigger and more complex projects.</StyledMainSubtitle>
            <StyledMainButton>Get started</StyledMainButton>
            <StyledHowButton>How it works?</StyledHowButton>
        </StyledMainText>
    </StyledContainer>
  )
}

export default LandingPage;

const StyledContainer = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;


const StyledMainImage = styled.img`
    grid-column: 1/1;
    width: 75%;
    align-self: center;
    justify-self: center;
    //FFCE31 - yellow
    //FF9329 - orange
`;

const StyledMainText = styled.div`
    grid-column: 2/2;
    grid-row: 1/1;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr max-content 0.65fr;
`;

const StyledMainTitle = styled.h1`
    font-size: 5rem;
    align-self: end;
    font-family: 'MainFont';
    width: 85%;
    grid-row: 1/1;
    grid-column: 1/1;

     span {
         font-size: 5rem;
         background-image: linear-gradient(45deg, #29FFBF, #6564DB 60%);
         background-size: 200%;
         background-clip: text;
        -webkit-background-clip: text;
        -moz-background-clip: text;
    
        -webkit-text-fill-color: transparent;
        -moz-text-fill-color: transparent;
     }
`;

const StyledMainSubtitle = styled.h2`
    font-size: 1.7rem;
    font-family: 'LightFont';
    width: 85%;
    // text-align: end;
    padding: 50px 0;
`;

const mainButtonAnim = keyframes`
    0%, 85% {
        transform: scale(0.8);
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: scale(1.2);
    }
`;

const mainButtonAnim2 = keyframes`
    0%, 85% {
        transform: scale(1);
    }
    90% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
`;

const StyledMainButton = styled.button`
    width: max-content;
    height: max-content;
    padding: 10px 20px;
    font-size: 2rem;
    font-family: 'LightFont';
    background: #6564DB;
    color: white;
    border: none;
    border-radius: 15px;
    grid-row: 3/3;
    grid-column: 1/1;
    animation: ${mainButtonAnim2} 5s infinite;
    position: relative;
        &::before {
            content: '';
            top: -8%;
            left: -4%;
            width: 105%;
            height: 110%;
            position: absolute;
            border: 2px solid #6564DB;
            border-radius: 18px;
            z-index: -1;
            transform: scale(0.8);
            animation: ${mainButtonAnim} 5s infinite;
        }
    cursor: pointer;
    
`;

const StyledHowButton = styled.button`
    width: max-content;
    height: max-content;
    padding: 10px 10px;
    font-size: 2rem;
    font-family: 'LightFont';
    background: transparent;
    color: black;
    border: none;
    border-left: 1px solid black;
    grid-row: 3/3;
    grid-column: 1/1;
    margin-left: 160px;
    cursor: pointer;
`;

