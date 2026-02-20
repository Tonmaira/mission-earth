import React from "react";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

function AdminMenuList({ title }) {
  const navigate = useNavigate();
  return (
    <div className="TableList">
      <div className="SearchBox_Header">{title || "Title"}</div>
      <div className="TableList_Body">
      <ul>
          <li onClick={() => navigate(`dept`)}>dept list</li>
          <li onClick={() => navigate(`user`)}>user</li>
          {/* <li onClick={() => navigate(`pct`)}>pct list</li> */}
        </ul>
        {/* <ul>
          <li onClick={() => navigate(`topic`)}>topic</li>
          <li onClick={() => navigate(`subtopic`)}>sub topic</li>
          <li onClick={() => navigate(`question`)}>sub topic list</li>
        </ul> */}
      </div>
    </div>
  );
}

export default AdminMenuList;
