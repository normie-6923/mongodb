const tasktext = document.querySelector("#tasktext")
const taskadder = document.querySelector("#taskadder")
const tasks = document.querySelector("#allTasks")
const clearTask = document.querySelector("#clearitem")


// let inc = 0
// function taskrec(){
//     if(tasktext.value === ""){
//         alert("please enter a task")
//         return;
//     }
    
//     const taskitem = document.createElement("div")
    
//     taskitem.classList.add(`taskitem`)
//     tasks.appendChild(taskitem)

   

//     const taskspan = document.createElement("span")
//     taskspan.textContent = tasktext.value
//     taskspan.classList.add("taskspan")
//     taskitem.appendChild(taskspan)
 
//     const taskdelbutton = document.createElement("button")
//     taskdelbutton.textContent = "✅"
//     taskdelbutton.classList.add("taskdelbutton")
//     taskitem.appendChild(taskdelbutton)

//     tasktext.value = ""


//     taskdelbutton.addEventListener("click",()=>{
//         taskspan.classList.toggle("completed")
//     })
//     inc++
//     tasktext.value = ""

//     clearTask.addEventListener("click",()=>{
//         tasks.innerHTML = "<h1>TASKS</h1>"
//     })
// }


// taskadder.addEventListener("click",taskrec)

async function loadTask() {
     const response = await fetch("http://localhost:3000/tasks");
     const data = await response.json();
     tasks.innerHTML = `<h1>TASKS</h1>`;
 
     data.forEach((task) => {
         const taskitem = document.createElement("div");
         taskitem.classList.add("taskitem");
 
         const taskspan = document.createElement("span");
         taskspan.textContent = task.text;
         taskspan.classList.add("taskspan");
 
         // If the task is marked as completed, add the 'completed' CSS class
         if (task.completed) {
             taskspan.classList.add("completed");
         }
 
         const taskdelbutton = document.createElement("button");
         taskdelbutton.textContent = "✅";
         taskdelbutton.classList.add("taskdelbutton");
 
         // Toggle completion on click (without deleting the task)
         taskdelbutton.addEventListener("click", async () => {
             await fetch(`http://localhost:3000/tasks/${task._id}`, {
                 method: "PUT",
             });
             loadTask();  // Reload tasks after updating
         });
 
         taskitem.appendChild(taskspan);
         taskitem.appendChild(taskdelbutton);
         tasks.appendChild(taskitem);
     });
 }
 
 taskadder.addEventListener("click", async () => {
     if (tasktext.value === "") {
         alert("Please enter a task you want to perform");
         return;
     }
 
     await fetch("http://localhost:3000/tasks", {
         method: "POST",
         headers: {
             "Content-Type": "application/json",
         },
         body: JSON.stringify({ text: tasktext.value }),
     });
 
     tasktext.value = "";
     loadTask();  // Reload tasks after adding new task
 });
 
 clearTask.addEventListener("click", async () => {
     // Send a DELETE request to delete all tasks
     const response = await fetch("http://localhost:3000/tasks", {
         method: "DELETE",
     });
 
     if (response.ok) {
         // Reset the task list on the UI
         tasks.innerHTML = `<h1>TASKS</h1>`;
         loadTask();  // Reload tasks (this will be empty now)
     } else {
         console.log("Error deleting tasks");
     }
 });
 loadTask();