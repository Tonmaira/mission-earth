import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background: #262626;
  }
`;

const Logout = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const logout = async () => {
      try {
        const storageKeys = ["auth", "userData", "userPic", "PrevLocation", "language"];
        storageKeys.forEach((key) => localStorage.removeItem(key));
        setAuth({});
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
    logout();
  }, [setAuth, navigate]);

  return (
    <LogoutLoad>
      <GlobalStyle />
      <div className="ring">Logging out.<span></span></div>
    </LogoutLoad>
  );
};

const LogoutLoad = styled.div`
  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 200px;
    height: 200px;
    background: transparent;
    border: 3px solid #3c3c3c;
    border-radius: 50%;
    text-align: center;
    line-height: 200px;
    font-size: 20px;
    color:#fff000;
    letter-spacing:4px;
    text-transform:uppercase;
    text-shadow:0 0 10px #fff000;
    box-shadow:0 0 20px rgba(0,0,0,.5);
  }
  .ring:before {
    content:'';
    position:absolute;
    top:-3px;
    left:-3px;
    width:100%;
    height:100%;
    border:3px solid transparent;
    border-top:3px solid #fff000;
    border-right:3px solid #fff000;
    border-radius:50%;
    animation:animateC 2s linear infinite;
  }
  span {
    display:block;
    position:absolute;
    top:calc(50% - 2px);
    left:50%;
    width:50%;
    height:4px;
    background:transparent;
    transform-origin:left;
    animation:animate 2s linear infinite;
  }
  span:before {
    content:'';
    position:absolute;
    width:16px;
    height:16px;
    border-radius:50%;
    background:#fff000;
    top:-6px;
    right:-8px;
    box-shadow:0 0 20px #fff000;
  }
  @keyframes animateC {
    0% {
      transform:rotate(0deg);
    }
    100%{
      transform:rotate(360deg);
    }
  }
  @keyframes animate {
    0% {
      transform:rotate(45deg);
    }
    100% {
      transform:rotate(405deg);
    }
  }
`;

export default Logout;