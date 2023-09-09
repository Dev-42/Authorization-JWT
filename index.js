const express = require('express')
const {connection} = require('./db')
const {UserModel} = require("./User.model")
const app = express()

app.use(express.json())

app.post('/signup' , async(req,res) => {
    const {email,password,name,age} = req.body
    const new_user = new UserModel({
        email : email,
        password : password,
        name : name,
        age : age
    })
    await new_user.save()
    res.send("Signup successful")
})

app.post('/login' , async(req,res) => {
    const{email,password} = req.body

    const user = await UserModel.findOne({email,password})
    console.log(user)
    if(user){
        res.send("Login Successful")
    }
    else{
        res.send("Login failed")
    }
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