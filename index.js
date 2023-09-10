const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()


const {connection} = require('./db')
const {UserModel} = require("./User.model")

const app = express()

app.use(express.json())

app.post('/signup' , async(req,res) => {
    const {email,password,name,age} = req.body

    const hashed_password = bcrypt.hashSync(password,8)

    const new_user = new UserModel({
        email : email,
        password : hashed_password,
        name : name,
        age : age
    })
    await new_user.save()
    res.send("Signup successful")
})

app.post('/login' , async(req,res) => {
    const{email,password} = req.body
    const user = await UserModel.findOne({email})
    console.log(user)
    if(!user){
       return res.send("Please login")
    }
    const hash = user.password
    const correct_password = bcrypt.compareSync(password,hash)

    if(correct_password){
        const token = jwt.sign({userID : user._id},process.env.JWT_SECRET)
        res.send({"msg" : "Login Successful" , "token" : token})
    }
    else{
        res.send("Login failed.")
    }
})

app.get("/reports" , async(req,res) => {
    const token = req.headers.authorization.split(" ")[1]
    if(!token){
        return res.send("Please login")
    }
    jwt.verify(token , process.env.JWT_SECRET , function(err , decoded) {
        if(decoded){
            res.send("Here are the reports")
        }
        else{
            res.send("Please login")
        }
    })
})

app.listen(8000,async() => {
    try{
        await connection
        console.log("Connected to mongoDB successfully")
    }catch(e){
        console.log("Error while connecting to DB")
        console.log(e)
    }
    console.log("Server started successfully")
})