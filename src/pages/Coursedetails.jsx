import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Card, Input, Button, List } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar } from "antd";


const { Header, Sider, Content } = Layout;
const { TextArea } = Input;

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/courses/${id}`)
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching course details');
        setLoading(false);
      });

    axios.get(`http://localhost:4000/api/${id}/comments`)
      .then((response) => setComments(response.data))
      .catch(() => console.error("Error fetching comments"));
  }, [id]);
  const fullname = localStorage.getItem('FullName')

const handleCommentSubmit = (type) => {
  if (!newComment.trim()) return;

  const newCommentData = { text: newComment, type, userId: fullname };

  axios.post(`http://localhost:4000/api/courses/${id}/comments`, newCommentData, { withCredentials: true })
    .then(() => {
      setNewComment("");

      axios.get(`http://localhost:4000/api/courses/${id}/comments`)
        .then((response) => setComments(response.data))
        .catch(() => console.error("Error fetching updated comments"));
    })
    .catch((error) => {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message); // Show message from backend
      } else {
        console.error("Error posting comment");
      }
    });
};

  
  if (loading) return <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>Loading course details...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>{error}</p>;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={styles.sider}>
        <div style={styles.logo}>My Courses</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<BookOutlined />}>
            <Link to="/courses">Courses</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={styles.header}>Course Details</Header>
        <Content style={styles.content}>
          <Card
            title={course.nom}
            bordered={false}
            style={styles.card}
          >
            {/* Centered Course Image */}
            {course.courseimagefile && (
              <div style={styles.imageContainer}>
                <img 
                  src={`http://localhost:4000/uploads/${course.courseimagefile}`} 
                  alt={course.nom} 
                  style={styles.image} 
                />
              </div>
            )}

            {/* Course Description */}
            <p style={styles.description}>{course.description}</p>

            {/* Files: Video and PDF */}
            {course.file && Array.isArray(course.file) && course.file.length > 0 && (
              <div style={styles.fileContainer}>
                {course.file.map((file, index) => {
                  // Video handling
                  if (file.endsWith('.mp4')) {
                    return (
                      <div key={index} style={styles.fileItem}>
                        <h4 style={styles.fileTitle}>Lecture Video</h4>
                        <div style={styles.videoContainer}>
                          <video controls style={styles.video}>
                            <source src={`http://localhost:4000/uploads/${file}`} type="video/mp4" />
                          </video>
                        </div>
                        {/* Video Comment Section */}
                        <div style={styles.commentSection}>
                          <h4>Video Comments</h4>
                          <List dataSource={comments.filter(c => c.type === 'video')} renderItem={(comment) => (
                            <List.Item>{comment.text}</List.Item>
                          )} />
                          <TextArea
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment for the video..."
                            style={styles.textArea}
                          />
                          <Button 
                            type="primary" 
                            onClick={() => handleCommentSubmit('video')} 
                            style={styles.submitButton}
                          >
                            Post Video Comment
                          </Button>
                        </div>
                      </div>
                    );
                  }
                  // PDF handling
                  if (file.endsWith('.pdf')) {
                    return (
                      <div key={index} style={styles.fileItem}>
                        <h4 style={styles.fileTitle}>Course Document</h4>
                        <a 
                          href={`http://localhost:4000/uploads/${file}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={styles.downloadLink}
                        >
                          📂 Download PDF
                        </a>
                        {/* PDF Comment Section */}
                        <div style={styles.commentSection}>
                          <h4>PDF Comments</h4>
                          <List
  dataSource={comments.filter(c => c.type === 'pdf')}
  renderItem={(comment) => (
    <List.Item className="comment-item">
      <div className="comment-content">
        <div className="comment-header">
          <Avatar size={16} icon={<UserOutlined />} className="comment-icon" />
          <span className="comment-username">{comment.userId}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
      </div>
    </List.Item>
  )}
/>
                  <TextArea
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment for the PDF..."
                            style={styles.textArea}
                          />
                          <Button 
                            type="primary" 
                            onClick={() => handleCommentSubmit('pdf')} 
                            style={styles.submitButton}
                          >
                            Post PDF Comment
                          </Button>
                        </div>
                      </div>
                    );
                  }
                  return <p key={index} style={styles.noFileText}>File format not supported.</p>;
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
