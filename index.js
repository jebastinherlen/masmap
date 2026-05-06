const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

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

app.use('/api/earphones', earphoneRouter);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// ✅ THIS IS REQUIRED
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`server is running on port ${PORT}`);
});