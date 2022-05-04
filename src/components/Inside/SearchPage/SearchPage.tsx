import React, { useEffect } from 'react';
import styled from 'styled-components';

import avatar from '../../images/avatar.png';
import searchIcon from '../../images/searchIcon.png';
import applicantsIcon from '../../images/applicants.png';
import authorAvatar from '../../images/authorAvatar.png';

import Select from 'react-select';

const options = [
    {value: 'newest', label: 'Newest'},
    {value: 'oldest', label: 'Oldest'}
];

const customStyles = {
    menu: (provided: any, state: any) => ({
        ...provided,
        // width: state.width,
        left: '10px',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        fontSize: '1.2rem',
        padding: '5px 0px 5px 5px',
    }),
    control: (provided: any, state: any) => ({
        ...provided,
        borderRadius: '15px',
        marginLeft: '10px',
        fontSize: '3rem',
        border: '1px solid gray',
    }),
};



const SearchPage = () => {
    const isOverflow = (element: Element) => {
        return element.scrollHeight > element.clientHeight;
    };
    

    useEffect(() => {
        const container = document.querySelectorAll(".timezoneContainer");
        console.log(123);
        container.forEach((parent) => {
            if(isOverflow(parent)) {
                parent.lastElementChild?.classList.add("btn-show");
                parent.lastElementChild?.addEventListener('click', (e: any) => {
                    e.target.parentElement.classList.add("showAll");
                    parent.lastElementChild?.classList.remove("btn-show");
                });
            }
        });
    },[]);


  return (
    <StyledContainer>
       <StyledProfileContainer>
           <StyledProfileCard>
                <img src={avatar} alt='avatar'/>
                <span className='avatarName'>
                    User Profile
                </span>
                <span className='avatarRole'>
                    Junior Software Developer
                </span>
                <button>
                    Edit
                </button>
           </StyledProfileCard>
           <StyledProfileExperience>
               <h3>
                   Skills
               </h3>
               <span>
                   <span className='skillNumber'>&#9679;</span>
                   <span className='skillTitle'>ReactJS</span>
                   <span className='skillLevel'>Expert</span>
               </span>
               <span>
                   <span className='skillNumber'>&#9679;</span>
                   <span className='skillTitle'>Styled components</span>
                   <span className='skillLevel'>Intermediate</span>
               </span>
               <span>
                   <span className='skillNumber'>&#9679;</span>
                   <span className='skillTitle'>Redux</span>
                   <span className='skillLevel'>Beginner</span>
               </span>
           </StyledProfileExperience>
       </StyledProfileContainer>
       <StyledSearchContainer>
            <StyledSearchField>
                <h3>
                    Search Roles
                </h3>
                <label htmlFor='search'/>
                <input type='search' id='search' placeholder='Front end dev, Back end dev, UI/UX Designer...'/>
                <Select options={options} styles={customStyles} defaultValue={options[0]} onChange={(e) => console.log(e?.label)}/>
            </StyledSearchField>
            <StyledSearchResultsContainer>
                    <StyledSearchResult>
                    <h3 className='role'>Junior UI/UX Designer</h3>
                        <h5 className='expLevel'>Entry &#9679; Intermediate</h5>
                        <span className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, soluta.</span>
                        <div className='timezoneContainer'>
                            <span className='timezoneBox yourZone'>Your timezone</span>
                            <span className='timezoneBox'>+1h zone</span>
                            <span className='timezoneBox'>-1h zone</span>
                            <span className='timezoneBox'>+2h zone</span>
                            <span className='timezoneBox'>-2h zone</span>
                            <span className='timezoneBox'>+3h zone</span>
                            <span className='timezoneBox'>-3h zone</span>
                            <button className='btn-expand'>More...</button>

                        </div>
                        <span className='divider'></span>
                        <div className='author'>
                            <img src={authorAvatar} alt=''/>
                            <span className='authorName'>Post Author</span>
                        </div>
                        <div className='applicants'>
                            <img src={applicantsIcon} alt=''/>
                            <span className='applicantsNumber'>0 <span>applicants</span></span>
                        </div>
                        <button className='applyButton'>View now</button>
                    </StyledSearchResult>
                    <StyledSearchResult>
                    <h3 className='role'>Junior UI/UX Designer</h3>
                        <h5 className='expLevel'>Entry &#9679; Intermediate</h5>
                        <span className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, soluta.</span>
                        <div className='timezoneContainer'>
                            <span className='timezoneBox yourZone'>Your timezone</span>
                            <span className='timezoneBox'>+1h zone</span>
                            <span className='timezoneBox'>-1h zone</span>
                            <span className='timezoneBox'>+2h zone</span>
                            <span className='timezoneBox'>-2h zone</span>
                            <span className='timezoneBox'>+3h zone</span>
                            <span className='timezoneBox'>-3h zone</span>
                            <button className='btn-expand'>More...</button>
                        </div>
                        <span className='divider'></span>
                        <div className='author'>
                            <img src={authorAvatar} alt=''/>
                            <span className='authorName'>Post Author</span>
                        </div>
                        <div className='applicants'>
                            <img src={applicantsIcon} alt=''/>
                            <span className='applicantsNumber'>0 <span>applicants</span></span>
                        </div>
                        <button className='applyButton'>View now</button>
                    </StyledSearchResult>
                    <StyledSearchResult>
                    <h3 className='role'>Junior UI/UX Designer</h3>
                        <h5 className='expLevel'>Entry &#9679; Intermediate</h5>
                        <span className='description'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut impedit magnam placeat, pariatur soluta repudiens magni eaque accusantium saepe quam porro, aliquam, vero beatae qui ipsum odio vitae? Repellendus consequuntur, molestiae sequi mollitia labore in quae! Numquam ipsa possimus est odio vel necessitatibus dolore facilis optio, inventore veritatis, molestiae rem!</span>
                        <div className='timezoneContainer'>
                            <span className='timezoneBox yourZone'>Your timezone</span>
                            <span className='timezoneBox'>+1h zone</span>
                            <span className='timezoneBox'>-1h zone</span>
                            <span className='timezoneBox'>+2h zone</span>
                            <span className='timezoneBox'>-2h zone</span>
                            <button className='btn-expand'>More...</button>
                        </div>
                        <span className='divider'></span>
                        <div className='author'>
                            <img src={authorAvatar} alt=''/>
                            <span className='authorName'>Post Author</span>
                        </div>
                        <div className='applicants'>
                            <img src={applicantsIcon} alt=''/>
                            <span className='applicantsNumber'>0 <span>applicants</span></span>
                        </div>
                        <button className='applyButton'>View now</button>
                    </StyledSearchResult>
                    <StyledSearchResult>
                    <h3 className='role'>Junior UI/UX Designer</h3>
                        <h5 className='expLevel'>Entry &#9679; Intermediate</h5>
                        <span className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, soluta.</span>
                        <div className='timezoneContainer'>
                            <span className='timezoneBox yourZone'>Your timezone</span>
                            <span className='timezoneBox'>+1h zone</span>
                            <span className='timezoneBox'>-1h zone</span>
                            <span className='timezoneBox'>+2h zone</span>
                            <span className='timezoneBox'>-2h zone</span>
                            <span className='timezoneBox'>+3h zone</span>
                            <span className='timezoneBox'>-3h zone</span>
                            <button className='btn-expand'>More...</button>
                        </div>
                        <span className='divider'></span>
                        <div className='author'>
                            <img src={authorAvatar} alt=''/>
                            <span className='authorName'>Post Author</span>
                        </div>
                        <div className='applicants'>
                            <img src={applicantsIcon} alt=''/>
                            <span className='applicantsNumber'>0 <span>applicants</span></span>
                        </div>
                        <button className='applyButton'>View now</button>
                    </StyledSearchResult>
                    <StyledSearchResult>
                    <h3 className='role'>Junior UI/UX Designer</h3>
                        <h5 className='expLevel'>Entry &#9679; Intermediate</h5>
                        <span className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, soluta.</span>
                        <div className='timezoneContainer'>
                            <span className='timezoneBox yourZone'>Your timezone</span>
                            <span className='timezoneBox'>+1h zone</span>
                            <span className='timezoneBox'>-1h zone</span>
                            <span className='timezoneBox'>+2h zone</span>
                            <span className='timezoneBox'>-2h zone</span>
                            <span className='timezoneBox'>+3h zone</span>
                            <span className='timezoneBox'>-3h zone</span>
                            <button className='btn-expand'>More...</button>
                        </div>
                        <span className='divider'></span>
                        <div className='author'>
                            <img src={authorAvatar} alt=''/>
                            <span className='authorName'>Post Author</span>
                        </div>
                        <div className='applicants'>
                            <img src={applicantsIcon} alt=''/>
                            <span className='applicantsNumber'>0 <span>applicants</span></span>
                        </div>
                        <button className='applyButton'>View now</button>
                    </StyledSearchResult>
                    <StyledSearchResult>
                    <h3 className='role'>Junior UI/UX Designer</h3>
                        <h5 className='expLevel'>Entry &#9679; Intermediate</h5>
                        <span className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, soluta.</span>
                        <div className='timezoneContainer'>
                            <span className='timezoneBox yourZone'>Your timezone</span>
                            <span className='timezoneBox'>+1h zone</span>
                            <span className='timezoneBox'>-1h zone</span>
                            <span className='timezoneBox'>+2h zone</span>
                            <span className='timezoneBox'>-2h zone</span>
                            <span className='timezoneBox'>+3h zone</span>
                            <span className='timezoneBox'>-3h zone</span>
                            <button className='btn-expand'>More...</button>
                        </div>
                        <span className='divider'></span>
                        <div className='author'>
                            <img src={authorAvatar} alt=''/>
                            <span className='authorName'>Post Author</span>
                        </div>
                        <div className='applicants'>
                            <img src={applicantsIcon} alt=''/>
                            <span className='applicantsNumber'>0 <span>applicants</span></span>
                        </div>
                        <button className='applyButton'>View now</button>
                    </StyledSearchResult>
            </StyledSearchResultsContainer>
       </StyledSearchContainer>
       <StyledFilterContainer>
            <StyledFilterJob>
                <h3>Filters (n)</h3>
                <button>Clear all</button>
            </StyledFilterJob>
            <StyledFilterLevel>
                <div>
                    <h3>Experience Level</h3>
                    <button>Clear</button>
                </div>
                <div>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>Entry </span> 
                            <span>(201)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>Intermediate </span>
                            <span>(125)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>Expert </span>
                            <span>(57)</span>
                            </span>
                    </label>
                </div>
            </StyledFilterLevel>
            <StyledFilterLevel>
                <div>
                    <h3>Tech Stack</h3>
                    <button>Clear</button>
                </div>
                <div>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>ReactJS</span> 
                            <span>(201)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>React Native</span>
                            <span>(125)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>Angular</span>
                            <span>(57)</span>
                            </span>
                    </label>
                </div>
            </StyledFilterLevel>
            <StyledFilterTimezone>
                <div>
                    <h3>Timezone difference</h3>
                    <button>Clear</button>
                </div>
                <div>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>My timezone</span> 
                            <span>(15)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>+/- 1 hour </span> 
                            <span>(33)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>+/- 2 hours </span>
                            <span>(313)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>+/- 3 hours </span>
                            <span>(71)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>More than 3 hours </span>
                            <span>(37)</span>
                        </span>
                    </label>
                </div>
            </StyledFilterTimezone>
            <StyledFilterApplicants>
            <div>
                    <h3>Applicants</h3>
                    <button>Clear</button>
                </div>
                <div>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>Less than 5 </span> 
                            <span>(33)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>5 to 10 </span>
                            <span>(313)</span>
                        </span>
                    </label>
                    <label>
                        <input type='checkbox' />
                        <span>
                            <span>More than 10 </span>
                            <span>(37)</span>
                            </span>
                    </label>
                </div>
            </StyledFilterApplicants>
       </StyledFilterContainer>
    </StyledContainer>
  )
}

