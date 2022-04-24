import React from 'react';
import styled from 'styled-components';
import image from '../images/features2.png';
import feature1 from '../images/feature1.png';
import feature2 from '../images/feature2.png';
import feature3 from '../images/feature4.png';
import feature4 from '../images/feature3.png';
import lastfeature from '../images/lastfeature.png';

const Features = () => {
  return (
    <StyledContainer>
        <svg className='waves' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path className='wavesPath' fill="#6564DB" fillOpacity="1" d="M0,160L80,154.7C160,149,320,139,480,149.3C640,160,800,192,960,186.7C1120,181,1280,139,1360,117.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
        <StyledTitle>Features</StyledTitle>
        <StyledImage src={image}/>
        <StyledFeaturesContainer>
            <StyledBlock>
                <img src={feature1} alt=''/>
                <h2>
                    Create your project
                </h2>
                <h3>
                    Outline all the details about the project and the roles you are looking for
                </h3>
            </StyledBlock>
            <StyledBlock>
                <img src={feature2} alt=''/>
                <h2>
                    Browse projects
                </h2>
                <h3>
                    Perhaps, you are looking for a project to join. We got you! Find a project to contribute to!
                </h3>
            </StyledBlock>
            <StyledBlock>
                <img src={feature3} alt=''/>
                <h2>
                    Interview other devs
                </h2>
                <h3>
                    Whether you are a project creator or a dev looking for project, you will get through an interview process in order to ensure an exact fit for the role is selected
                </h3>
            </StyledBlock>
            <StyledBlock>
                <img src={feature4} alt=''/>
                <h2>
                    Come to an agreement
                </h2>
                <h3>
                    Then start getting your hands dirty on this amazing project!
                </h3>
            </StyledBlock>
        </StyledFeaturesContainer>
        <StyledBottomFeature>
            <span/>
            <p>Many more features are on the list such as real-time chat, kanban dashboard, etc...</p>
            <img src={lastfeature} alt=''/>
        </StyledBottomFeature>
    </StyledContainer>
  )
}

export default Features;

const StyledContainer = styled.section`
    display: grid;
    grid-template-columns: repeat(3, minmax(200px, 1fr));
    grid-template-rows: max-content 1fr 0.5fr;
    background: #6564DB;
    position: relative;
    .waves {
        position: absolute;
        top: -57%;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
`;

const StyledTitle = styled.h1`
    grid-column: 1/4;
    grid-row: 1/1;
    justify-self: center;
    font-size: 4rem;
    font-family: 'MainFont';
    color: white;
`;

const StyledImage = styled.img`
    grid-column: 1/4;
    grid-row: 2/2;
    justify-self: end;
    align-self: center;
    margin-right: 50px;
    width: 30%;
    position: absolute;
`;

const StyledFeaturesContainer = styled.div`
    grid-column: 1/4;
    grid-row: 2/2;
    display: grid;
    grid-template-columns: 10px 25% 25% 10px;
    grid-template-rows: repeat(3, max-content);
    width: 100%;
    margin-top: 200px;
    margin-bottom: 100px;
    align-content: end;
    justify-content: start;
    row-gap: 15%;
    column-gap: 6%;
`;

const StyledBlock = styled.div`
    border-radius: 25px;
    padding: 10px;
    position: relative;

    display: grid;
    grid-template-rows: repeat(3, max-content);
    row-gap: 20px;
    &:nth-child(1) {
        grid-column: 2/2;
        grid-row: 1/1;
    }
    &:nth-child(2) {
        grid-column: 3/3;
        grid-row: 1/1;
    }
    &:nth-child(3) {
        margin-top: 40px;
        grid-column: 2/2;
        grid-row: 2/2;
    }
    &:nth-child(4) {
        margin-top: 40px;
        grid-column: 3/3;
        grid-row: 2/2;
    }

    img {
        position: absolute;
        top: -60%;
        left: calc(50% - 62.5px);
        width: 125px;
    }

    &:nth-child(1) img {
        width: 110px;
        left: calc(50% - 55px);
    }
    &:nth-child(2) img {
        width: 100px;
        left: calc(50% - 50px);
    }
    &:nth-child(3) img {
        width: 130px;
        left: calc(50% - 65px);
        top: -60%;
    }
    &:nth-child(4) img {
        width: 120px;
        left: calc(50% - 60px);
        top: -60%;
    }


    h1 {
        font-size: 3rem;
        font-family: 'LightFont';
        color: #6564DB;
        background: #29FFBF;
        border-radius: 50%;
        position: absolute; 
        left: calc(50% - 1.5rem - 15px);
        top: calc(-1.5rem - 30px);
        padding: 15px;
    }

    h2 {
        background: #29FFBF;
        color: #6564DB;
        width: max-content;
        padding: 5px 30px;
        justify-self: center;
        border-radius: 15px;
        font-size: 2rem;
        font-family: 'LightFont';
        text-align: center;
    }

    h3 {
        font-family: 'LightFont';
        color: #29FFBF;
        font-size: 1.6rem;
    }

`;

const StyledBottomFeature = styled.div`
    grid-column: 1/4;
    grid-row: 3/3;
    width: 100%;
    display: grid;
    grid-template-rows: 0.3fr 1fr;
    position: relative;
    span {
        justify-self: center;
        width: 25%;
        background: #29FFBF;
        height: 5px;
    }
    p {
        font-size: 2.4rem;
        font-family: 'LightFont';
        justify-self: center;
        color: #6564DB;
        background: #29FFBF;
        height: max-content;
        padding: 10px 20px;
        border-radius: 15px;
        grid-row: 2/2;
    }
    img {
        width: 400px;
        grid-row: 2/2;
        position: absolute;
        justify-self: center;
        margin-top: 120px;
    }
    
`;