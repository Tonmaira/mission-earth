import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import useAuth from "../hooks/useAuth";
import { LoginBox,LoginBoxOcc } from "../style/Login.style";
import { chkAdmins } from "../components/Function";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
        background-color:rgb(56, 56, 56);
        ${'' /* background: #c74d28; 
        background: linear-gradient(147deg, rgba(199, 77, 40, 1) 0%, rgba(199, 169, 87, 1) 50%, rgba(255, 238, 230, 1) 100%);
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover; */}
    }
    #root {
        margin: 0 auto;
    }
    body {
        display: block;
    }
`;

const Login = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const userRef = useRef();
  const passRef = useRef();

  const [userid, setUserid] = useState("");
  const [pass, setPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const isAdmin = chkAdmins(userData?.roles);

  const handleApiError = (err) => {
    if (!err?.response) {
      setErrMsg("ไม่มีการตอบกลับของเซิร์ฟเวอร์");
    } else {
      switch (err.response.status) {
        case 400:
          setErrMsg("โปรดตรวจสอบ รหัสพนักงาน, รหัสผ่าน");
          break;
        default:
          setErrMsg("ไม่สามารถเข้าสู่ระบบได้");
          break;
      }
    }
    setError(true);
    passRef.current.focus();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrMsg("");
    setError(false);
  };

  const handleAuthSuccess = (response) => {
    const { accessToken, Role } = response?.data || {};
    localStorage.setItem("auth", JSON.stringify({ UserId:userid, Role, accessToken }));
    setAuth({ UserId:userid, Role, accessToken });
  };

  const handleUserData = async () => {
    try {
      const storedAuth = JSON.parse(localStorage.getItem("auth"));
      const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
      const url = `${apiUrl}/staffs/${userid}`;
      const response2 = await axios.get(url, { ...config });
      if (response2.status === 200 || response2.status === 201) {
        const userData = response2.data;
        localStorage.setItem("userData", JSON.stringify(userData));
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth`, { UserId:userid, Password:pass }, { headers: { "Content-Type": "application/json" } });

      handleAuthSuccess(response);
      await handleUserData();

      setUserid("");
      setPass("");

      const userDataChk = JSON.parse(localStorage.getItem("userData"));
      const isAdmins = chkAdmins(userDataChk?.Role);
      if (isAdmins) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storedAuth?.userid && userData) {
      if (isAdmin) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [storedAuth, navigate]);
  useEffect(() => {
    setErrMsg("");
  }, [userid, pass]);

  return (
    <>
    <LoginBoxOcc>
        <GlobalStyle />
        <form className="login" onSubmit={handleSubmit} autoComplete="off">
          <h1>ระบบประเมินค่าใช้จ่ายด้านการรักษาพยาบาล(HOC)</h1>
          <input
            ref={userRef}
            type="text"
            name="userid"
            id="userid"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            placeholder="รหัสพนักงาน"
            required
          />
          <input
            ref={passRef}
            type="password"
            name="password"
            id="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="รหัสผ่าน"
            required
          />
          <button disabled={loading}>เข้าสู่ระบบ</button>
        </form>
      </LoginBoxOcc>

      {/* <LoginBox className="overlay">
        <GlobalStyle />
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="con">
            <div className="head-form">
              <h2>HOC</h2>
            </div>
            <div className="field-set">
              <input
                ref={userRef}
                type="text"
                name="userid"
                id="userid"
                className="form-input"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                placeholder="รหัสพนักงาน"
                disabled={loading}
                required
              />

              <input
                ref={passRef}
                type="password"
                name="password"
                id="password"
                className="form-input"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="รหัสผ่าน"
                disabled={loading}
                required
              />

              <button className="submitBtn" disabled={loading}>{loading ? "กำลังเข้าสู่ระบบ" : "เข้าสู่ระบบ"}</button>
            </div>
          </div>
        </form>
      </LoginBox> */}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={errMsg !== ""}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={error ? "error" : "success"}
          onClose={handleCloseSnackbar}
        >
          {errMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Login;