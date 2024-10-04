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
const orderroutes=require('./routes/order')
// connect to the database
connectToDB()


app.use(express.json())
app.use(cors({
    origin: 'https://scatch-bag-homefrontend.vercel.app/',  // Your frontend URL
    credentials: true  // Allows cookies to be sent
  }))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieparser());
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.EXPRESS_SESSION_SECRET
}))

app.use('/auth',authroutes)
app.use('/owner',ownerroutes)
app.use('/products',productroutes)
app.use('/cart',cartroutes)
app.use('/order',orderroutes)


app.listen(process.env.PORT)
