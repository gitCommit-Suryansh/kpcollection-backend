const express=require('express')
const app=express()
const mongoose=require('mongoose')
const path=require('path')
const cors=require('cors')
const cookieparser=require('cookie-parser')
const expressSession=require('express-session')

const { connectToDB } = require('./database/connection')

const authroutes=require('./routes/auth')
const ownerroutes=require('./routes/owner')
const productroutes=require('./routes/products')
const cartroutes=require('./routes/cart')
const wishlistroutes=require('./routes/wishlist')
const orderroutes=require('./routes/order')
const phoneperoutes=require('./routes/phonepe')

connectToDB()


const corsOptions = {
  origin: ['https://kpcollection-frontend.vercel.app', 'http://localhost:3001','https://kpcollection.store','https://www.kpcollection.store'],
  credentials: true  // Allows cookies to be sent
};

// Enable CORS for all routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({  limit: '5mb', extended: true }));
app.use(cookieparser());

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth',authroutes)
app.use('/owner',ownerroutes)
app.use('/products',productroutes)
app.use('/cart',cartroutes)
app.use('/wishlist',wishlistroutes)
app.use('/order',orderroutes)
app.use('/api',phoneperoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
