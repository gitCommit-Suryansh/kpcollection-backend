const mongoose = require('mongoose')
const config = require('config')
const dbgr = require("debug")("development:mongoose")
require('dotenv').config();

exports.connectToDB = async () => {
    try {
        mongoose
            .connect(process.env.MONGO_URI)
            .then(function () {
                console.log("connected to the database")
            })
            .catch(function (err) {
                console.log(err)
            })

    } catch(err){
        console.log(err)
    }
}