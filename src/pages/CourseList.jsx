import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/courses")
      .then(response => setCourses(response.data))
      .catch(error => console.error("Erreur de récupération :", error));
  }, []);

  return (
    <div>
      <h2>Liste des cours</h2>
      <ul>
        {courses.map(course => (
          <li key={course._id}>
            <Link to={`/cours/${course._id}`}>
              <strong>{course.title}</strong> - {course.instructor}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;

