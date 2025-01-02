//using express
const express = require ('express');
const mongoose = require('mongoose');
const cors = require('cors');

//create an instance of express
const app = express();
app.use(express.json());
app.use(cors())

//connecting Mongo DB
mongoose.connect('mongodb://localhost:27017/to-do-app')
.then(()=>console.log("DB connected"))
.catch((err)=>console.log("DB connection error :"+err))

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required : true,
        type: String,
    },
    description: String,
})
//creating model
const todoModal = mongoose.model('Todo',todoSchema)

//defining routes - create a new todo item (POST)
app.post('/todos', async(req,res)=>{
    const {title, description} = req.body;
    try{
        const newTodo = new todoModal({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
})

//defining routes - get all todo item (GET)
app.get('/todos',async(req,res)=>{
    try{
        const todos = await todoModal.find();
        res.json(todos);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
})

//defining routes - Update existing todo item (PUT)
app.put('/todos/:id', async(req,res) => {
   try{
    const {title, description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModal.findByIdAndUpdate(
        id, 
        {title, description},
        {new: true}
    )
    if(!updatedTodo){
        return res.status(404).json({ message:"Todo not found" });
    }
    else{
        res.json(updatedTodo)
    }
   }
   catch(err){
    console.log(err);
    res.status(500).json({message: err.message});
   }
})

//defining routes - delete existing todo item (DELETE)
app.delete('/todos/:id', async(req,res)=>{
    try{
        const id = req.params.id;
        await todoModal.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
})

//setup port to  start server
const port = 8000;
app.listen(8000, ()=>{
    console.log("Server lising to port:"+ port);
});