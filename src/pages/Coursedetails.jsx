import React, {  useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from "../assets/51031-removebg-preview.png";

const Coursedetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);  
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("Fetching data for ID:", id);
    if (!id) {
      console.error("Error: ID is undefined");
      return;
    }
  
    fetch(`http://localhost:4000/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Machine Data:", data); // Log the fetched data
        setMachine(data);
      })
      .catch((error) => console.error("Error fetching machine details:", error));
  }, [id]);
  

  if (!machine) {
    return <p>Loading...</p>;
  }



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Top Navigation */}
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
    <li><a href="/getcours" className="block hover:text-gray-300 font-bold">List des cours</a></li>
    </ul>
    </div>


      {/* Main Content */}
      <div className="mt-20 p-6 bg-white rounded-lg shadow-md w-96 text-center">
        {/* Display Image if available */}
        {machine.courseimagefile && !imageError ? (
          <img
            className="max-w-full h-auto rounded-lg mb-4"
            src={`http://localhost:4000/uploads/${machine.courseimagefile}`}
            alt="Machine"
            onError={() => setImageError(true)}
          />
        ) : imageError ? (
          <p className="text-red-500">Image not available</p>
        ) : null}

        {/* Machine Details */}
        <p className="mb-2"><strong>Nom:</strong> {machine.nom}</p>
        <p className="mb-4"><strong>Description:</strong> {machine.description}</p>

        {/* File Download */}
        {machine.file && (
          <div className="mb-4">
           <p className="mb-4"><strong>File:</strong> {machine.file}</p>
            <a href={`http://localhost:4000/api/download/${machine.file}`} download>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Download File</button>
            </a>
          </div>
        )}

        <button 
          onClick={() => navigate('/getcours')} 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Back to course list
        </button>
      </div>
    </div>
  );
  
};

export default Coursedetails ;
