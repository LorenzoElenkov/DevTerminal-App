import React, { useState } from 'react';
import styled from 'styled-components';

import pricingImg from '../images/pricing.png';

const Pricing = () => {

    const [monthPrice, setMonthPrice] = useState(true);


  return (
    <StyledContainer>
        <StyledTitle>
            Pricing
        </StyledTitle>
        <StyledSwitch className='switch'>
            <p>Monthly</p>
            <input type="checkbox"/>
            <span className='slider round' onClick={() => setMonthPrice(!monthPrice)}/>
            <p>Yearly {'(40% off)'}</p>
        </StyledSwitch>
        <StyledPricingBoxContainer>
            <StyledPricingBox>
                <h1>
                    Starter plan
                </h1>
                <h2>
                    Perfect for small teams up to 2 people
                </h2>
                <h3>
                    Free
                </h3>
                <h4>
                    forever
                </h4>
                <button>
                    Get started
                </button>
                <ul>
                    <li>
                        Max 1 project
                    </li>
                    <li>
                        Max 2 team members in a project
                    </li>
                    <li>
                        Email support
                    </li>
                </ul>
            </StyledPricingBox>
            <img src={pricingImg} alt=''/>
            <StyledPricingBox>
            <h1>
                    Pro plan
                </h1>
                <h2>
                    Perfect for big projects
                </h2>
                <h3>
                    {monthPrice ? '$5' : '$3'}
                    {!monthPrice && <span> (total of $36)</span>}
                </h3>
                <h4>
                    per month
                </h4>
                <button>
                    Try for 7 days
                </button>
                <ul>
                    <li>
                        Unlimited projects
                    </li>
                    <li>
                        Unlimited team members in a project
                    </li>
                    <li>
                        Real-time team chat
                    </li>
                    <li>
                        Kanban - project management tool included
                    </li>
                    <li>
                        Email {'&'} Chat support
                    </li>
                </ul>
            </StyledPricingBox>
            
        </StyledPricingBoxContainer>
    </StyledContainer>
  )
}

export default Pricing;

const StyledContainer = styled.section`
    margin-top: 300px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: max-content max-content 1fr 100px;
    grid-column: 1/6;
    grid-row: 3/3;
`;

const StyledTitle = styled.h1`
    font-size: 4rem;
    font-family: 'MainFont';
    color: #6564DB;
    justify-self: center;
    grid-column: 1/3;
    height: max-content;
`;

const StyledSwitch = styled.label`
    position: relative;
    display: inline-block;
    grid-column: 1/3;
    width: 60px;
    height: 20px;
    justify-self: center;
    margin-top: 30px;
    p {
        font-size: 1.4rem;
        font-family: 'LightFont';
        width: max-content;
    }

    p:nth-child(1) {
        position: absolute;
        top: calc(50% - 0.7rem);
        left: calc(-100%);
    }

    p:nth-child(4) {
        position: absolute;
        left: calc(100% + 1.2rem);
        top: calc(50% - 0.7rem);
    }

    input { 
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .5s;
        transition: .5s;
    }

    input:checked + .slider {
        background-color: #6564DB;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider::before {
        -webkit-transform: translateX(40px);
        -ms-transform: translateX(40px);
        transform: translateX(40px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 34px;
    }

    .slider.round::before {
        border-radius: 50%;
    }
`;

const StyledPricingBoxContainer = styled.div`
    grid-column: 1/3;
    grid-row: 3/3;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin-top: 60px;

    img {
        width: 400px;
        align-self: center;
    }
`;

const StyledPricingBox = styled.div`
    font-family: 'LightFont';
    padding: 20px 40px 70px 40px;
    border: 1px solid black;
    border-radius: 25px;

    &:nth-child(3) {
        background: #FECE2F;
        border: 1px solid #FECE2F;
    }
    h1 {
        font-size: 3rem;
    }

    h2 {
        font-size: 1.4rem;
        color: gray;
        margin-bottom: 20px;
    }
    h3 {
        font-size: 3.8rem;
    }
    &:last-child h3::first-letter {
        font-size: 2.5rem;
        vertical-align: top;
    }
    &:last-child h3 span {
        font-size: 1.6rem;
    }
    h4 {
        font-size: 1.2rem;
        margin-bottom: 20px;
    }

    
    button {
        font-size: 2rem;
        padding: 8px 15px;
        background: #6564DB;
        border: none;
        border-radius: 15px;
        color: white;
        cursor: pointer;
    }

    &:nth-child(1) button {
        background: none;
        border: 2px solid #6564DB;
        color: #6564DB;
    }


    ul {
        font-size: 2.2rem;
        list-style: none;
        font-weight: 100;
        margin-top: 30px;
    }

    ul li {
        margin-bottom: 10px;
    }

    ul li::before {
        content: '✓';
        margin: 0 1rem;
        color: #6564DB;
    }
`;