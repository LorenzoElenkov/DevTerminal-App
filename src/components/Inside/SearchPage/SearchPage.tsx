import React from 'react';
import styled from 'styled-components';

import avatar from '../../images/avatar.png';
import searchIcon from '../../images/searchIcon.png';

const SearchPage = () => {
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
                <select>
                    <option value='Newest'>Newest</option>
                    <option value='Newest'>Oldest</option>
                </select>
            </StyledSearchField>
            <StyledSearchResultsContainer>
                    <StyledSearchResult></StyledSearchResult>
                    <StyledSearchResult></StyledSearchResult>
                    <StyledSearchResult></StyledSearchResult>
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
    padding: 50px 0;
    display: grid;
    grid-template-columns: 4% 1fr 3.5fr 1fr 4%;
    font-family: 'LightFont';
`;

const StyledProfileContainer = styled.div`
    grid-column: 2/3;
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    width: max-content;

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
    width: max-content;
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
    grid-template-columns: 80% 20%;
    row-gap: 10px;
    width: 70%;
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
    & > select {
        font-size: 1.6rem;
        font-family: 'LightFont';
        margin-left: 10px;
        border-radius: 15px;
        padding: 7.5px;
    }
`;

const StyledSearchResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const StyledSearchResult = styled.div`
    background: aliceblue;
    border-radius: 15px;
    width: 100%;
    height: 150px;
`;

//Add above styling for the results

const StyledFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
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

