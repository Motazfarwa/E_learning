import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Input, Form, Button } from 'antd';
import logo from "../assets/51031-removebg-preview.png";

const CourseList = () => {
  const [machines, setMachines] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [newFile, setNewFile] = useState(null); // For updated file
  const [newImageFile, setNewImageFile] = useState(null); // For updated image file
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [currentMachine, setCurrentMachine] = useState(null); // For holding the current machine details
    const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Fetching machines from the backend when component mounts
  useEffect(() => {  
    axios.get('http://localhost:4000/api/courses')
      .then((res) => {
        setMachines(res.data);
      })
      .catch((error) => console.error('Error fetching machines:', error));
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this course?');
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:4000/api/courses/${id}`);
        if (response.status === 200) {
          setMachines((prevMachines) => prevMachines.filter((machine) => machine._id !== id));
        } else {
          console.error('Error deleting course', response);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  // Handle opening the modal with the current machine details
  const handleUpdate = (machine) => {
    setCurrentMachine(machine); // Set current machine's details in state
    setShowModal(true); // Show the modal
  };

  // Handling form submission to update the machine
  const handleFormSubmit = async (values) => {
    if (!currentMachine?._id) {
      alert('Error: Machine ID is missing!');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('nom', values.nom);
      formData.append('description', values.description);
  
      if (newFile) formData.append('file', newFile);
      if (newImageFile !== undefined && newImageFile !== null) {
        formData.append('courseimagefile', newImageFile);
      }
  
      console.log('FormData:', [...formData.entries()]); // Debugging
  
      const response = await axios.put(`http://localhost:4000/api/courses/${currentMachine._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 200) {
        alert('Machine updated successfully!');
        setMachines((prevMachines) =>
          prevMachines.map((machine) => (machine._id === currentMachine._id ? response.data.machine : machine))
        );
        setShowModal(false);
      } else {
        alert('Error updating machine');
      }
    } catch (error) {
      console.error('Error updating machine:', error);
      alert('Error updating machine');
    }
  };
  
  

  return (
    <div>
       <div className="w-full bg-black shadow-md fixed top-0 left-0 z-50 flex items-center justify-between px-6 py-4">
       <img className="w-13 h-9" src={logo} alt="Logo" />
  
  <div className="cursor-pointer flex flex-col space-y-1" onClick={() => setIsOpen(!isOpen)}>
    <span className={`block w-8 h-1 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
    <span className={`block w-8 h-1 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
    <span className={`block w-8 h-1 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
  </div>
      </div>
          {/* Sidebar Navigation */}
    <div className={`fixed top-0 left-0 h-full w-64 bg-black p-6 pb-6 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-64'}`}>
    <ul className="text-white space-y-12">
  
    <li><a href="/Ajoutercour" className="block hover:text-gray-300 font-bold">Ajouter des cours</a></li>
    <li><a href="/Ajoutercour" className="block hover:text-gray-300 font-bold">Ajouter des cours</a></li>
    <li><a href="/cours" className="block hover:text-gray-300 font-bold">Details de cours</a></li>

    </ul>
    </div>

      <div style={{ paddingTop: '80px', textAlign: 'center' }}>
        <h2>Course List</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '20px', justifyContent: 'center' }}>
          {machines.length > 0 ? (
            machines.map((machine) => (
              <div key={machine._id} style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', textAlign: 'center' }}>
                {machine.courseimagefile ? (
                  <img src={`http://localhost:4000/uploads/${machine.courseimagefile}`} alt="Machine" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', display: 'block', marginBottom: '10px' }} onError={handleImageError} />
                ) : imageError ? (
                  <p style={{ color: 'red', marginTop: '10px' }}>Image not available</p>
                ) : (
                  <p style={{ color: 'gray', marginTop: '10px' }}>No image provided</p>
                )}

                <h3>{machine.nom}</h3>
                <p>{machine.description}</p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center', alignItems: 'center' }}>
                  <button onClick={() => navigate(`/cours/${machine._id}`)} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    View Details
                  </button>
                  <button onClick={() => handleDelete(machine._id)} style={{ padding: '10px 30px', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Delete
                  </button>
                  <button onClick={() => handleUpdate(machine)} style={{ padding: '10px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Update
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No  books details available.</p>
          )}
        </div>
      </div>

      {/* Modal for updating machine */}
      <Modal
        title="Update Machine"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null} // No footer buttons (we'll create custom ones)
      >
        <Form
          initialValues={{
            nom: currentMachine?.nom,
            description: currentMachine?.description,
          }}
          onFinish={handleFormSubmit}
        >
          <Form.Item label="Machine Name" name="nom">
            <Input defaultValue={currentMachine?.nom} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input defaultValue={currentMachine?.description} />
          </Form.Item>
          <Form.Item label="Book Image" name="courseimagefile">
            <input type="file" onChange={(e) => setNewImageFile(e.target.files[0])} />
          </Form.Item>
          <Form.Item label="Machine File" name="file">
            <input type="file" onChange={(e) => setNewFile(e.target.files[0])} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Book details
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseList;

