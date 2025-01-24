// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../Instance";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   CircularProgress,
//   Button,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const SubcategoryList = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [category, setCategory] = useState("")
//   const [categoryData, setCategoryData] = useState("")

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCategory((prev) => ({ ...prev, [name]: value }));
//   };

//   const fetchCategoryData = async () => {
//     axiosInstance
//       .get("/api/category")
//       .then((response) => {
//         if (response.data && Array.isArray(response.data.data)) {
//           setCategoryData(response.data.data);
//         } else {
//           console.log("Unexpected response format");
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   const navigate = useNavigate();

//   const handleFetchData = () => {
//     axiosInstance
//       .get(`/api/category/${category}/subcategory`)
//       .then((response) => {
//         console.log("API response:", response.data);
//         if (response.data && Array.isArray(response.data.data)) {
//           setCategories(response.data.data);
//         } else {
//           setError("Unexpected response format");
//         }
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError("Error fetching categories");
//         console.error(error);
//         setLoading(false);
//       });
//   };
//   useEffect(() => {
//     fetchCategoryData()
//     handleFetchData();
//   }, []);

//   const handleDelete = (id) => {
//     axiosInstance
//       .delete("/api/category/" + id)
//       .then((res) => handleFetchData())
//       .catch((err) => console.log(err));
//   };

//   if (loading) {
//     return (
//       <Box mt={5} display="flex" justifyContent="center">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box mt={6}>
//       <Typography variant="h4" gutterBottom>
//         Subcategory List
//       </Typography>
//       <Box sx={{ display: "flex", justifyContent: "end" }}>
//         <Button
//           sx={{
//             marginBottom: "20px",
//             backgroundColor: "#4CAF50",
//             fontWeight: "bold",
//             padding: "10px 20px",
//             color: "white",
//           }}
//           onClick={() => navigate("/add-subcategory")}
//         >
//           Add Subcategory
//         </Button>
//       </Box>

//       <FormControl fullWidth>
//         <InputLabel>Category</InputLabel>
//         <Select
//           name="category"
//           value={category}
//           onChange={handleInputChange}
//           label="Category"
//         >
//           {categoryData.map((item) => (
//             <MenuItem key={item._id} value={item._id}>
//               {item.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="categories table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Sr No.</TableCell>
//               <TableCell>Subcategory Name</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {categories.map((category, index) => (
//               <TableRow key={category._id}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell component="th" scope="row">
//                   {category.name}
//                 </TableCell>
//                 <TableCell align="center">
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={() => navigate(`/edit-category/${category._id}`)}
//                     sx={{ mr: "15px" }}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDelete(category._id)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default SubcategoryList;

import React, {useEffect, useState} from "react";
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {useNavigate} from "react-router-dom";

const SubcategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [category, setCategory] = useState("");
    const [categoryData, setCategoryData] = useState([]);

    const navigate = useNavigate();

    const fetchCategoryData = async () => {
        try {
            const response = await axiosInstance.get("/api/category");
            if (response.data && Array.isArray(response.data.data)) {
                setCategoryData(response.data.data);
            } else {
                console.log("Unexpected response format");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/api/category/${categoryId}/subcategory`
            );

            if (response.data && Array.isArray(response.data.data)) {
                setCategories(response.data.data);
                setError(null);
            } else {
                setError("Unexpected response format");
            }
        } catch (error) {
            setError("Error fetching subcategories");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        const selectedCategory = event.target.value;
        setCategory(selectedCategory);
        if (selectedCategory) {
            fetchSubcategories(selectedCategory);
        } else {
            setCategories([]); // Clear subcategories if no category is selected
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/category/${category}/subcategory/${id}`);
            if (category) fetchSubcategories(category); // Refresh the subcategory list
        } catch (error) {
            console.error("Error deleting subcategory:", error);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, []);

    return (
        <Box mt={6}>
            <Typography variant="h4" gutterBottom>
                Subcategory List
            </Typography>
            <Box sx={{display: "flex", justifyContent: "end"}}>
                <Button
                    sx={{
                        marginBottom: "20px",
                        backgroundColor: "#4CAF50",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        color: "white",
                    }}
                    onClick={() => navigate("/add-subcategory")}
                >
                    Add Subcategory
                </Button>
            </Box>

            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                    name="category"
                    value={category}
                    onChange={handleInputChange}
                    label="Category"
                >
                    {categoryData.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {loading ? (
                <Box mt={5} display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : categories.length === 0 ? (
                <Typography mt={2}>
                    No subcategories found for the selected category.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="categories table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Sr No.</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Subcategory Name</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((subcategory, index) => (
                                <TableRow key={subcategory._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <img
                                            src={subcategory.image}
                                            alt={subcategory.name}
                                            style={{
                                                height: 50,
                                                objectFit: "cover",
                                                borderRadius: 4,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {subcategory.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() =>
                                                navigate(`/edit-subcategory/${subcategory._id}`)
                                            }
                                            sx={{mr: "15px"}}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(subcategory._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default SubcategoryList;
