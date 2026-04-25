const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const connectDB = require('./config/db.js');
const earphoneRouter = require('./routers/earphonerouter.js');
const userRoutes = require('./routers/userrouter.js');
const orderRouter = require('./routers/orderroutes.js');



dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// const port = process.env.PORT || 5000;

app.use('/api/earphones',earphoneRouter);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRouter)

// app.listen (port,()=>{
//     console.log(`server is running on localhost:${port}`)
    
// })



app.get('/', (req, res) => {
    res.send('Hello World!')
});
