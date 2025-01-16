import React, { useState } from "react";
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
    gallery: "",
    instruction: "",
    product_images: null,
    stock: "",
  });


  const [images, setImages] = useState([]);
  console.log(images)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const imageUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages(imageUrls);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;


    if (name === "instruction") {
      setFormData((prev) => ({
        ...prev,
        [name]: [value],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, product_images: file }));
    }
  };

  const handlePriceChange = (e, index) => {
    const newPriceOptions = [...formData.price];
    newPriceOptions[index] = {
      ...newPriceOptions[index],
      [e.target.name]: e.target.value,
    };
    setFormData((prev) => ({ ...prev, price: newPriceOptions }));
  };

  const handleSizeChange = (e, index) => {
    const newSizeOptions = [...formData.size_options];
    newSizeOptions[index] = {
      ...newSizeOptions[index],
      [e.target.name]: e.target.value,
    };
    setFormData((prev) => ({ ...prev, size_options: newSizeOptions }));
  };

  const handleRateChange = (e, index) => {
    const newRateOptions = [...formData.rate];
    newRateOptions[index] = {
      ...newRateOptions[index],
      [e.target.name]: e.target.value,
    };
    setFormData((prev) => ({ ...prev, rate: newRateOptions }));
  };

  const handleColorChange = (e, index) => {
    const { name, value, files } = e.target;
    const newColorOptions = [...formData.color_options];
  
    if (name === "color") {
      // Update color text input
      newColorOptions[index] = {
        ...newColorOptions[index],
        color: value,
      };
    } else if (name === "color_images" && files && files[0]) {
      // Update color image upload
      newColorOptions[index] = {
        ...newColorOptions[index],
        color_images: files[0],
      };
    }
  
    setFormData((prev) => ({
      ...prev,
      color_options: newColorOptions,
    }));
  };
  
  
  const handleAddPrice = () => {
    setFormData((prev) => ({
      ...prev,
      price: [...prev.price, { orignal_price: "", discounted_price: "" }],
    }));
  };

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      size_options: [...prev.size_options, { size: "", stock: "" }],
    }));
  };

  const handleAddRate = () => {
    setFormData((prev) => ({
      ...prev,
      rate: [...prev.rate, { average: "", count: "" }],
    }));
  };

  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      color_options: [...prev.color_options, { color: "", color_images: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let imageBase64 = null;
    if (formData.product_images) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imageBase64 = reader.result;

        const data = {
          title: formData.title,
          category: formData.category,
          sub_category: formData.sub_category,
          slug: formData.slug,
          description: formData.description,
          price: formData.price,
          producttype: formData.producttype,
          brand: formData.brand,
          quantity: formData.quantity,
          sold: formData.sold,
          color_options: formData.color_options,
          size_options: formData.size_options,
          rate: formData.rate,
          gender: formData.gender,
          gallery: formData.gallery,
          stock: formData.stock,
          instruction: formData.instruction,
          product_images: imageBase64,
        };

        try {
          const response = await axios.post(
            "https://etrade-kils.onrender.com/api/product/",
            data,
            {
              headers: {
                token: `Bearer ${token}`,
              },
            }
          );
          console.log("Product uploaded successfully:", response.data);
        } catch (error) {
          console.error("Error uploading product:", error);
        }
      };
      reader.readAsDataURL(formData.product_images);
    } else {
      const data = {
        title: formData.title,
        category: formData.category,
        sub_category: formData.sub_category,
        slug: formData.slug,
        description: formData.description,
        price: formData.price,
        producttype: formData.producttype,
        brand: formData.brand,
        quantity: formData.quantity,
        sold: formData.sold,
        color_options: formData.color_options,
        size_options: formData.size_options,
        rate: formData.rate,
        gender: formData.gender,
        gallery: formData.gallery,
        stock: formData.stock,
        instruction: formData.instruction,
        product_images: null,
      };

      try {
        const response = await axios.post(
          "https://etrade-kils.onrender.com/api/product",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Product uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading product:", error);
      }
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
                  style={{ height: 100, cursor: "pointer", objectFit: "cover" }}
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
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
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
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
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
                    <Typography variant="body1">Upload Color Image</Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                    >
                      {formData.color_options[index]?.color_images
                        ? "Change Image"
                        : "Upload Image"}
                      <input
                        type="file"
                        name="color_images"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleColorChange(e, index)}  // Pass index here
                      />
                    </Button>

                    {formData.color_options[index]?.color_images && (
                      <Box mt={1} sx={{height: "100%", width: "100%"}}>
                        <img
                          src={URL.createObjectURL(formData.color_options[index].color_images)}
                          alt="Color Preview"
                          style={{
                            height: "100px",
                            width: "100px",
                            objectFit: "cover",
                            borderRadius: 4,
                            border: "1px solid #ddd",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>

              </Grid>
            ))}
            <Button onClick={handleAddColor}>Add Color</Button>
          </Grid>


          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
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

              <Grid container spacing={2} sx={{ mt: 2 }}>
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
                        name='gallery'
                        value={formData.gallery}
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
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
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
              sx={{ backgroundColor: "black" }}
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