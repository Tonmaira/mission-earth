import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AppsIcon from '@mui/icons-material/Apps';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "./../../assets/ipdauditlogo.png";
import AvatarPic from "./../../assets/avatar2.png";
import { chkAdmin, chkAdmins } from "./../Function";
import { LinkList } from "../../data/DefaultData";
import Tooltip from '@mui/material/Tooltip'

const roleMap = {
  1: "เภสัช",
  2: "พยาบาล",
  // 3: "เจ้าหน้าที่ประสานสิทธิ",
  //4: "แพทย์",
};

const Header = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const userPic = storedAuth ? JSON.parse(localStorage.getItem("userPic")) : null;
  const isAdmin = chkAdmin(userData?.Role);
  const isAdmins = chkAdmins(userData?.Role);
  // const userData = JSON.parse(localStorage.getItem("userData"));

  // Check Authen
  const fetchData = async () => {
    const config = { headers: { Authorization: `Bearer ${storedAuth?.accessToken}` } };
    try {
      await axios.get(`${apiUrl}/refresh/check`, { ...config });
    } catch (error) {
      navigate('/logout');
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (storedAuth || userData) {
      if (storedAuth) {
        const isAuth = Object.keys(storedAuth).length > 0;
        if (isAuth) {
          if (isAuth && !userData) {
            navigate('/logout');
          } else {
            fetchData();
          }
        }
      }
      if (userData) {
        const isAuth = Object.keys(storedAuth).length > 0;
        const isUserData = Object.keys(userData).length > 0;
        if (!isAuth && isUserData) {
          fetchData();
        }
      }
    }
  }, [location.pathname]);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const MenuAdmin = () => {
    return (
      <>
        <MenuItem key="menuadmin" onClick={() => navigate("/menuadmin", { replace: true })}>
          <ListItemIcon>
            <AppsIcon fontSize="small" style={{ color: "orange" }} />
          </ListItemIcon>
          Admin Menu
        </MenuItem>
        <Divider key="divider1" />
        {isAdmin && (
          <>
            <MenuItem key="addstaff" onClick={() => navigate("/addstaff", { replace: true })}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" style={{ color: "green" }} />
              </ListItemIcon>
              เพิ่มผู้ใช้งาน
            </MenuItem>
            <MenuItem key="staffmanager" onClick={() => navigate("/staffmanager", { replace: true })}>
              <ListItemIcon>
                <ManageAccountsIcon fontSize="small" style={{ color: "turquoise" }} />
              </ListItemIcon>
              จัดการสิทธิ์
            </MenuItem>
            <Divider key="divider2" />
          </>
        )}
      </>
    );
  };

  const AvatarPicDisply = ({ style }) => {
    return (
      <>
        {userPic ? (
          <Avatar src={userPic} style={style}>{userData.name ? userData.name.charAt(0).toUpperCase() : null}</Avatar>
        ) : (
          <Avatar src={AvatarPic} style={style}>{userData.name ? userData.name.charAt(0).toUpperCase() : null}</Avatar>
        )}
      </>
    );
  };

  return (
    <AppBarStyled>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          style={{
            display: "flex",
            minHeight: "1.75rem",
            maxHeight: "1.75rem",
            alignItems: "center",
            paddingTop: "10px",
            paddingBottom: "10px",
            justifyContent: "space-between",
          }}
        >
          <LeftContent sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ padding: "8px" }}
            >
              <MenuIcon />
            </IconButton>
            <StyledMenu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {LinkList?.filter((link) => link.permission === "user").map((link) => (
                <MenuItem key={link.id} onClick={() => navigate(link.location)}>
                    <ListItemIcon>
                    {link.iconMobile}
                    </ListItemIcon>
                    {link.name}
                </MenuItem>
                ))}
                <Divider key="divider1" />
                {isAdmin && LinkList?.filter((link) => link.permission === "admin").map((link) => (
                <MenuItem key={link.id} onClick={() => navigate(link.location)}>
                    <ListItemIcon>
                    {link.iconMobile}
                    </ListItemIcon>
                    {link.name}
                </MenuItem>
                ))}
                <Divider key="divider2" />
                <MenuItem key="logout" onClick={() => navigate("/logout", { replace: true })}>
                    <ListItemIcon>
                    <LogoutIcon fontSize="small" style={{ color: "red" }} />
                    </ListItemIcon>
                    ออกระบบ
                </MenuItem>
            </StyledMenu>
          </LeftContent>

          <div
            onClick={() => navigate("/dashboard")}
            width="auto"
            alt="HOC"
            style={{ cursor: "pointer",fontSize:24}}
          >HOC</div>

          {/* <img
            onClick={() => navigate("/dashboard")}
            height="36"
            width="auto"
            src={Logo}
            alt="โรงพยาบาลไทยนครินทร์"
            style={{ cursor: "pointer" }}
          /> */}

          {roleMap[userData?.UserType]+" : "+userData?.DeptName }

          <Box sx={{ alignItems: "center", display: "flex", flexGrow: 0 }}>

          {LinkList?.map((link) => (
              link.permission === "user" &&
                <Typography key={link.id} variant="body1" onClick={() => navigate(link.location)} sx={{ display: { xs: "none", sm: "block" } }} className="Button-Text">{link.icon} {link.name}</Typography>
            ))}

            {LinkList?.map((link) => (
              link.permission === "admin" && isAdmin &&
                <Typography key={link.id} variant="body1" onClick={() => navigate(link.location)} sx={{ display: { xs: "none", sm: "block" } }} className="Button-Text">{link.icon} {link.name}</Typography>
            ))}

            {userData && (
              <>
                {/* <MenuItem key="user_Name"> */}
                    {userData.Name}
                {/* </MenuItem> */}
                <MenuItem key="logout" onClick={() => navigate("/logout", { replace: true })}>
                    <Tooltip title="ออกจากระบบ" placement="top" arrow>
                        <LogoutIcon fontSize="small" style={{ color: "red" }} />
                    </Tooltip>
                </MenuItem>
              </>
            )
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBarStyled>
  );
};

