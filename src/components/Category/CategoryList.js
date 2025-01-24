import React, { useEffect, useState } from "react";
import axiosInstance from "../../Instance";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleFetchData = () => {
    axiosInstance
      .get("/api/category")
      .then((response) => {
        console.log("API response:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          setError("Unexpected response format");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching categories");
        console.error(error);
        setLoading(false);
      });
  };
  useEffect(() => {
    handleFetchData();
  }, []);

  const handleDelete = (id) => {
    axiosInstance
      .delete("/api/category/" + id)
      .then((res) => handleFetchData())
      .catch((err) => console.log(err));
  };

  if (loading) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={6}>
      <Typography variant="h4" gutterBottom>
        Category List
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          sx={{
            marginBottom: "20px",
            backgroundColor: "#4CAF50",
            fontWeight: "bold",
            padding: "10px 20px",
            color: "white",
          }}
          onClick={() => navigate("/add-category")}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/edit-category/${category._id}`)}
                    sx={{ mr: "15px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoryList;
