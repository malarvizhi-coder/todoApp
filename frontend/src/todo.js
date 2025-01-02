import { useEffect, useState } from "react"

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [editID, setEditId] = useState(-1);

    //Edit
    const [editTitle, setEditTitle] = useState("");
    const [editdescription, setEditDescription] = useState("");


    const apiUrl = "http://localhost:8000";

    //POST call - Create To do item
    const handleSubmit = ()=>{
        // Reset messages
            setMessage("");
            setError("");

        //check inputs
        if(title.trim()!=='' && description.trim()!==''){
            fetch(apiUrl+'/todos',{
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({title, description})
            }).then((res) => {
                if(res.ok){
                //add item to list and success message
                    setTodos([...todos, {title,description}]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item Added Successfully");
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                }
                else{
                //set error
                setError("Unable to create to do Item. Please try again.");
                setTimeout(()=>{
                    setMessage("");
                },3000)
                }
            }).catch(()=>{
                setError("Unable to create to do Item. Please try again.")
            })
        }
    }

    //GET call - list To do items
    useEffect(()=>{
        getItems()
    },[])


    const getItems = () =>{
        fetch(apiUrl+'/todos')
        .then((res)=>res.json())
        .then((res)=>{
            setTodos(res)
        })
    }

    //UPDATE call - list To do items
    const handleEdit = (item)=>{
        setEditId(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description);
    }

    const handleUpdate = ()=>{
        // Reset messages
          setMessage("");
          setError("");

        //check inputs
        if(editTitle.trim()!=='' && editdescription.trim()!==''){
            fetch(apiUrl+'/todos/'+editID, {
                method: "PUT",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({editTitle, editdescription})
            }).then((res) => {
                if(res.ok){
                //update item to list and success message
                    const updatedTodos = todos.map((item) => {
                        if(item._id === editID){
                            item.title = editTitle;
                            item.description = editdescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item Updated Successfully");
                    setTimeout(()=>{
                        setMessage("");
                    },2000)
                    setEditId(-1);
                }
                else{
                //set error
                setError("Unable to create to do Item. Please try again.");
                setTimeout(()=>{
                    setMessage("");
                },2000)
                }
            }).catch(()=>{
                setError("Unable to create to do Item. Please try again.")
            })
        }
    }

    const handleEditCancel = ()=> {
        setEditId(-1);
    }

    //DELETE call - list To do items
    const handleDelete = (id)=>{
        if(window.confirm("Are you sure you want to delete..?")){
            fetch(apiUrl+'/todos/'+id, {
                method: "DELETE",
            })
            .then(()=>{
                const updatedTodos = todos.filter((item)=> item._id !== id)
                setTodos(updatedTodos)
            })
        }
    }

    return <>
    <div class="row p-3 bg-success text-light">
        <h1>To Do Application</h1>
    </div>
    <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-3">
            <input className="form-control" onChange={(e)=> setTitle(e.target.value)} value={title} type="text" placeholder="Title" />
            <input className="form-control" onChange={(e)=> setDescription(e.target.value)} value={description} type="text" placeholder="Description" />
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <div className = "col-md-6">
            <ul className="list-group">
                {
                    todos.map((item)=> <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                    <div className="d-flex flex-column me-2">
                        {editID === -1 || editID !== item._id ? 
                        <>
                            <span className="fw-bold">{item.title}</span>
                            <span>{item.description}</span>
                        </> : 
                        <>
                        <div className="form-group d-flex gap-3">
                            <input value={editTitle} onChange={(e)=> setEditTitle(e.target.value)} type="text" placeholder="Title" />
                            <input value={editdescription} onChange={(e)=> setEditDescription(e.target.value)} type="text" placeholder="Description" />
                        </div>
                        </>
                        }
                        
                    </div>
                    <div className="d-flex gap-2">
                        { editID === -1 || editID !== item._id ? 
                            <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button> : 
                            <button className="btn btn-warning" onClick={handleUpdate}>Update</button>
                        }
                        {editID === -1 || editID !== item._id ? 
                            <button className="btn btn-danger" onClick={()=> handleDelete(item._id)}>Delete</button> : 
                            <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                        }
                    </div>
                </li>)
                }
            </ul>
        </div>
        
    </div>
    </>
}