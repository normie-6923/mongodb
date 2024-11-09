const express =  require("express")
const mongoose = require("mongoose")
const app = express()
//connection
mongoose.connect("mongodb://localhost:27017/school")
.then(()=>console.log("your Mongodb is connected"))
.catch((err)=>console.log("Error:",err))
//schema

const userSchema = new mongoose.Schema({
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    email: { required: true, unique: true, type: String }
});
const User = mongoose.model('students',userSchema)

app.use(express.urlencoded({extended:false}))
app.use(express.json())



app.get("/user",async(req,res)=>{
    console.log("user hit this route")
try{
    const users = await User.find()
    res.status(200).send(users)
}
catch(err){
res.status(500).send("error fetchin file",err)
}
})
app.post("/user",async(req,res)=>{
try{
   newusers = new User({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email
   })

   const savedData = await newusers.save()
   res.status(200).json(savedData)

}
catch(error){
    console.log("erro",error)
}
})

app.patch("/user/:firstName",async(req,res)=>{
 try{
    const {firstName} = req.params

    const user = await User.findOne({firstName})

    if(!user){
        res.status(404).send("couldn't find the user to update")
    }
 
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
    
const updateuser = await user.save()
res.status(200).json(updateuser)
}
catch(err){
    console.log("error updating info",err)
}

})


app.listen(3000,()=>{
    console.log("server has started on port 3000")
})