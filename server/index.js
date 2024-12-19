const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const dbConnect = require("./config/database");

const cloudinaryConnect = require("./config/cloudinary");

const cookieParser = require("cookie-parser");

const cors = require("cors");

const fileUpload = require("express-fileupload");       // for uploading image and files

const dotenv = require("dotenv");

const PORT = process.env.PORT | 4000;

// database connect
dbConnect();

// cloudinary connect
cloudinaryConnect();

// middlewares
app.use(express.json());
app.use(cookieParser());

// fontend and backend connection
app.use(
    cors({
        origin:"*",
        credentials:true,
    })
)

// tempfile path
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)


// mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes); 
app.use("/api/v1/payment", paymentRoutes); 
app.use("/api/v1/course", courseRoutes);


// default routes
app.get("/", (request, respond) => {
    return respond.json({
        success:true,
        message:"Your server is running",
    });
})


// activate the server
app.listen(PORT, () => {
    console.log(`App is running is ${PORT}`);
})