export default SearchPage;

const StyledContainer = styled.div`
    height: max-content;
    padding: 100px 0 50px 0;
    display: grid;
    grid-template-columns: 4% 1fr 3.5fr 1fr 4%;
    font-family: 'LightFont';
`;

const StyledProfileContainer = styled.div`
    grid-column: 2/3;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 250px;
`;

const StyledProfileCard = styled.div`
    box-shadow: -7px 0px 1px -2px #6564DB;
    display: flex;
    flex-direction: column;
    background: aliceblue;
    padding: 20px 40px;
    align-items: center;
    border-radius: 15px;
    gap: 5px;

    img {
        width: 70px;
        aspect-ratio: 1/1;
    }
    span {
        font-size: 1rem;
    }
    .avatarName {
        margin-top: 10px;
        font-size: 2rem;
        font-family: 'MainFont';
        text-align: center;
    }
    .avatarRole {
        font-size: 1.4rem;
        color: gray;
        text-align: center;
    }
    button {
        margin-top: 20px;
        font-size: 1.4rem;
        font-family: 'LightFont';
        padding: 5px 10px;
        width: 30%;
        background: #6564DB;
        color: white;
        border-radius: 15px;
        border: none;
    }
    button:hover {
        cursor: pointer;
    }
`;

const StyledProfileExperience = styled.div`
    box-shadow: -7px 0px 1px -2px #29FFBF;
    border-radius: 15px;
    padding: 20px 100px 20px 20px;
    background: aliceblue;
    display: grid;
    gap: 20px;
    h3 {
        font-size: 1.4rem;
        font-family: 'MainFont';
        letter-spacing: 0.5px;
    }
    & > span {
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 5fr;
        justify-content: center;
        align-items: center;
        gap: 2px;
    }
    & > span > span {
        font-size: 1.2rem;
    }
    & > span > .skillNumber {
        grid-column: 1/1;
        font-size: 1.2rem;
        justify-self: center;
    }
    & > span > .skillTitle {
        font-family: 'RegularFont';
    }
    & > span > .skillLevel {
        color: gray;
        grid-column: 2/2;
    }
`;

