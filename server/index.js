const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require('cors');

//Imports
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes')

dotenv.config();
const app = express();

connectDB();

//Middleware/Json
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes)

app.get('/', (req,res) =>{
    res.send('API funcionando.')
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en: ${PORT}`)

})
