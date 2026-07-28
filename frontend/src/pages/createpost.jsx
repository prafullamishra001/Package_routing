import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const CreatePost=()=>{
          const navigate = useNavigate();


          const handleSubmit=async(e)=>{
                    e.preventDefault();
                    const formData=new FormData(e.target)
                    await axios.post("http://localhost:3000/create-post",formData)
                    .then((res)=>{
                              navigate("/feed")
                    })
          }

          return(
                    <section className='create-post-section'>
<form onSubmit={handleSubmit}>
<h1>Create Post</h1>
          <input type="file" name="image" accept='image/*'/>
          <input type="text" name="caption" placeholder='Enter Caption' required/>
          <button type='submit'>Submit</button>
</form>
                    </section>
          )
}

export default CreatePost