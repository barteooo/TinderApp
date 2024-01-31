import { useContext, useEffect, useState } from "react";
import UsersApi from "../../api/UsersApi";
import UserPanel from "../../components/User/UserPanel";
import SwipeContainer from "../../components/User/SwipeContainer";

const UserMainPage = () => {
  return (
    <div>
      <UserPanel />
      <SwipeContainer />
    </div>
  );
};

export default UserMainPage;
