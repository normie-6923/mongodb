const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")

const PORT = 3000 


app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/todo_db")
.then(()=>{
    console.log("mongodb connected")
})
.catch(error=>{
    console.log(error)
})
 


const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }  // Make sure this line matches
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
app.get("/tasks",async(req,res)=>{
    const tasks = await Task.find();
    res.json(tasks)
})
app.post("/tasks",async(req,res)=>{
    const newTask = new Task({
        text:req.body.text,
        completed:false,
    })
    await newTask.save()
    res.json(newTask)
})
app.delete("/tasks", async (req, res) => {
    try {
        const result = await Task.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No tasks found to delete" });
        }
        res.json({ message: "Deleted all the tasks" });
    } catch (error) {
        console.error("Error deleting tasks:", error);
        res.status(500).json({ message: "Error deleting tasks", error });
    }
});


app.put("/tasks/:id",async(req,res)=>{
const {id} = req.params
const task = await Task.findById(id)
task.completed = !task.completed
await task.save()
res.json(task);
})
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
});