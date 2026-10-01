import axios from 'axios'
import React, { useEffect, useState } from 'react'

const API_URL = "http://localhost:2026/products"
const ProductsCrud = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    //form data
    const [formState, setFormState] = useState({
        id: null,
        name: '',
        price: '',
        category: '',
        stock: '',
        isEditing: false
    })
    //1.fetch all products
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = () => {

        axios.get(API_URL).then(response => {
            setProducts(response.data)
            setLoading(false)
            setError(null)
        })
            .catch(err => {
                setError("failed load products")
                setLoading(false)
            })

    }
    const handleEdit = (product) => {
        setFormState({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        isEditing: true
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const {id ,name,price,category,stock,isEditing}=formState

        const productPayload={
            name,
            price:Number(price),
            category,
            stock:Number(stock)
        }
        if(isEditing){
            axios.put(`${API_URL}/${id}`,productPayload)
            .then(response=>{
                setProducts(prev=>prev.map(item=>item.id===id?response.data:item))
               resetForm() 
            })
            .catch(err=>alert("Update Failed",err.message))
        }
        else{
            axios.post(API_URL,productPayload)
               .then(response=>{
                setProducts(prev=>[...prev,response.data])
               resetForm() 
            })
            .catch(err=>alert("Create Failed",err.message))
        }


    }
    const handleDelete = (id) => {
        console.log(id)
        if (window.confirm("Are your sure you want delete product?")) {
            console.log(id)
            axios.delete(`${API_URL}/${id}`)
                .then(() => {
                    setProducts(prev => prev.filter(item => item.id !== id));
                    console.log("pid", id)
                })
                .catch(err => alert("Delete failed" + err.message))
        }
    }
    const handleInputChange = (e) => {
        const {name,value}=e.target;
        setFormState(prevState=>({
            ...prevState,[name]:value
        }))

    }
    const resetForm = () => {
        setFormState({
            id: null,
            name: '',
            price: '',
            category: '',
            stock: '',
            isEditing: false
        })
    }

    return (
        <div>
            <h2>Functional Component with state</h2>
            <form onSubmit={handleSubmit}>
                <h3>{formState.isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                <input type="text" name="name" value={formState.name} placeholder="Product Name" onChange={handleInputChange} required></input>
                <input type="number" name="price" value={formState.price} placeholder="Price" onChange={handleInputChange} required></input>
                <input type="text" name="category" value={formState.category} placeholder="Product Category" onChange={handleInputChange} required></input>
                <input type="number" name="stock" value={formState.stock} placeholder="Product Stock" onChange={handleInputChange} required></input>

                <button type="submit">{formState.isEditing ? 'Update Product' : 'Add New Product'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>

            </form>

            <div>
                <table className='table table hover'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)}>Edit</button>
                                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default ProductsCrud