const AppBarStyled = styled(AppBar)`
  background: #3E3D46 !important;
  padding: 2px 0;

  .Button-Text {
    font-size: 1.188rem;
  }

  .MuiTypography-root {
    cursor: pointer;
    font-family: inherit !important;
    margin-right: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .MuiTypography-root:hover {
    text-decoration: underline;
  }
  .MuiTypography-root:hover {
    -webkit-mask-image: linear-gradient(-75deg, rgba(0,0,0,.6) 30%, #000 50%, rgba(0,0,0,.6) 70%);
    -webkit-mask-size: 200%;
    animation: shine 2s infinite;
  }
  @-webkit-keyframes shine {
    from { -webkit-mask-position: 150%; }
    to { -webkit-mask-position: -50%; }
  }
  @media screen and (max-width: 680px){
    .Button-Text {
      display: none !important;
    }
  }
`;

const StyledBadge = styled(Badge)`
  & .MuiBadge-badge {
    background-color: #44b700;
    color: #44b700;
    box-shadow: #b3c2f2 0px 0px 0px 1px;
    &::after {
      position: absolute;
      top: -1px;
      left: -1px;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: ripple 1.2s infinite ease-in-out;
      border: 1px solid currentColor;
      content: "";
    }
  }
  @keyframes ripple {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
const StyledMenu = styled(Menu)`
  .MuiTypography-root, .MuiAvatar-root, .MuiButtonBase-root.MuiMenuItem-root{
    font-family: inherit;
  }
`;
const LeftContent = styled(Box)`
  @media screen and (min-width: 681px){
    display: none !important;
  }
`;
const RightContent = styled(Box)`
  @media screen and (max-width: 680px){
    display: none !important;
  }
`;

export default Header;