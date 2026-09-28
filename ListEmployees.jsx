import React, { Component } from 'react'
import axios from 'axios'
const API_URL = "http://localhost:3002/employees";
export default class ListEmployees extends Component {

    constructor(props) {
        super(props)

        this.state = {
            employees: [],
            loading: true,
            error: null,
            id: null,
            name: '',
            salary: '',
            address: '',
            isEditing: false
        }
    }
    //1.Read :fetch all the employees using API call
    componentDidMount() {
        this.fetchEmployees();
    }
    //fetch employees by hitting api
    fetchEmployees = () => {
        axios.get(API_URL).then(response => {
            console.log(response)
            this.setState({
                employees: response.data,
                loading: false,
                error: null
            })
        }).catch(err => {
            this.setState({
                error: 'failed to fetch employees' + err.message,
                loading: false
            })
            console.log(this.state.error)
        })
    }

    //2.delete employee
    handleDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete the employee ?')) {
            axios.delete(`${API_URL}/${id}`)
                .then(() => {
                    this.setState(prevState => ({
                        employees: prevState.employees.filter(emp => emp.id !== id)
                    }))
                }).catch(err => alert("Delete failed"))
        }
    }
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { id, name, salary, address, isEditing } = this.state
        const employeeData = { name, salary: Number(salary), address }
        if (isEditing) {
            axios.put(`${API_URL}/${id}`, employeeData).
                then(response => {
                    this.setState(prevState => ({
                        employees: prevState.employees.map(emp => emp.id === id ? response.data : emp)
                    }))
                    this.resetForm();
                })
                .catch(err => alert("Update Failed " + err.message))
        }
        else {
            axios.post(API_URL, employeeData).
                then(response => {
                    this.setState(prevState => ({
                        employees: [...prevState.employees, response.data]
                    }))
                    this.resetForm();
                })
                .catch(err => alert("Update Failed " + err.message))
        }
    }
    handleEditClick = (emp) => {
        this.setState({
            id: emp.id,
            name: emp.name,
            salary: emp.salary,
            address: emp.address,
            isEditing: true

        })

    }

    resetForm = () => {
        this.setState({
            id: null,
            name: "",
            salary: "",
            address: "",
            isEditing: false
        })
    }



    render() {
        const { employees, loading, error, name, salary, address, isEditing } = this.state
        if (loading) return <h3>Loading Employees....</h3>
        if (error) return <h3 style={{ color: "red" }}>{error}</h3>
        return (
            <div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <h3>{isEditing ? "EDIT EMPLOYEE" : "Add New Employee"}</h3>
                        <input type="text" name="name" value={name} placeholder="Employee Name" onChange={this.handleInputChange} required></input>
                        <input type="number" name="salary" value={salary} placeholder="Employee Salary" onChange={this.handleInputChange} required></input>
                        <input type="text" name="address" value={address} placeholder="Employee Address" onChange={this.handleInputChange} required></input>
                        <button type="submit" className='btn btn-primary'>{isEditing ? "UpdateEmployee" : "AddEmployee"}</button>
                        {isEditing && (<button type="button" className='btn btn-danger' onClick={this.resetForm}>Reset</button>)}
                    </form>

                </div>
                <div>
                    <h2>Employees List</h2>
                    <table className='table  table-hover'>
                        <thead>
                            <tr className='table-dark'>
                                <th>EmployeeId</th>
                                <th>EmployeeName</th>
                                <th>Salary</th>
                                <th>Address</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id} className='table-primary'>
                                    <td>{emp.id}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.salary}</td>
                                    <td>{emp.address}</td>
                                    <td><i className="fa-solid fa-trash" onClick={() => this.handleDeleteClick(emp.id)}></i>
                                        <i className="fa-solid fa-pen-to-square" onClick={() => this.handleEditClick(emp)}></i></td>

                                </tr>
                            ))}

                        </tbody>
                    </table>

                </div>
            </div>

        )
    }
}
