import React, { useContext, useRef, useState } from "react";
import { globalContext, socket } from "../../context/auth-context";

const UpdatePassword: React.FC<IProps> = ({ setUpdate, setError }) => {
  const context = useContext(globalContext);

  const [oldPass, setOldPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');
  const [newPass2, setNewPass2] = useState<string>('');

  const requestBody = {
    query: `
                mutation {
                    changePassword(id: "${context.userId}", oldPassword: "${oldPass}", newPassword: "${newPass}") {
                        _id
                    }
                }
            `,
  };

  const changePassword = () => {
    if (newPass !== newPass2) {
      setError("New passwords not matching!");
      return;
    }
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.errors) {
          setUpdate(true);
          setNewPass('');
          setNewPass2('');
          setOldPass('');
        } else {
          setError(data.errors[0].message);
        }
      });
  };

  return (
    <>
      <input
        type="password"
        className="oldPasswordInput"
        placeholder="Current password..."
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
      />
      <input
        type="password"
        className="newPasswordInput1"
        placeholder="New password..."
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />
      <input
        type="password"
        className="newPasswordInput2"
        placeholder="Repeat new password..."
        value={newPass2}
        onChange={(e) => setNewPass2(e.target.value)}
      />
      <button
        type="button"
        className="updatePassButton"
        onClick={changePassword}
      >
        Update password
      </button>
    </>
  );
};

export default UpdatePassword;

interface IProps {
  setUpdate(state: boolean): void;
  setError(error: string): void;
}
