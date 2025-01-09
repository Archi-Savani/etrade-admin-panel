import React, { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Collapse,
  ListItemButton,
  ListItem,
  Drawer,
  List,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../../assets/images/header/Asset 2@4x.png";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const Header = ({ open }) => {
  const drawerWidth = 250;
  const drawerWidth2 = 370;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const menuItems = [
    {
      label: "Add Product",
      to: "/add-product",
    },
    {
      label: "Order",
    },
  ];
  const drawer = (
    <Box>
      <Typography
        sx={{
          mt: 2,
          px: "16px",
          textAlign: "end",
        }}
      >
        <Box>
          <CloseIcon onClick={handleDrawerToggle} />
        </Box>
      </Typography>
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <Box sx={{ width: "100%" }}>
                <Typography
                  to={item.to}
                  style={{ color: "unset" }}
                  onClick={
                    item.subMenu === null
                      ? () => setMobileMenuOpen(!mobileMenuOpen)
                      : null
                  }
                >
                  <Box
                    sx={{
                      width: "100%",
                      color: "black",
                      display: "flex !important",
                      justifyContent: "space-between",
                      alignItems: "center",
                      "&:hover": {
                        color: "black",
                      },
                    }}
                  >
                    <Box sx={{ fontWeight: "500" }}>{item.label}</Box>
                  </Box>
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <Box>
      <AppBar
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 48px 0 rgba(0,0,0,.08)",
          width: open ? { sm: `calc(100% - ${drawerWidth}px)` } : "100%",
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Box sx={{ width: "100%", px: "30px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                component={"img"}
                src={logo}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: { xs: "60px" },
                  width: { md: "176px", xs: "120px" },
                  cursor: "pointer",
                  py: "10px",
                  objectFit: "contain",
                }}
              ></Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "space-between", sm: "unset" },
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      mr: 2,
                    }}
                  ></Typography>
                </Box>
                <nav>
                  <Drawer
                    anchor="right"
                    variant="temporary"
                    open={mobileMenuOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true,
                    }}
                    sx={{
                      display: { xs: "block", xl: "none" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: { xs: drawerWidth, sm: drawerWidth2 },
                      },
                    }}
                  >
                    {drawer}
                  </Drawer>
                </nav>
                <Box
                  sx={{
                    display: { xs: "none", xl: "flex" },
                    alignItems: "center",
                  }}
                >
                  {menuItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        color: "black",
                        margin: "20px 30px 0px",
                        pb: "10px",
                        position: "relative",
                        fontSize: "14px",
                        transition: "0.4s",
                        cursor: "pointer",
                        textWrap: "nowrap",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          bottom: "0",
                          left: "0%",
                          height: "2px",
                          width: "0%",
                          backgroundColor: "black",
                          transition: ".4s",
                        },
                        "&:hover": {
                          "&::before": {
                            width: "100%",
                          },
                        },
                      }}
                    >
                      <Typography
                        className="lato"
                        onClick={() => navigate(item.to)}
                        style={{ color: "unset" }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  color: "black",
                  display: { xs: "flex" },
                  alignItems: "center",
                  fontWeight: "600",
                  letterSpacing: "-0.7px",
                }}
              >
                <Typography
                  sx={{ color: "black", cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  <PersonIcon />
                </Typography>
                <Box
                  sx={{
                    flexGrow: 0,
                    display: { xs: "block", xl: "none" },
                  }}
                >
                  <IconButton
                    size="large"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                    sx={{ color: "black", fontSize: "3px" }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Header;