const StyledSearchContainer = styled.div`
    height: max-content;
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 40px;
`;

const StyledSearchField = styled.div`
    background: aliceblue;
    border-radius: 15px;
    padding: 20px;
    display: grid;
    grid-template-columns: 75% 25%;
    row-gap: 10px;
    max-width: 600px;
    & > h3 {
        font-size: 1.6rem;
        font-family: 'MainFont';
        letter-spacing: 0.5px;
        grid-column: 1/3;
    }
    & > label {
        position: relative;
        grid-column: 1/2;
    }
    & > label:before {
        content: '';
        position: absolute;
        background: url(${searchIcon});
        background-repeat: no-repeat;
        background-size: 75%;
        width: 25px;
        height: calc(1.6rem + 10px);
        top: 20px;
        left: 10px;
    }
    & > input {
        grid-column: 1/2;
        font-size: 1.6rem;
        padding: 7.5px 0px 7.5px 35px;
        border-radius: 15px;
        border: 1px solid gray;
        font-family: 'LightFont';
    }
    & > .selectSearch {
        font-size: 5rem;
        font-family: 'LightFont';
        margin-left: 10px;
    }
`;

const StyledSearchResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media screen and (min-width: 1500px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 20px;
        column-gap: 10px;
    }
`;

const StyledSearchResult = styled.div`
    background: aliceblue;
    border-radius: 15px;
    width: 100%;
    height: max-content;
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    row-gap: 5px;
    h3 {
        font-size: 2rem;
        font-family: 'RegularFont';
        grid-column: 1/4;
        letter-spacing: 0.5px;
    }
    h5 {
        font-size: 1.2rem;
        color: gray;
        letter-spacing: 1px;
        grid-column: 1/4;
    }
    .description {
        margin-top: 15px;
        font-size: 1.6rem;
        letter-spacing: 0.3px;
        color: gray;
        grid-column: 1/4;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        @supports (-webkit-line-clamp: 2) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: initial;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
    .timezoneContainer {
        grid-column: 1/4;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        overflow: hidden;
        max-height: 3.5rem;
        position: relative;
        margin-top: 15px;

        &.showAll {
            max-height: none;
        }

        .btn-expand {
            display: none;
            z-index: 1;
            position: absolute;
            right: 0px;
            top: 0px;
            padding: 7.5px 10px;
            background-color: #6564db;
            border: none;
            border-radius: 15px;
            color: white;
            font-size: 1.4rem;
            font-family: 'LightFont';
        }

        .btn-show {
            display: block;
        }

        .timezoneBox {
            font-size: 1.4rem;
            padding: 7.5px 20px;
            background: #ccd3da;
            border-radius: 15px;
        }
        .yourZone {
            background: #6564db;
            color: white;
        }
    }
    .divider {
        margin-top: 15px;
        grid-column: 1/4;
        width: 100%;
        border-bottom: 1px solid lightgray;
    }
    .author {
        margin-top: 15px;
        margin-right: 10px;
        display: flex;
        flex-wrap: nowrap;
        gap: 5px;
        align-items: center;
        img {
            width: 40px;
        }
        .authorName {
            font-size: 1.4rem;
            font-family: 'RegularFont';
        }
    }
    .applicants {
        margin-top: 15px;
        display: flex;
        flex-wrap: nowrap;
        gap: 10px;
        align-items: center;
        img {
            width: 40px;
        }
        .applicantsNumber {
            font-size: 2rem;
            font-family: 'RegularFont';

            span {
                color: gray;
            }
        }
    }
    .applyButton {
        margin-top: 15px;
        margin-left: 10px;
        border: none;
        border-radius: 15px;
        background: tomato;
        height: max-content;
        width: max-content;
        justify-self: end;
        padding: 10px 30px;
        color: white;
        font-size: 1.6rem;
        font-family: 'LightFont';
    }
`;


const StyledFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 250px;
`;

const StyledFilterJob = styled.div`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    background: aliceblue;
    border-radius: 15px;
    h3 {
        font-size: 2rem;
        font-family: 'RegularFont';
        letter-spacing: 0.5px;
    }
    button {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #6564DB;
        letter-spacing: 0.5px;
        padding: 5px 0px 5px 5px;
        font-family: 'LightFont';
    }
    button:hover {
        cursor: pointer;
    }
`;

const StyledFilterLevel = styled.div`
    padding: 20px;
    background: aliceblue;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    & > div:nth-child(1) {
        display: flex;
        justify-content: space-between;
        gap: 3px;
        h3 {
            font-size: 1.4rem;
            font-family: 'RegularFont';
            letter-spacing: 0.5px;
        }
        button {
            background: none;
            border: none;
            color: #6564DB;
            font-family: 'LightFont';
            font-size: 1.2rem;
        }
        button:hover {
            cursor: pointer;
        }
    }

    & > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        gap: 7.5px;
    }

    & > div:nth-child(2) > label {
        display: flex;
        align-items: center;

        & > span {
            font-size: 1.2rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        & > span > span {
            font-size: 1.4rem;
        }
        & > span > span:nth-child(2) {
            color: gray;
            font-size: 1.2rem;
        }
        input {
            margin-right: 5px;
        }
    }
`;

const StyledFilterApplicants = styled.div`
    padding: 20px;
    background: aliceblue;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    & > div:nth-child(1) {
        display: flex;
        justify-content: space-between;
        gap: 3px;

        h3 {
            font-size: 1.4rem;
            font-family: 'RegularFont';
            letter-spacing: 0.5px;
        }
        button {
            background: none;
            border: none;
            color: #6564DB;
            font-family: 'LightFont';
            font-size: 1.2rem;
        }
        button:hover {
            cursor: pointer;
        }
    }

    & > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        gap: 7.5px;
    }

    & > div:nth-child(2) > label {
        display: flex;
        align-items: center;

        & > span {
            font-size: 1.2rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        & > span > span {
            font-size: 1.4rem;
        }
        & > span > span:nth-child(2) {
            color: gray;
            font-size: 1.2rem;
        }
        input {
            margin-right: 5px;
        }
    }
`;

const StyledFilterTimezone = styled.div`
    padding: 20px;
    background: aliceblue;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    & > div:nth-child(1) {
        display: flex;
        justify-content: space-between;
        gap: 3px;

        h3 {
            font-size: 1.4rem;
            font-family: 'RegularFont';
            letter-spacing: 0.5px;
        }
        button {
            background: none;
            border: none;
            color: #6564DB;
            font-family: 'LightFont';
            font-size: 1.2rem;
        }
        button:hover {
            cursor: pointer;
        }
    }

    & > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        gap: 7.5px;
    }

    & > div:nth-child(2) > label {
        display: flex;
        align-items: center;

        & > span {
            font-size: 1.2rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        & > span > span {
            font-size: 1.4rem;
        }
        & > span > span:nth-child(2) {
            color: gray;
            font-size: 1.2rem;
        }
        input {
            margin-right: 5px;
        }
    }
`;

