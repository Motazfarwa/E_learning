import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/courses/${id}`)
      .then(response => setCourse(response.data))
      .catch(error => console.error("Erreur :", error));
  }, [id]);

  if (!course) return <p>Chargement...</p>;

  const isVideo = course.fileUrl && (course.fileUrl.endsWith(".mp4") || course.fileUrl.endsWith(".webm"));
  const isPdf = course.fileUrl && course.fileUrl.endsWith(".pdf");

  return (
    <div>
      <button onClick={() => navigate(-1)}>Retour</button>
      <h2>{course.title}</h2>
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Instructeur:</strong> {course.instructor}</p>
      <p><strong>Prix:</strong> {course.price} €</p>

      {course.fileUrl && (
        <div>
          {isVideo && (
            <video controls width="600">
              <source src={`http://localhost:4000/api/${course.fileUrl}`} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          )}

          {isPdf && (
            <iframe
              src={`http://localhost:4000/api/${course.fileUrl}`}
              width="600"
              height="500"
              title="Cours PDF"
            />
          )}

          <a href={`http://localhost:4000/api/${course.fileUrl}`} download>
            📥 Télécharger le fichier
          </a>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
