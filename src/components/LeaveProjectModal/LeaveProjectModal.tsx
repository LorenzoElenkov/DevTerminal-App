import React from "react";
import styled from "styled-components";
import { StyledModal } from "../KickMemberModal/KickMemberModal";

const LeaveProjectModal: React.FC<IProps> = (props) => {
  return (
    <StyledModal>
      <StyledTransferWindow>
        <h3>Are you sure?</h3>
        <span>
          Do you really want to leave&nbsp;<span>{props.projectName.toUpperCase()}</span>?
        </span>
        <button onClick={() => props.close()}>Discard</button>
        <button onClick={() => props.leaveHandler()}>Confirm</button>
      </StyledTransferWindow>
    </StyledModal>
  );
};

type IProps = {
    leaveHandler(): void;
  close(): void;
  projectName: string;
};


const StyledTransferWindow = styled.div`
  padding: 20px 50px;
  width: max-content;
  height: max-content;
  background-color: aliceblue;
  border-radius: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 20px;

  h3 {
    grid-column: 1/3;
    font-size: 2.2rem;
    justify-self: center;
  }

  span {
    grid-column: 1/3;
    font-size: 1.5rem;
    justify-self: center;
    display: flex;
    align-items: center;
    span {
        font-weight: 900;
    }
  }

  button {
    border: none;
    border-radius: 7.5px;
    padding: 8px 25px;
    font-size: 1.4rem;
    font-family: "LightFont";
    width: max-content;
    justify-self: end;
    margin-top: 10px;
  }

  button:nth-child(4) {
    background-color: #6564db;
    color: white;
    justify-self: start;
  }
`;

export default LeaveProjectModal;
