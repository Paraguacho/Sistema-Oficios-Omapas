const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require('cors');
//Cargar variables de entorno.
dotenv.config();

//Imports
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes')
const oficioRoutes = require('./routes/oficioRoutes')
const groupRoutes = require('./routes/groupRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes'); 

const app = express();

connectDB();

//Middleware/Json
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/oficios', oficioRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req,res) =>{
    res.send('API funcionando.')
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en: ${PORT}`)

})
