import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import ButtonGroup from "@mui/material/ButtonGroup";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PersonIcon from "@mui/icons-material/Person";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { default as MenuMaterial } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Menu() {
  const token = useSelector((state) => state.token);
  const router = useRouter();
  const theme = useTheme();
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const buttons = [
    {
      icon: <HomeIcon fontSize="small" sx={{ marginRight: "20px" }} />,
      text: "Recipes",
      link: "/recipes",
      href: "/recipes",
    },
    {
      icon: <CalendarMonthIcon fontSize="small" sx={{ marginRight: "20px" }} />,
      text: "Planner",
      link: "/planner",
      href: "/planner",
    },
    {
      icon: <AutoStoriesIcon fontSize="small" sx={{ marginRight: "20px" }} />,
      text: "Recipe books",
      link: "/recipebooks",
      href: "/recipebooks",
    },
    {
      icon: <PersonIcon fontSize="small" sx={{ marginRight: "20px" }} />,
      text: "Profile",
      link: "/profile/[username]",
      href: `/profile/${token?.username}`,
    },
  ];

  return (
    <Box
      bgcolor={"white"}
      height={{ xs: "5vh", md: "100vh" }}
      width={{ xs: "15%", md: "20%" }}
      alignItems={"flex-start"}
      display={"flex"}
      flexDirection={"column"}
      textAlign={"center"}
    >
      {mdMatches ? (
        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: "80%",
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      ) : null}
      {mdMatches ? (
        <>
          <ButtonGroup
            orientation="vertical"
            aria-label="vertical outlined button group"
            sx={{
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {buttons.map((button) => (
              <Link href={button.href} key={button.text}>
                <Button
                  key={button.text}
                  variant={"text"}
                  style={{
                    border: "0px",
                    borderRadius: "10px",
                    textTransform: "none",
                    width: "100%",
                  }}
                  sx={{
                    height: "50px",
                    color:
                      router.pathname === button.link ? "white" : "#757575",
                    bgcolor:
                      router.pathname === button.link ? "#772318" : "white",
                    "&:hover": {
                      bgcolor:
                        router.pathname === button.link ? "#772318" : "#faf7f7",
                    },
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "auto",
                      textAlign: "left",
                    }}
                  >
                    {button.icon}
                    {button.text}
                  </div>
                </Button>
              </Link>
            ))}
          </ButtonGroup>
        </>
      ) : (
        <>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <img
              src="/small-logo.png"
              alt="logo"
              style={{
                width: "70%",
                height: "auto",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          </Button>
          <MenuMaterial
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {buttons.map((button) => (
              <Link href={button.href} key={button.text}>
                <MenuItem
                  key={button.text}
                  onClick={handleClose}
                  sx={{
                    fontFamily: "sans-serif",
                    color:
                      router.pathname === button.link ? "white" : "#757575",
                    bgcolor:
                      router.pathname === button.link ? "#772318" : "white",
                    "&:hover": {
                      bgcolor:
                        router.pathname === button.link ? "#772318" : "#faf7f7",
                    },
                  }}
                >
                  {button.icon}
                  {button.text}
                </MenuItem>
              </Link>
            ))}
          </MenuMaterial>
        </>
      )}
    </Box>
  );
}
