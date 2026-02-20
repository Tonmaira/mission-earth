import { styled } from "styled-components";
import Box from "@mui/material/Box";

export const LoginBox = styled(Box)`
  form {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    width: 450px;
    width: 350px;
    min-height: 500px;
    min-height: 450px;
    height: auto;
    border-radius: 2%;
    box-shadow: 0 9px 50px hsla(20, 67%, 75%, 0.31);
    padding: 2%;
    background-image: linear-gradient(-225deg,rgb(227, 246, 253) 50%, #FFE6FA 50%);
    background-image: linear-gradient(-225deg,rgb(227, 247, 253) 50%,rgba(212, 46, 46, 1) 50%);
  }
  form .con {
    display: -webkit-flex;
    display: flex;

    -webkit-justify-content: space-around;
    justify-content: space-around;

    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    
    margin: 0 auto;
  }

  .head-form {
    margin: 2% auto 10% auto;
    text-align: center;
  }
  .head-form h2 {
    font-size: 250%;
    color: #3e403f;
  }

  .input-item {
    background: #fff;
    color: #333;
    padding: 14.5px 0px 15px 9px;
    border-radius: 5px 0px 0px 5px;
  }

  input[class="form-input"] {
    width: 240px;
    height: 30px;

    margin-top: 5%;
    padding: 15px;
    
    font-size: 16px;
    font-family: inherit;
    color: #5E6472;
    color: #464951;

    outline: none;
    border: none;

    border-radius: 0px 10px 10px 0px;
    transition: 0.2s linear;
    
    border: 1px solid #0000001a;
  }

  input:focus {
    transform: translateX(-2px);
    border-radius: 10px;
  }

  button {
    display: inline-block;
    color: #252537;
    color: #3f3f5b;

    width: 280px;
    height: 50px;

    padding: 0 20px;
    background: #fff;
    border-radius: 5px;
    
    outline: none;
    border: none;

    cursor: pointer;
    text-align: center;
    transition: all 0.2s linear;
    
    margin: 7% auto;
    letter-spacing: 0.05em;

    border: 1px solid #00000045;
  }

  .submits {
    width: 48%;
    display: inline-block;
    float: left;
    margin-left: 2%;
  }

  button:hover {
    transform: translatey(3px);
    box-shadow: none;
  }

  button:hover {
    animation: ani9 0.4s ease-in-out infinite alternate;
  }
  @keyframes ani9 {
    0% {
        transform: translateY(3px);
    }
    100% {
        transform: translateY(5px);
    }
  }
`;

export const LoginBoxOcc = styled(Box)`
  text-align: center;

  .login {
    overflow: hidden;
    background-color: white;
    padding: 44px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 480px;
    transform: translate(-50%, -50%);
    transition: transform 300ms, box-shadow 300ms;
    box-shadow: 5px 5px 10px 0px rgb(0 184 255 / 30%);
  }
  .login::before, .login::after {
    content: "";
    position: absolute;
    width: 730px;
    height: 730px;
    border-top-left-radius: 40%;
    border-top-right-radius: 45%;
    border-bottom-left-radius: 35%;
    border-bottom-right-radius: 40%;
    z-index: -1;
  }
  .login::before {
    left: 35%;
    bottom: -130%;
    background-color:rgb(224, 75, 64);
    animation: wawes 8s infinite linear;
  }
  .login::after {
    left: 15%;
    bottom: -125%;
    background-color:rgba(222, 195, 135, 0.23);
    animation: wawes 10s infinite;
  }

  .login h1 {
    color: #5b5b5b;
    font-size: 26px;
    line-height: 1;
    margin: 0 0 20px 0;
    text-align: center;
  }

  .login > input {
    font-family: 'DB-Helvethaica-X', 'Kanit', sans-serif;
    border-radius: 5px;
    font-size: 20px;
    background: white;
    color: black;
    width: 80%;
    border: 1px solid #ffd1fe;
    padding: 10px 10px;
    margin: 15px 0;
  }
  .login > input#userid {
    margin-top: 15px;
  }
  .login > input#password {
    margin-bottom: 15px;
  }

  .login > button {
    font-family: 'DB-Helvethaica-X', 'Kanit', sans-serif;
    cursor: pointer;
    color: #fff;
    font-size: 24px;
    text-transform: uppercase;
    width: max-content;
    border: 0;
    padding: 10px 20px;
    margin: 20px 0 0 0;
    border-radius: 5px;
    background-color:rgb(98, 83, 151);
    transition: background-color 300ms;
  }
  .login > button:hover {
    background-color: #ed143d;
  }

  @media screen and (max-width: 560px) {
    .login {
        width: 80vw;
        padding: 40px 30px 30px 30px;
    }
  }

  @keyframes wawes {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;