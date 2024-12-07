const express = require('express');
const connectDB = require('./config/db');
const app = express();
const userRoutes = require('./routes/userRoute')
const patientRoutes = require('./routes/patientRoute')
const testRoutes = require('./routes/testRoute')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const cors = require('cors');
app.use(cors());
// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/users',userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/tests', testRoutes);
app.get('/',(req ,res)=>{
    res.send('Hello from the server!'); 
})





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
