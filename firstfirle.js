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
app.delete("/user/:firstName",async(req,res)=>{
    try{
        const {firstName} = req.params
        const user = await User.findOneAndDelete({firstName:firstName})
      
       if(user){
        res.status(200).json({message:`deleted the username with ${firstName}`})
       }
       else{
        res.status(404).json({message:"could't find the user"})
       }

    }
    catch(error){
        console.log("error finding the user",error)
    }
})

app.get("/user/alldata",async (req,res)=>{
    try {
        const students = await User.find();
        console.log(students);  // Log data to confirm the structure
    const html = `
    <h1>Student List</h1>
    <ul>
        ${students.map(student => `
            <li>
                <strong>Name:</strong> ${student.firstName || student.name || "N/A"} <br>
                ${student.age ? `<strong>Age:</strong> ${student.age} <br>` : ""}
                ${student.gpa ? `<strong>GPA:</strong> ${student.gpa} <br>` : ""}
                ${student.fullTime !== undefined ? `<strong>Full Time:</strong> ${student.fullTime} <br>` : ""}
                ${student.email ? `<strong>Email:</strong> ${student.email} <br>` : ""}
                ${student.registrationDate ? `<strong>Registration Date:</strong> ${new Date(student.registrationDate).toLocaleDateString()} <br>` : ""}
                ${student.graduationDate ? `<strong>Graduation Date:</strong> ${new Date(student.graduationDate).toLocaleDateString()} <br>` : ""}
                ${student.courses ? `<strong>Courses:</strong> ${student.courses.join(", ")} <br>` : ""}
                ${student.address ? `
                    <strong>Address:</strong> ${student.address.street || "Unknown Street"}, 
                    ${student.address.city || "Unknown City"}, 
                    ${student.address.zip || "Unknown ZIP"} <br>
                ` : ""}
            </li>
            <br>
        `).join('')}
    </ul>
`;
res.send(html);
} 
catch (error) {
res.status(500).send("Error fetching data");
}

}
)

app.listen(3000,()=>{
    console.log("server has started on port 3000")
})