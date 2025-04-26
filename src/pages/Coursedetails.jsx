import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Card, Input, Button, List, message } from 'antd';
import { HomeOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { filterComment } from '../utils/ToxicityFilter';

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [videoComment, setVideoComment] = useState('');
  const [pdfComment, setPdfComment] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const API_TOKEN = process.env.REACT_APP_HF_TOKEN;

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/courses/${id}/comments`)
      .then((response) => {
        setComments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erreur lors du chargement des commentaires');
        setLoading(false);
        console.error('Erreur:', err);
      });

    axios
      .get(`http://localhost:4000/api/courses/${id}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((err) => console.error('Erreur lors du chargement du cours:', err));
  }, [id]);

  const fullname = localStorage.getItem('FullName');

  const handleCommentSubmit = async (type, commentText) => {
    if (!commentText.trim()) {
      message.error('Le commentaire ne peut pas être vide.');
      return;
    }

    if (!API_TOKEN) {
      message.error('Token Hugging Face manquant.');
      return;
    }

    const result = await filterComment(commentText, API_TOKEN, { block: true });
    if (!result.isValid) {
      message.error(result.message);
      return;
    }

    const newCommentData = {
      text: result.comment,
      type,
      username: fullname,
      userId: fullname, // Ajuste selon ton modèle User
    };

    try {
      await axios.post(`http://localhost:4000/api/courses/${id}/comments`, newCommentData, {
        withCredentials: true,
      });
      if (type === 'video') setVideoComment('');
      if (type === 'pdf') setPdfComment('');
      const response = await axios.get(`http://localhost:4000/api/courses/${id}/comments`);
      setComments(response.data);
      message.success('Commentaire ajouté avec succès.');
    } catch (err) {
      console.error('Erreur lors de l\'envoi du commentaire:', err);
      message.error('Erreur lors de l\'envoi du commentaire.');
    }
  };

  if (loading)
    return <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Chargement des détails du cours...</p>;
  if (error)
    return <p style={{ textAlign: 'center', color: 'red', fontSize: '18px' }}>{error}</p>;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={styles.sider}>
        <div style={styles.logo}>Mes Cours</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            { key: '1', icon: <HomeOutlined />, label: <Link to="/">Accueil</Link> },
            { key: '2', icon: <BookOutlined />, label: <Link to="/courses">Cours</Link> },
            { key: '3', icon: <UserOutlined />, label: <Link to="/profile">Profil</Link> },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={styles.header}>Détails du Cours</Header>
        <Content style={styles.content}>
          <Card title={course?.nom} variant="outlined" style={styles.card}>
            {course?.courseimagefile && (
              <div style={styles.imageContainer}>
                <img
                  src={`http://localhost:4000/uploads/${course.courseimagefile}`}
                  alt={course.nom}
                  style={styles.image}
                />
              </div>
            )}
            <p style={styles.description}>{course?.description}</p>
            {course?.file && Array.isArray(course.file) && course.file.length > 0 && (
              <div style={styles.fileContainer}>
                {course.file.map((file, index) => {
                  if (file.endsWith('.mp4')) {
                    return (
                      <div key={index} style={styles.fileItem}>
                        <h4 style={styles.fileTitle}>Vidéo de cours</h4>
                        <div style={styles.videoContainer}>
                          <video controls style={styles.video}>
                            <source src={`http://localhost:4000/uploads/${file}`} type="video/mp4" />
                          </video>
                        </div>
                        <div style={styles.commentSection}>
                          <h4>Commentaires sur la vidéo</h4>
                          <List
                            dataSource={comments.filter((c) => c.type === 'video')}
                            renderItem={(comment) => (
                              <List.Item className="comment-item">
                                <div className="comment-content">
                                  <div className="comment-header">
                                    <Avatar size={16} icon={<UserOutlined />} className="comment-icon" />
                                    <span className="comment-username">{comment.username}</span>
                                  </div>
                                  <p className="comment-text">{comment.text}</p>
                                </div>
                              </List.Item>
                            )}
                          />
                          <TextArea
                            rows={3}
                            value={videoComment}
                            onChange={(e) => setVideoComment(e.target.value)}
                            placeholder="Ajouter un commentaire pour la vidéo..."
                            style={styles.textArea}
                          />
                          <Button
                            type="primary"
                            onClick={() => handleCommentSubmit('video', videoComment)}
                            style={styles.submitButton}
                          >
                            Poster le commentaire vidéo
                          </Button>
                        </div>
                      </div>
                    );
                  }
                  if (file.endsWith('.pdf')) {
                    return (
                      <div key={index} style={styles.fileItem}>
                        <h4 style={styles.fileTitle}>Document du cours</h4>
                        <a
                          href={`http://localhost:4000/uploads/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.downloadLink}
                        >
                          📂 Télécharger le PDF
                        </a>
                        <div style={styles.commentSection}>
                          <h4>Commentaires sur le PDF</h4>
                          <List
                            dataSource={comments.filter((c) => c.type === 'pdf')}
                            renderItem={(comment) => (
                              <List.Item className="comment-item">
                                <div className="comment-content">
                                  <div className="comment-header">
                                    <Avatar size={16} icon={<UserOutlined />} className="comment-icon" />
                                    <span className="comment-username">{comment.username}</span>
                                  </div>
                                  <p className="comment-text">{comment.text}</p>
                                </div>
                              </List.Item>
                            )}
                          />
                          <TextArea
                            rows={3}
                            value={pdfComment}
                            onChange={(e) => setPdfComment(e.target.value)}
                            placeholder="Ajouter un commentaire pour le PDF..."
                            style={styles.textArea}
                          />
                          <Button
                            type="primary"
                            onClick={() => handleCommentSubmit('pdf', pdfComment)}
                            style={styles.submitButton}
                          >
                            Poster le commentaire PDF
                          </Button>
                        </div>
                      </div>
                    );
                  }
                  return <p key={index} style={styles.noFileText}>Format de fichier non supporté.</p>;
                })}
              </div>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

const styles = {
  sider: { background: '#001529', width: 240 },
  logo: { color: '#fff', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', padding: '20px' },
  header: { background: '#1890ff', color: '#fff', fontSize: '24px', textAlign: 'center', padding: '15px' },
  content: { margin: '20px', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
  card: { textAlign: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', borderRadius: '10px', padding: '20px' },
  description: { fontSize: '18px', color: '#333', marginBottom: '15px' },
  imageContainer: { marginBottom: '20px', display: 'flex', justifyContent: 'center' },
  image: { width: '100%', maxWidth: '600px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
  fileContainer: { marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '10px' },
  fileItem: { marginBottom: '15px', padding: '15px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' },
  videoContainer: { display: 'flex', justifyContent: 'center' },
  video: { width: '80%', maxWidth: '800px', borderRadius: '10px' },
  downloadLink: { fontSize: '16px', color: '#1890ff', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' },
  noFileText: { fontSize: '16px', color: '#888' },
  commentSection: { marginTop: '20px', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: '#f9f9f9' },
  textArea: { marginTop: '10px', borderRadius: '5px', fontSize: '16px', padding: '10px', width: '100%' },
  submitButton: { marginTop: '10px', width: '100%', backgroundColor: '#1890ff', borderColor: '#1890ff', fontSize: '16px', fontWeight: 'bold', borderRadius: '5px' },
  fileTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' },
};

export default CourseDetails;