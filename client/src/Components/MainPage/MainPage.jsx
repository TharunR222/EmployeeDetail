import React, { useEffect } from 'react'
import { useState } from 'react'
import './MainPage.css'

const MainPage = () => {

  const [formData, setFormData] = useState({ eid: '', fname: '', lname: '', dept: '', desig: '', salary: '', dob: '' });
  const [showData, setShowData] = useState([]);
  const [editingItem, setEditingItem] = useState(false);

  const handleEdit = async (e, p1) => {
    setEditingItem(true);
    let response = await fetch(`https://employee-detail.onrender.com/updData/${p1}`, {
      method: 'GET'
    });
    let res = await response.json();
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...res
    }));
  }

  const handleDelete = async (e, p1) => {
    let response = await fetch(`https://employee-detail.onrender.com/updData/${p1}`, {
      method: 'DELETE'
    });
    let res = await response.json();
    setShowData(res.data);
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData, [name]: value
    }))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var value = true;
    var valid = true;
    for (const key in formData) {
      if (`${formData[key]}`.trim() == '') {
        value = false;
        setFormData((prevFormData) => ({
          ...prevFormData, [key]: ''
        }))
      } else if ((key != 'dob' && key != 'salary' && key != 'eid') && `${formData[key]}`.match(/[^a-zA-Z\s]+$/) != null) {
        valid = false;
        alert(`${key} must contain only alphabets`);
        setFormData((prevFormData) => ({
          ...prevFormData, [key]: ''
        }))
      } else if ((key == 'salary' || key == 'eid') && `${formData[key]}`.match(/^[0-9]+$/) == null) {
        valid = false;
        alert(`${key} must contain only numbers`);
        setFormData((prevFormData) => ({
          ...prevFormData, [key]: ''
        }))
      }
    }
    if (value == false) {
      alert("Please fill out the blank fields");
    }
    if (value && valid) {
      console.log(formData);
      const func = async () => {
        let response = await fetch("https://employee-detail.onrender.com/postData", {
          method: editingItem ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        let res = await response.json();
        return res;

      }
      func()
        .then(res => {
          setShowData(res.data);
        })
        .then(res => {
          for (const key in formData) {
            setFormData((prevFormData) => ({ ...prevFormData, [key]: '' }))
          }
          setEditingItem(false);
        });
    }
  };

  return (
    <div className='main-block'>
      <div className="form-block">
        <h2>Employee Detail Entry</h2>
        <form onSubmit={handleSubmit}>
          Employee ID:<input type='text' name='eid' value={formData.eid} onChange={handleChange} required />
          First Name:<input type='text' name='fname' value={formData.fname} onChange={handleChange} required />
          Last Name:<input type='text' name='lname' value={formData.lname} onChange={handleChange} required />
          Department:<input type='text' name='dept' value={formData.dept} onChange={handleChange} required />
          Designation:<input type='text' name='desig' value={formData.desig} onChange={handleChange} required />
          Salary:<input type='text' name='salary' value={formData.salary} onChange={handleChange} required />
          DOB:<input type='date' name='dob' value={formData.dob} onChange={handleChange} required />
          <input type='submit' className='submit' />
        </form>
      </div>
      <div className="show-block">
        <h2>Employee Detail</h2>
        <table>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Date of Birth</th>
            <th>Changes</th>
          </tr>
          {
            showData.length > 0 &&
            showData.map((element, index) => {
              return (<tr key={index}>
                <td>{element.eid}</td>
                <td>{element.fname}</td>
                <td>{element.lname}</td>
                <td>{element.dept}</td>
                <td>{element.desig}</td>
                <td>{element.salary}</td>
                <td>{element.dob}</td>
                <td className='change-cell'>
                  <button className='edit' onClick={e => handleEdit(e, element.eid)}>Edit</button>
                  <button className='delete' onClick={e => handleDelete(e, element.eid)}>Delete</button>
                </td>
              </tr>)
            })
          }
        </table>
      </div>
    </div>
  )
}

export default MainPage