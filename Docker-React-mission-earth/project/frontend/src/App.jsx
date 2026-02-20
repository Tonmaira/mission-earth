import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import "./style/audit.css";
import "./style/right.css";
import "./style/hoc.css";
import "./style/Theme.css";

import Layout from "./components/layout/Layout";
import Header from "./components/layout/header";
import Home from "./views/pages/home";
import HocDoc from "./views/pages/hocdoc";
import Missing from "./views/Missing";
import Unauthorized from "./views/Unauthorize";
import Login from "./views/Login";
import Logout from "./views/Logout";
import RequireAuth from "./components/RequireAuth";
import AdminMenu from "./views/pages/admin";
import UserIPDAudit from "./views/pages/admin/UserAudit";
import DeptAudit from "./views/pages/admin/DeptAudit";
import { useWebSocket } from "./context/WebSocketContext";
// import PrintRight from "./views/pages/printright";
import ReportComponents from "./components/ReportComponent";
import PackageManager from "./components/PackageManager";
import FormulaSelector from "./components/FormulaSelector";

const ROLES = {
  User: 1,
  Editor: 2,
  Admin: 3,
};

function App() {
  const location = useLocation();
  const { disconnectWebSocket } = useWebSocket();
  
  useEffect(() => {
    disconnectWebSocket(); // Call disconnectWebSocket when the location changes
  }, [location.pathname]);

  return (
    <>
      {!["", "/login", "/logout"].includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Layout />}>

          <Route path="login" element={<Login />} />


          <Route path="logout" element={<Logout />} />
          <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin,ROLES.User]} />}>
            <Route path="dashboard" element={<Home />} />
            {/* <Route path="selector/:id" element={<FormulaSelector Mode="new"/>} /> */}
            <Route path="hoc/:id" element={<HocDoc Mode="new"/>} />
            <Route path="hoc/edit/:id" element={<HocDoc Mode="edit"/>} />
            <Route path="hoc/show/:id" element={<HocDoc Mode="show"/>} />
            <Route path="hoc/print/:id" element={<HocDoc Mode="print"/>} />
            <Route path="hoc/proceed/:id" element={<HocDoc Mode="proceed"/>} />
            {/* <Route path="right/new" element={<Right Mode="new"/>} />
            <Route path="right/approve/:rightid" element={<Right Mode="approve"/>} />
            <Route path="right/show/:rightid" element={<PrintRight Mode="show"/>} />
            <Route path="right/print/:rightid" element={<PrintRight Mode="print"/>} />
            <Route path="right/edit/:rightid" element={<Right Mode="edit"/>} /> */}
            <Route path="report" element={<ReportComponents/>} />
            <Route path="package" element={<PackageManager Mode="new"/>} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
            <Route path="admin" element={<AdminMenu />} />
            <Route path="admin/user" element={<UserIPDAudit/>} />
            <Route path="admin/dept" element={<DeptAudit />} />
          </Route>
        
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </>
  )
}

export default App