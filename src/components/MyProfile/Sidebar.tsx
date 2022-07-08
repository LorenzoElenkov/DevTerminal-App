import React, { useContext, useEffect, useState } from "react";

import { avatarIcons } from "../EditMyProfile/EditMyProfile";
import { StyledProfileContainer } from "./MyProfile";
import { StyledProfileCard } from "./MyProfile";
import Toolbar from "./Toolbar";

import { globalContext, socket } from "../../context/auth-context";

const Sidebar: React.FC<IProps> = ({subMenu, submenuHeader}) => {
  const [submenu, setSubmenu] = useState("");

  useEffect(() => {
    setSubmenu(submenuHeader);
  }, [submenuHeader])

  const context = useContext(globalContext);
  return (
    <>
      <StyledProfileContainer>
        <StyledProfileCard
          avatarIcon={context.avatarIcon}
          avatarBackground={context.avatarBackground}
          avatarIconColor={context.avatarIconColor}
        >
          <div className="avatarBackground" />
          <img
            className="avatarIcon"
            alt=""
            src={avatarIcons[context.avatarIcon]}
          />
          <span className="avatarName">
            {!context.nickname || context.nickname === '' ? "Set your nickname" : context.nickname}
          </span>
          <span className="avatarRole">
            {!context.role ? "Set your role" : context.role}
          </span>
        </StyledProfileCard>
        <Toolbar submenu={submenu} changeMenu={(e) => {subMenu(e); setSubmenu(e)}}/>
      </StyledProfileContainer>
    </>
  );
};

export default Sidebar;

interface IProps {
    subMenu(menu: string): void;
    submenuHeader: string;
}
