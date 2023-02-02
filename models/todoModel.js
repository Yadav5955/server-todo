const mongoose=require("mongoose")
const todoSchema= new mongoose.Schema({
    username:String,
    activity:String,
    status:String,
    timetaken:String,
    action:String,
    starttime:String,
    endtime:String
})
const ToDoModel=mongoose.Schema('todoList',todoSchema)
module.exports=ToDoModel