import React, {useState} from "react";
import upload_area from "../assets/images/addProduct/upload_area1.svg";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    TextareaAutosize,
    Typography,
    Grid,
} from "@mui/material";
import axios from "axios";

const AddProduct = () => {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        sub_category: "",
        slug: "",
        description: "",
        price: [],
        producttype: "",
        brand: "",
        quantity: 0,
        sold: 0,
        color_options: [],
        size_options: [],
        rate: [],
        gender: "",
        instruction: "",
        product_images: null,
        gallery: [],
    });


    const [images, setImages] = useState([]);
    console.log(images)

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an array
        const newImages = files.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        // Append new images to existing images
        setImages((prevImages) => [...prevImages, ...newImages]);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;


        if (name === "instruction") {
            setFormData((prev) => ({
                ...prev,
                [name]: [value],
            }));
        } else {
            setFormData((prev) => ({...prev, [name]: value}));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({...prev, product_images: file}));
        }
    };

    const handlePriceChange = (e, index) => {
        const newPriceOptions = [...formData.price];
        newPriceOptions[index] = {
            ...newPriceOptions[index],
            [e.target.name]: e.target.value,
        };
        setFormData((prev) => ({...prev, price: newPriceOptions}));
    };

    const handleSizeChange = (e, index) => {
        const newSizeOptions = [...formData.size_options];
        newSizeOptions[index] = {
            ...newSizeOptions[index],
            [e.target.name]: e.target.value,
        };
        setFormData((prev) => ({...prev, size_options: newSizeOptions}));
    };

    const handleRateChange = (e, index) => {
        const newRateOptions = [...formData.rate];
        newRateOptions[index] = {
            ...newRateOptions[index],
            [e.target.name]: e.target.value,
        };
        setFormData((prev) => ({...prev, rate: newRateOptions}));
    };

    const handleColorChange = (e, index) => {
        const newColorOptions = [...formData.color_options];
        if (e.target.name === "color_images") {
            // Handle file upload
            newColorOptions[index] = {
                ...newColorOptions[index],
                [e.target.name]: e.target.files[0], // Store the file
            };
        } else {
            newColorOptions[index] = {
                ...newColorOptions[index],
                [e.target.name]: e.target.value,
            };
        }
        setFormData((prev) => ({...prev, color_options: newColorOptions}));
    };

    const handleColorImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const updatedColors = [...formData.color_options];
            updatedColors[index].color_images = file;
            setFormData({...formData, color_options: updatedColors});
        }
    };
    const handleAddPrice = () => {
        setFormData((prev) => ({
            ...prev,
            price: [...prev.price, {orignal_price: "", discounted_price: ""}],
        }));
    };

    const handleAddSize = () => {
        setFormData((prev) => ({
            ...prev,
            size_options: [...prev.size_options, {size: "", stock: ""}],
        }));
    };

    const handleAddRate = () => {
        setFormData((prev) => ({
            ...prev,
            rate: [...prev.rate, {average: "", count: ""}],
        }));
    };

    const handleAddColor = () => {
        setFormData((prev) => ({
            ...prev,
            color_options: [...prev.color_options, {color: "", color_images: null}],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();

        formDataToSend.append("title", formData.title);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("sub_category", formData.sub_category);
        formDataToSend.append("slug", formData.slug);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", JSON.stringify(formData.price));
        formDataToSend.append("producttype", formData.producttype);
        formDataToSend.append("brand", formData.brand);
        formDataToSend.append("quantity", formData.quantity);
        formDataToSend.append("sold", formData.sold);
        formDataToSend.append("color_options", JSON.stringify(formData.color_options));
        formDataToSend.append("size_options", JSON.stringify(formData.size_options));
        formDataToSend.append("rate", JSON.stringify(formData.rate));
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("instruction", formData.instruction);


        if (formData.product_images) {
            formDataToSend.append("product_images", formData.product_images);
        }
        if (formData.color_images) {
            formDataToSend.append("color_images", formData.color_images);
        }


        try {
            const response = await axios.post(
                "https://etrade-kils.onrender.com/api/product",
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Product uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading product:", error.response?.data || error.message);
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
                    Product Upload
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box>
                            <Typography variant="body1">Upload Product Image</Typography>
                            <label htmlFor="product_images">
                                <img
                                    src={
                                        formData.product_images
                                            ? URL.createObjectURL(formData.product_images)
                                            : upload_area
                                    }
                                    alt="Upload Preview"
                                    style={{height: 100, cursor: "pointer", objectFit: "cover"}}
                                />
                            </label>
                            <input
                                type="file"
                                id="product_images"
                                name="product_images"
                                onChange={handleFileChange}
                                hidden
                                required
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter product title"
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Category"
                            variant="outlined"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            placeholder="Enter category"
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Sub-Category"
                            variant="outlined"
                            name="sub_category"
                            value={formData.sub_category}
                            onChange={handleInputChange}
                            placeholder="Enter sub-category"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Slug"
                            variant="outlined"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="Enter Slug"
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextareaAutosize
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter product description"
                            minRows={4}
                            style={{
                                width: "100%",
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                padding: "8px",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{fontWeight: "bold"}}>
                            Price Options
                        </Typography>
                        {formData.price.map((price, index) => (
                            <Grid container spacing={2} key={index} mt={"8px"}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Original Price"
                                        variant="outlined"
                                        name="orignal_price"
                                        value={price.orignal_price}
                                        onChange={(e) => handlePriceChange(e, index)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Sale Price"
                                        variant="outlined"
                                        name="discounted_price"
                                        value={price.discounted_price}
                                        onChange={(e) => handlePriceChange(e, index)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={handleAddPrice}>Add Price</Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Product Type"
                            variant="outlined"
                            name="producttype"
                            value={formData.producttype}
                            onChange={handleInputChange}
                            placeholder="Enter product type"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Brand"
                            variant="outlined"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            placeholder="Enter brand"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            placeholder="Enter quantity"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Sold"
                            variant="outlined"
                            name="sold"
                            value={formData.sold}
                            onChange={handleInputChange}
                            placeholder="Enter sold"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{fontWeight: "bold"}}>
                            Color Options
                        </Typography>
                        {formData.color_options.map((color, index) => (
                            <Grid container spacing={2} key={index} mt={"8px"}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Color"
                                        variant="outlined"
                                        name="color"
                                        value={color.color}
                                        onChange={(e) => handleColorChange(e, index)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box>
                                        <Typography variant="body1">Upload Product Image</Typography>
                                        <label htmlFor={`color_images_${index}`}>
                                            <img
                                                src={
                                                    formData.color_options[index]?.color_images
                                                        ? URL.createObjectURL(formData.color_options[index].color_images)
                                                        : upload_area
                                                }
                                                alt="Upload Preview"
                                                style={{height: 100, cursor: "pointer", objectFit: "cover"}}
                                            />
                                        </label>
                                        <input
                                            type="file"
                                            id={`color_images_${index}`}
                                            name="color_images"
                                            onChange={(e) => handleColorImageChange(e, index)}
                                            hidden
                                            required
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={handleAddColor}>Add Color</Button>
                    </Grid>


                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{fontWeight: "bold"}}>
                            Size Options
                        </Typography>
                        {formData.size_options.map((size, index) => (
                            <Grid container spacing={2} key={index} mt={"8px"}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Size"
                                        variant="outlined"
                                        name="size"
                                        value={size.size}
                                        onChange={(e) => handleSizeChange(e, index)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Stock"
                                        variant="outlined"
                                        name="stock"
                                        value={size.stock}
                                        onChange={(e) => handleSizeChange(e, index)}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={handleAddSize}>Add Size</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Upload Multiple Images
                            </Typography>
                            <Button variant="contained" component="label">
                                Upload Images
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </Button>

                            <Grid container spacing={2} sx={{mt: 2}}>
                                {images.map((image, index) => (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                width: "100%",
                                                paddingBottom: "100%",
                                                border: "1px solid #ddd",
                                                borderRadius: 1,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{fontWeight: "bold"}}>
                            Ratings
                        </Typography>
                        {formData.rate.map((rate, index) => (
                            <Grid container spacing={2} key={index} mt={"8px"}>
                                <Grid item xs={6}>
                                    <TextField
                                        type="number"
                                        label="Average"
                                        variant="outlined"
                                        name="average"
                                        value={rate.average}
                                        onChange={(e) => handleRateChange(e, index)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Count"
                                        variant="outlined"
                                        name="count"
                                        value={rate.count}
                                        onChange={(e) => handleRateChange(e, index)}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={handleAddRate}>Add Rate</Button>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                label="Gender"
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/*<Grid item xs={12} sm={6}>*/}
                    {/*  <FormControl fullWidth>*/}
                    {/*    <InputLabel>Category</InputLabel>*/}
                    {/*    <Select*/}
                    {/*      name="category"*/}
                    {/*      value={formData.category}*/}
                    {/*      onChange={handleInputChange}*/}
                    {/*      label="Category"*/}
                    {/*    >*/}
                    {/*      <MenuItem value="men">Men</MenuItem>*/}
                    {/*      <MenuItem value="women">Women</MenuItem>*/}
                    {/*    </Select>*/}
                    {/*  </FormControl>*/}
                    {/*</Grid>*/}


                    <Grid item xs={12}>
                        <TextareaAutosize
                            name="instruction"
                            value={formData.instruction}
                            onChange={handleInputChange}
                            placeholder="Enter product instructions"
                            minRows={4}
                            style={{
                                width: "100%",
                                border: "1px solid rgba(0, 0, 0, 0.23)",
                                padding: "8px",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{backgroundColor: "black"}}
                            fullWidth
                        >
                            Upload Product
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AddProduct;