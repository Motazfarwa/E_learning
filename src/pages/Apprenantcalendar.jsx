import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Input, DatePicker, Button, message, Card, Form, Layout, Modal, Spin } from "antd";
import { motion } from "framer-motion";
import './Maintenacalendar.css';
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Content, Header } = Layout;

const MEETINGS_API = "http://localhost:4000/api/meetings";

const Apprenantcalendar = () => {
  const [events, setEvents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchMeetings = async () => {
    try {
      const meetingsRes = await axios.get(MEETINGS_API);
      const meetingEvents = meetingsRes.data.map(meeting => ({
        id: meeting._id,
        title: `Meeting with Learner ${meeting.learner}`,
        start: meeting.startTime,
        end: meeting.endTime,
        color: meeting.status === 'accepted' ? '#36D399' : 
               meeting.status === 'refused' ? '#FF0000' : '#FFA500',
      }));
      setEvents(meetingEvents);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleEventClick = async (info) => {
    try {
      setMeetingLoading(true);
      setIsModalVisible(true);
      const response = await axios.get(`${MEETINGS_API}/${info.event.id}`);
      setSelectedMeeting(response.data);
    } catch (error) {
      message.error("Failed to load meeting details");
      setIsModalVisible(false);
    } finally {
      setMeetingLoading(false);
    }
  };

const handleStatusUpdate = async (status) => {
  try {
    setUpdating(true);
    const learnerEmail = localStorage.getItem('email'); // Assuming you stored it like this
    await axios.put(`${MEETINGS_API}/${selectedMeeting._id}/status`, {
      status,
      learner: learnerEmail,
    });
    message.success(`Meeting ${status}!`);
    await fetchMeetings();
    setIsModalVisible(false);
  } catch (error) {
    message.error(`Failed to ${status} meeting`);
  } finally {
    setUpdating(false);
  }
};


  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
          <div style={{ color: "#fff", fontSize: "18px" }}>Student calendar</div>
          
        </div>
      </Header>

      <Content style={{ display: "flex", padding: "20px" }}>
        <div style={{ flex: 2, marginRight: "20px" }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="auto"
          />
        </div>

        <Modal
          title="Meeting Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
            <Button
              key="accept"
              type="primary"
              loading={updating}
              onClick={() => handleStatusUpdate('accepted')}
            >
              Accept
            </Button>,
          ]}
        >
          {meetingLoading ? (
            <Spin size="large" />
          ) : (
            selectedMeeting && (
              <div>
                <p><strong>Expert:</strong> {selectedMeeting.expert}</p>
                <p><strong>Learner:</strong> {selectedMeeting.learner}</p>
                <p><strong>Start:</strong> {new Date(selectedMeeting.startTime).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(selectedMeeting.endTime).toLocaleString()}</p>
                <p><strong>Duration:</strong> {selectedMeeting.duration} minutes</p>
                <p><strong>Status:</strong> {selectedMeeting.status || 'pending'}</p>
              </div>
            )
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default Apprenantcalendar;