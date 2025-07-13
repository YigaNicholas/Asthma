//https://api.restful-api.dev/objects
//{
   //"name": "Apple MacBook m4",
   //"data": {
      //"year": 2025,
      //"price": 1849.99,
      //"CPU model": "m-chip",
    //  "Hard disk size": "1 TB"
  // }
//}

import { useState } from "react"

function Api(){
    const[data, setData]= useState({
        name:'',
        year:'',
        price:'',
        cpu:'',
        disk:''

    })
    const[response, setResponse]= useState(null)
    const[error, setError]= useState('')
    
    
 
    const postdata= async(e)=>{
        e.preventDefault();
        setError('')
        setResponse(null);
        try{
        const res= await fetch('https://api.restful-api.dev/objects',{
            method:'POST',
            headers:{
                'content-type': 'application/json'
            },
            body:JSON.stringify({
                name: data.name,
                data: {
                    "year":Number(data.year),
                    "price": Number(data.price),
                    "CPU model":data.cpu,
                    "Hard disk size": data.disk
                }
            })

            
            

        })
        if(!res.ok) throw new Error("failed to post data");
        const result= await res.json()
        setResponse(result)
        console.log (result)
        setData({name:'',
        year:'',
        price:'',
        cpu:'',
        disk:''})

        }catch(error){
            setError(error)
        }
    }

    const handlechange= (e)=>{
     setData({...data,[e.target.name]:e.target.value})
    }




    return(
        
            <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Post Product to API</h2>
      <form onSubmit={postdata} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={data.name}
          onChange={handlechange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={data.year}
          onChange={handlechange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={data.price}
          onChange={handlechange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="cpu"
          placeholder="CPU Model"
          value={data.cpu}
          onChange={handlechange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="disk"
          placeholder="Hard Disk Size"
          value={data.disk}
          onChange={handlechange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {response && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          <strong>Response:</strong>
          <pre className="text-sm overflow-auto">{JSON.stringify(response, null, 2)}</pre>
          
          
        </div>
      )}
    </div>
            
    
    )
}

export default Api