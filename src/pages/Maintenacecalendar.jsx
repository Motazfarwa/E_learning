import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Input, DatePicker, Button, message, Card, Form, Layout , InputNumber } from "antd";
import { motion } from "framer-motion";
import './Maintenacalendar.css';
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Content, Header } = Layout;

const MEETINGS_API = "http://localhost:4000/api/meetings";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const meetingsRes = await axios.get(MEETINGS_API);

        const meetingEvents = meetingsRes.data.map(meeting => {
          return {
            id: meeting._id, // instead of meeting.meetingId
            title: `Meeting with Learner ${meeting.learner}`,
            start: meeting.startTime,
            end: meeting.endTime,
            color: '#36D399',
          };
        });

        setEvents(meetingEvents);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, []);

  const handleAddMeeting = async (values) => {
    setLoading(true);
    try {
      const [startTime, endTime] = values.timeRange;
      const meetingData = {
        expert: values.expert,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: values.duration || 30,
      };
  
      const response = await axios.post(MEETINGS_API, meetingData);
      const { _id,expert, startTime: newStart, endTime: newEnd } = response.data;

      setEvents(prev => [
        ...prev,
        {
          id: _id,
          title: `Meeting with ${expert}`,
          start: newStart,
          end: newEnd,
          color: '#36D399',
        }
      ]);

      message.success('Meeting scheduled successfully!');
      form.resetFields();
  

  
      // OR if you want to open the actual video meeting URL:
      // window.open(meetingUrl, '_blank');
  
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
          <div style={{ color: "#fff", fontSize: "18px" }}>Meeting Scheduling System</div>
          
        </div>
      </Header>

      <Content style={{ display: "flex", padding: "20px" }}>
        <div style={{ flex: 2, marginRight: "20px" }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={(info) => {
              const meetingId = info.event.id;
              navigate(`/meetings/${meetingId}`);
            }}
            
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="auto"
          />
        </div>

        <div style={{ 
  width: "100%",
  maxWidth: "500px",
  border: "1px solid #f0f0f0",
  borderRadius: "12px",
  padding: "24px",
  backgroundColor: "white",
  boxShadow: "0 2px 10px rgba(124, 58, 237, 0.1)",
  margin: "0 auto"
}}>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <h3 style={{
      color: "#7C3AED",
      fontSize: "1.25rem",
      marginBottom: "24px",
      textAlign: "center",
      fontWeight: 600
    }}>
      New Meeting Request
    </h3>

    <Form form={form} layout="vertical" onFinish={handleAddMeeting}>
      {/* Champ 1: Expert Email */}
      <div style={{ marginBottom: "24px" }}>
        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Expert Email</span>}
          name="expert"
          rules={[{ required: true, message: "Expert email is required" }]}
        >
          <Input 
            placeholder="expert@example.com" 
            size="large"
            style={{
              borderRadius: "8px",
              padding: "12px",
              width: "100%"
            }}
          />
        </Form.Item>
      </div>

      {/* Champ 2: Date Range */}
      <div style={{ marginBottom: "24px" }}>
        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Meeting Date & Time</span>}
          name="timeRange"
          rules={[{ required: true, message: "Please select time range" }]}
        >
          <RangePicker 
            showTime 
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%", padding: "11px" }}
            size="large"
          />
        </Form.Item>
      </div>

      {/* Champ 3: Duration */}
      <div style={{ marginBottom: "32px" }}>
        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Duration (minutes)</span>}
          name="duration"
          rules={[{ 
            required: true, 
            message: "Duration must be between 15-120 minutes",
            type: "number",
            min: 15,
            max: 120 
          }]}
        >
          <InputNumber 
            min={15}
            max={120}
            style={{ 
              width: "100%",
              borderRadius: "8px",
              padding: "8px 12px"
            }}
            size="large"
          />
        </Form.Item>
      </div>

      {/* Bouton Submit */}
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          size="large"
          block
          style={{
            height: "48px",
            borderRadius: "8px",
            backgroundColor: "#7C3AED",
            borderColor: "#7C3AED",
            fontSize: "1rem",
            fontWeight: 500
          }}
          loading={loading}
        >
          Schedule Meeting
        </Button>
      </Form.Item>
    </Form>
  </motion.div>
</div>
      </Content>
    </Layout>
  );
};

export default CalendarComponent;