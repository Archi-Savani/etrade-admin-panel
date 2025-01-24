import React from "react";
import Header from "./components/global/Header/Header";
import Home from "./pages/Home/Home";
import { Route, Routes } from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import { Box, CssBaseline, styled } from "@mui/material";
import Sidebar from "./components/sidebar/Sidebar";
import Login_form from "./pages/Login";
import Category from "./components/Category/Category";
import CategoryList from "./components/Category/CategoryList";
import Subcategory from "./components/Subcategory/Subcategory";
import SubcategoryList from "./components/Subcategory/SubcategoryList";

const drawerWidth = 300;

const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };
  const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Header open={open} />

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Sidebar
          open={open}
          handleDrawerClose={handleDrawerClose}
          window={window}
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
          handleDrawerTransitionEnd={handleDrawerTransitionEnd}
          setOpen={setOpen}
        />
      </Box>
      <Main open={open}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/login" element={<Login_form />} />
          <Route path="/category" element={<CategoryList/>}/>
          <Route path="/add-category" element={<Category/>}/>
          <Route path="/edit-category/:id" element={<Category/>}/>
          <Route path="/subcategory" element={<SubcategoryList/>}/>
          <Route path="/add-subcategory" element={<Subcategory/>}/>
          <Route path="/edit-subcategory/:id" element={<Subcategory/>}/>
        </Routes>
      </Main>
    </Box>
  );
};

export default App;
