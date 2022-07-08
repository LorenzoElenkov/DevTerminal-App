import React, { useRef } from "react";
import styled from "styled-components";
import { StyledModal } from "../KickMemberModal/KickMemberModal";
import { avatarIcons } from "../EditMyProfile/EditMyProfile";

const TransferOwnerModal: React.FC<IProps> = (props) => {

    const modalRef = useRef(null);

  const onClickOutside = (e: any) => {
    if (e.target === modalRef.current) {
      props.close();
    }
  };
  return (
    <StyledModal ref={modalRef} onClick={(e) => onClickOutside(e)}>
      <StyledTransferWindow avatarBackground={props.user.avatarBackground} avatarIconColor={props.user.avatarIconColor}>
        <h3>Are you sure?</h3>
        <span>
          Do you really want to transfer ownership to
          <div>
            <div className="avatarBackground">
              <img
                src={avatarIcons[props.user.avatarIcon]}
                alt=""
                className="avatarIcon"
              />
            </div>
            <span> {props.user.nickname}</span>
          </div>
          ?
        </span>
        <button onClick={() => props.close()}>Discard</button>
        <button onClick={() => props.transferHandler()}>Confirm</button>
      </StyledTransferWindow>
    </StyledModal>
  );
};
type IProps = {
    transferHandler(): void;
  close(): void;
  user: {
    _id: string;
    nickname: string;
    avatarIcon: number;
    avatarIconColor: string;
    avatarBackground: string;
  };
  projectName: string;
};

type IPropsAvatar = {
    avatarBackground: string;
    avatarIconColor: string;
  };

const StyledTransferWindow = styled.div<IPropsAvatar>`
  padding: 20px;
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
    div {
      display: flex;
      gap: 5px;
      position: relative;
      span {
        font-size: 1.5rem;
        margin-right: 5px;
      }

      .avatarBackground {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background-color: ${(props) => props.avatarBackground};
        margin-left: 5px;
        .avatarIcon {
          position: absolute;
          top: calc(50%);
          left: 3px;
          width: 20px;
          height: 20px;
          transform: translateY(-50%);
          filter: invert(
            ${(props) => (props.avatarIconColor === "#fff" ? 1 : 0)}
          );
        }
      }
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

export default TransferOwnerModal;
