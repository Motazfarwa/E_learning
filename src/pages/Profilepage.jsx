import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Card, Input, Button, message, Avatar, Upload } from 'antd';
import { HomeOutlined, BookOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '',
    bio: '',
    skills: '',
    profileImage: null,
  });
  const fullname = localStorage.getItem('FullName');

  // Charger le profil au montage du composant
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Aucun token d\'authentification trouvé. Veuillez vous connecter.');
          return;
        }
        const response = await axios.get('http://localhost:4000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData({
          FullName: response.data.FullName || '',
          bio: response.data.profile.bio || '',
          skills: response.data.profile.skills?.join(', ') || '',
          profileImage: null,
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gérer le changement de l'image
  const handleImageChange = ({ file }) => {
    setFormData({ ...formData, profileImage: file });
  };

  // Soumettre les modifications du profil
  const handleSubmit = async () => {
    if (!formData.FullName.trim()) {
      message.warning('Veuillez entrer un nom complet');
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('FullName', formData.FullName);
    data.append('bio', formData.bio);
    if (['INSTRUCTEUR', 'EXPERT'].includes(user?.role)) {
      const skillsArray = formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill);
      data.append('skills', JSON.stringify(skillsArray));
    }
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Aucun token d\'authentification trouvé. Veuillez vous connecter.');
        return;
      }
      const response = await axios.put('http://localhost:4000/api/users/profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      setFormData({
        FullName: response.data.FullName || '',
        bio: response.data.profile.bio || '',
        skills: response.data.profile.skills?.join(', ') || '',
        profileImage: null,
      });
      message.success('Profil mis à jour avec succès !');
    } catch (err) {
      message.error(err.response?.data?.error || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Chargement du profil...</p>;
  }
  if (error) {
    return <p style={{ textAlign: 'center', color: 'red', fontSize: '18px' }}>{error}</p>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={styles.sider}>
        <div style={styles.logo}>E-learning</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Accueil</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<BookOutlined />}>
            <Link to="/courses">Cours</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/profile">Profil</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={styles.header}>Mon Profil</Header>
        <Content style={styles.content}>
          <Card title={`Profil de ${fullname}`} bordered={false} style={styles.card}>
            <div style={styles.profileContainer}>
              {user.profileImage ? (
                <Avatar
                  size={128}
                  src={`http://localhost:4000/Uploads/${user.profileImage}`}
                  style={styles.avatar}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/128')}
                />
              ) : (
                <Avatar size={128} icon={<UserOutlined />} style={styles.avatar} />
              )}
              <p style={styles.info}><strong>Rôle :</strong> {user.role}</p>
              <p style={styles.info}><strong>Email :</strong> {user.email}</p>
            </div>

            <div style={styles.formContainer}>
              <Input
                name="FullName"
                value={formData.FullName}
                onChange={handleInputChange}
                placeholder="Nom complet"
                style={styles.input}
              />
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Bio"
                rows={4}
                style={styles.textArea}
              />
              {['INSTRUCTEUR', 'EXPERT'].includes(user?.role) && (
                <Input
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="Compétences (séparées par des virgules)"
                  style={styles.input}
                />
              )}
              <Upload
                name="profileImage"
                accept="image/jpeg,image/png"
                beforeUpload={() => false} // Empêche l'upload automatique
                onChange={handleImageChange}
                showUploadList={false}
                style={styles.upload}
              >
                <Button icon={<UploadOutlined />} style={styles.uploadButton}>
                  Télécharger une image de profil
                </Button>
              </Upload>
              {formData.profileImage && (
                <p style={styles.fileName}>Fichier sélectionné : {formData.profileImage.name}</p>
              )}
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isSubmitting}
                style={styles.submitButton}
              >
                Mettre à jour le profil
              </Button>
            </div>
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
  profileContainer: { marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  avatar: { marginBottom: '15px' },
  info: { fontSize: '16px', color: '#333', marginBottom: '10px' },
  formContainer: { maxWidth: '600px', margin: '0 auto' },
  input: { marginBottom: '15px', borderRadius: '5px', fontSize: '16px', padding: '10px' },
  textArea: { marginBottom: '15px', borderRadius: '5px', fontSize: '16px', padding: '10px' },
  upload: { marginBottom: '15px' },
  uploadButton: { width: '100%', borderRadius: '5px', fontSize: '16px' },
  fileName: { fontSize: '14px', color: '#555', marginBottom: '15px' },
  submitButton: { width: '100%', backgroundColor: '#1890ff', borderColor: '#1890ff', fontSize: '16px', fontWeight: 'bold', borderRadius: '5px' }
};

export default ProfilePage;