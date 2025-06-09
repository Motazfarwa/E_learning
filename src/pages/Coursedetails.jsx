import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Card, Input, Button, List, Avatar } from 'antd';
import { HomeOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { FiMenu, FiX, FiArrowLeft } from 'react-icons/fi';
import logo from "../assets/51031-removebg-preview.png";

const { Header, Sider, Content, Footer } = Layout;
const { TextArea } = Input;

const backgroundImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c7983?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01608902b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
];

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const fullname = localStorage.getItem('FullName');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImg(backgroundImages[randomIndex]);

    axios.get(`http://localhost:4000/api/courses/${id}`)
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des détails du cours');
        setLoading(false);
      });

    axios.get(`http://localhost:4000/api/courses/${id}/comments`)
      .then((response) => setComments(response.data))
      .catch(() => console.error("Erreur lors du chargement des commentaires"));
  }, [id]);

  const handleCommentSubmit = (type) => {
    if (!newComment.trim()) return;

    const newCommentData = { text: newComment, type, userId: fullname };

    axios.post(`http://localhost:4000/api/courses/${id}/comments`, newCommentData, { withCredentials: true })
      .then(() => {
        setNewComment("");
        axios.get(`http://localhost:4000/api/courses/${id}/comments`)
          .then((response) => setComments(response.data))
          .catch(() => console.error("Erreur lors du chargement des commentaires mis à jour"));
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          console.error("Erreur lors de l'envoi du commentaire");
        }
      });
  };

  if (loading) return <p className="text-center text-2xl font-bold">Chargement...</p>;
  if (error) return <p className="text-center text-xl text-red-600">{error}</p>;

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="w-full h-[400px] md:h-[600px] absolute top-0 left-0 opacity-20 overflow-hidden">
        {backgroundImg && (
          <img src={backgroundImg} alt="Background" className="w-full h-full object-cover" />
        )}
        <div className="absolute left-0 bottom-0 w-full h-[200px] bg-gradient-to-t from-purple-900 to-transparent opacity-80"></div>
      </div>

      {/* Header */}
      <Header className="relative z-20 bg-white/90 backdrop-blur-sm shadow-md p-3 flex justify-between items-center fixed w-full top-0">
        <img className="w-12 h-8" src={logo} alt="Logo" />
        <button className="md:hidden text-gray-800 text-xl" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiMenu /> : <FiX />}
        </button>
        <nav className="hidden md:flex space-x-4">
          
          
          <Link to="/profile" className="text-gray-800 font-medium hover:text-purple-600">Profil</Link>
        </nav>
      </Header>

      

      {/* Main Content */}
      <Content className="relative z-10 pt-14 pb-8 pl-0 md:pl-48 max-w-3xl mx-auto px-4">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">{course.nom}</h1>
          {course.courseimagefile && (
            <img
              src={`http://localhost:4000/uploads/${course.courseimagefile}`}
              alt={course.nom}
              className="w-full h-56 object-cover rounded-md mt-3"
            />
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Description */}
          <Card className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">À propos</h2>
            <p className="text-gray-700 text-base">{course.description}</p>
          </Card>

          {/* Files */}
          {course.file && Array.isArray(course.file) && course.file.length > 0 && (
            <div>
              {course.file.map((file, index) => {
                if (file.endsWith('.mp4')) {
                  return (
                    <Card key={index} className="bg-white rounded-lg shadow-sm p-4 mb-4">
                      <h2 className="text-lg font-medium text-gray-900 mb-2">Vidéo</h2>
                      <div className="flex justify-center">
                        <video controls className="w-full max-w-lg rounded-md">
                          <source src={`http://localhost:4000/uploads/${file}`} type="video/mp4" />
                        </video>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-base font-medium text-gray-900 mb-2">Commentaires</h3>
                        <List
                          dataSource={comments.filter(c => c.type === 'video')}
                          renderItem={(comment) => (
                            <List.Item className="py-2">
                              <span className="text-gray-700">{comment.text}</span>
                            </List.Item>
                          )}
                        />
                        <TextArea
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ajouter un commentaire..."
                          className="mt-2 rounded-md border-gray-300 focus:ring-2 focus:ring-purple-600 w-full"
                        />
                        <Button
                          type="primary"
                          onClick={() => handleCommentSubmit('video')}
                          className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                        >
                          Envoyer
                        </Button>
                      </div>
                    </Card>
                  );
                }
                if (file.endsWith('.pdf')) {
                  return (
                    <Card key={index} className="bg-white rounded-lg shadow-sm p-4 mb-4">
                      <h2 className="text-lg font-medium text-gray-900 mb-2">Document</h2>
                      <a
                        href={`http://localhost:4000/uploads/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 font-medium hover:underline block mb-2"
                      >
                        📄 Télécharger
                      </a>
                      <div className="mt-4">
                        <h3 className="text-base font-medium text-gray-900 mb-2">Commentaires</h3>
                        <List
                          dataSource={comments.filter(c => c.type === 'pdf')}
                          renderItem={(comment) => (
                            <List.Item className="py-2">
                              <div className="flex items-center gap-2">
                                <Avatar size={16} icon={<UserOutlined />} className="text-gray-600" />
                                <span className="text-gray-700">{comment.userId}: {comment.text}</span>
                              </div>
                            </List.Item>
                          )}
                        />
                        <TextArea
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ajouter un commentaire..."
                          className="mt-2 rounded-md border-gray-300 focus:ring-2 focus:ring-purple-600 w-full"
                        />
                        <Button
                          type="primary"
                          onClick={() => handleCommentSubmit('pdf')}
                          className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                        >
                          Envoyer
                        </Button>
                      </div>
                    </Card>
                  );
                }
                return <p key={index} className="text-gray-500 text-base">Format non supporté</p>;
              })}
            </div>
          )}

          {/* Back Button */}
          <div className="text-center mt-6">
            <Link
              to="/getcours"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              <FiArrowLeft size={16} />
              <span>Retour</span>
            </Link>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="bg-white shadow-sm text-center py-2 mt-6">
        <p className="text-gray-600 text-sm">© 2025 My Courses</p>
      </Footer>
    </div>
  );
};

export default CourseDetails;