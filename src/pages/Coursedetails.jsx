import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Card, Input, Button, List, message, Avatar } from 'antd';
import { HomeOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fullname = localStorage.getItem('FullName');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/courses/${id}`),
          axios.get(`http://localhost:4000/api/courses/${id}/comments`)
        ]);
        setCourse(courseRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCommentSubmit = async (type) => {
    if (!newComment.trim()) {
      message.warning('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `http://localhost:4000/api/courses/${id}/comments`,
        { 
          text: newComment, 
          type, 
          userId: fullname,
          courseId: id 
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setComments(prev => [...prev, response.data]);
      setNewComment("");
      message.success('Comment posted successfully!');
      
      const { data } = await axios.get(`http://localhost:4000/api/courses/${id}/comments`);
      setComments(data);
    } catch (error) {
      message.error('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <Card title={course?.nom} bordered={false} style={styles.card}>
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

            {course?.file?.map((file, index) => {
              if (file.endsWith('.mp4')) {
                return (
                  <div key={index} style={styles.fileItem}>
                    <h4 style={styles.fileTitle}>Lecture Video</h4>
                    <div style={styles.videoContainer}>
                      <video controls style={styles.video}>
                        <source src={`http://localhost:4000/uploads/${file}`} type="video/mp4" />
                      </video>
                    </div>
                    <div style={styles.commentSection}>
                      <h4>Video Comments</h4>
                      <List
                        dataSource={comments.filter(c => c.type === 'video')}
                        renderItem={(comment) => (
                          <List.Item>
                            <CommentItem comment={comment} />
                          </List.Item>
                        )}
                      />
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
                        loading={isSubmitting}
                        style={styles.submitButton}
                      >
                        Post Video Comment
                      </Button>
                    </div>
                  </div>
                );
              }
              
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
                    <div style={styles.commentSection}>
                      <h4>PDF Comments</h4>
                      <List
                        dataSource={comments.filter(c => c.type === 'pdf')}
                        renderItem={(comment) => (
                          <List.Item>
                            <CommentItem comment={comment} />
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
                        loading={isSubmitting}
                        style={styles.submitButton}
                      >
                        Post PDF Comment
                      </Button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

const CommentItem = ({ comment }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
    <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
    <div>
      <div style={{ fontWeight: 'bold' }}>{comment.userId}</div>
      <div>{comment.text}</div>
    </div>
  </div>
);

const styles = {
  sider: { background: '#001529', width: 240 },
  logo: { color: '#fff', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', padding: '20px' },
  header: { background: '#1890ff', color: '#fff', fontSize: '24px', textAlign: 'center', padding: '15px' },
  content: { margin: '20px', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
  card: { textAlign: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', borderRadius: '10px', padding: '20px' },
  description: { fontSize: '18px', color: '#333', marginBottom: '15px' },
  imageContainer: { marginBottom: '20px', display: 'flex', justifyContent: 'center' },
  image: { width: '100%', maxWidth: '600px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
  fileContainer: { marginTop: '20px' },
  fileItem: { marginBottom: '15px', padding: '15px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' },
  videoContainer: { display: 'flex', justifyContent: 'center' },
  video: { width: '80%', maxWidth: '800px', borderRadius: '10px' },
  downloadLink: { fontSize: '16px', color: '#1890ff', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' },
  commentSection: { marginTop: '20px', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: '#f9f9f9' },
  textArea: { marginTop: '10px', borderRadius: '5px', fontSize: '16px', padding: '10px', width: '100%' },
  submitButton: { marginTop: '10px', width: '100%', backgroundColor: '#1890ff', borderColor: '#1890ff', fontSize: '16px', fontWeight: 'bold', borderRadius: '5px' },
  fileTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' },
};

export default CourseDetails;