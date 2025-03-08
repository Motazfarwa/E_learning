import React, { useContext, useState } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { RoleContext } from './RoleContext';
import logo from "../assets/51031-removebg-preview.png";

const Addcourseform = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);

  const onFinish = async (values) => {
    const { machineImage, file, nom, description } = values;

    if (!machineImage || machineImage.length === 0) {
      message.error('Please upload a machine image');
      return;
    }

    if (!file || file.length === 0) {
      message.error('Please upload a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('courseimagefile', machineImage[0].originFileObj);
    formData.append('file', file[0].originFileObj);

    try {
      await axios.post('http://localhost:4000/api/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Course added successfully');
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to add machine');
    } finally {
      setLoading(false);
    }
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    display: 'block',
    padding: '12px 8px',
    borderRadius: '5px',
    transition: '0.3s',
  };
 const role = useContext(RoleContext);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>

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
    <li><a href="/cours/:id" className="block hover:text-gray-300 font-bold">Details de cours</a></li>
    <li><a href="/getcours" className="block hover:text-gray-300 font-bold">List des cours</a></li>
    </ul>
    </div>
      <div style={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Ajouter un nouveau cour</h2>

        <Form form={form} onFinish={onFinish} layout="vertical">
          {/* Machine Image Upload */}
          <Form.Item
     
            name="machineImage"
            rules={[{ required: true, message: 'Machine image is required' }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList || []}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={1}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          {/* Machine Name */}
          <Form.Item
            label="Nom du cour"
            name="nom"
            rules={[{ required: true, message: 'pouvez vous entrer le nom du cour' }]}
          >
            <Input />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* File Upload */}
          <Form.Item
            name="file"
            rules={[{ required: true, message: 'Please upload a file' }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList || []}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Machine
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Addcourseform;