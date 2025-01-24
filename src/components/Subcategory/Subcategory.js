import React, {useState, useEffect} from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import axiosInstance from "../../Instance";
import upload_area from "../../assets/images/addProduct/upload_area1.svg";

const Subcategory = () => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        image: null,
    });
    const navigate = useNavigate();
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const fetchCategoryData = async () => {
        axiosInstance
            .get("/api/category")
            .then((response) => {
                if (response.data && Array.isArray(response.data.data)) {
                    setCategories(response.data.data);
                } else {
                    console.log("Unexpected response format");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (id) {
            const fetchCategory = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axiosInstance.get(
                        `/api/category/subcategory/${id}`,
                        {
                            headers: {
                                token: `Bearer ${token}`,
                            },
                        }
                    );

                    const {name, category, image} = response.data.data;
                    setFormData({
                        name: name || "",
                        category: category._id || "",
                        image: image || null,
                    });
                } catch (error) {
                    console.error("Error fetching category:", error);
                    toast.error("Failed to fetch category details.");
                }
            };

            fetchCategory();
        }

        fetchCategoryData();
    }, [id]);


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({...prev, image: file}));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //
    //     const {name, category, image} = formData;
    //     const token = localStorage.getItem("token");
    //
    //     if (!name || !category || (!image && !id)) {
    //         alert("Please provide name, select a category.");
    //         setIsLoading(false);
    //         return;
    //     }
    //
    //     try {
    //         const data = {
    //             name,
    //         };
    //
    //         if (typeof image !== "string") {
    //             data.append("image", image);
    //         }
    //
    //         let response;
    //         if (id) {
    //             response = await axiosInstance.put(
    //                 `/api/category/${category}/subcategory/${id}`,
    //                 data,
    //                 {
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         token: `Bearer ${token}`,
    //                     },
    //                 }
    //             );
    //         } else {
    //             response = await axiosInstance.post(
    //                 `/api/category/${category}/subcategory`,
    //                 data,
    //                 {
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         token: `Bearer ${token}`,
    //                     },
    //                 }
    //             );
    //         }
    //
    //         if (response.status === 200 || response.status === 201) {
    //             toast.success(`Subcategory ${id ? "updated" : "added"} successfully`);
    //             setFormData({name: "", category: "", image: null});
    //             navigate("/subcategory");
    //         } else {
    //             toast.error(response.data.message || "Something went wrong");
    //         }
    //     } catch (error) {
    //         console.error("Error submitting subcategory:", error);
    //         toast.error("An error occurred while submitting the form.");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const {name, category, image} = formData;
        const token = localStorage.getItem("token");

        if (!name || !category || (!image && !id)) {
            alert("Please provide name, select a category, and upload an image.");
            setIsLoading(false);
            return;
        }

        try {
            // Create FormData object
            const data = new FormData();
            data.append("name", name);
            data.append("category", category);

            if (image && typeof image !== "string") {
                data.append("image", image); // Add image if it's a file
            }

            let response;
            if (id) {
                // Update subcategory
                response = await axiosInstance.put(
                    `/api/category/${category}/subcategory/${id}`,
                    data,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
                            token: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                // Create new subcategory
                response = await axiosInstance.post(
                    `/api/category/${category}/subcategory`,
                    data,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
                            token: `Bearer ${token}`,
                        },
                    }
                );
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(`Subcategory ${id ? "updated" : "added"} successfully`);
                setFormData({name: "", category: "", image: null});
                navigate("/subcategory");
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting subcategory:", error);
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
                    sx={{fontWeight: "bold", pb: 2, textTransform: "uppercase"}}
                >
                    {id ? "Edit Subcategory" : "Add Subcategory"}
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
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                label="Category"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Subcategory"
                            variant="outlined"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter subcategory name"
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default Subcategory;
