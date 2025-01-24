import React, { useState, useEffect } from "react";
import upload_area from "../../assets/images/addProduct/upload_area1.svg";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Instance";

const Category = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axiosInstance.get(`/api/category/${id}`, {
            headers: {
              token: `Bearer ${token}`,
            },
          });

          const { name, image } = response.data.data;
          setFormData({
            name: name || "",
            image: image || null,
          });
        } catch (error) {
          console.error("Error fetching category:", error);
          toast.error("Failed to fetch category details.");
        }
      };

      fetchCategory();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, image } = formData;
    const token = localStorage.getItem("token");

    if (!name || (!image && !id)) {
      alert("Please provide both name and image.");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", name);

      if (typeof image !== "string") {
        data.append("image", image);
      }

      let response;
      if (id) {
        response = await axiosInstance.put(`/api/category/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: `Bearer ${token}`,
          },
        });
      } else {
        response = await axiosInstance.post("/api/category", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: `Bearer ${token}`,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`Category ${id ? "updated" : "added"} successfully`);
        setFormData({ name: "", image: null });
        navigate("/category");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        mt: "50px",
        p: 4,
        backgroundColor: "rgba(240, 248, 255, 0.2)",
        width: "100%",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", pb: 2, textTransform: "uppercase" }}
        >
          {id ? "Edit Category" : "Add Category"}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box>
              <Typography variant="body1">Upload Category Image</Typography>
              <label htmlFor="image">
                <img
                  src={
                    typeof formData.image === "string"
                      ? formData.image
                      : formData.image
                      ? URL.createObjectURL(formData.image)
                      : upload_area
                  }
                  alt="Upload Preview"
                  style={{
                    height: 100,
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                />
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                hidden
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : id ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Category;
