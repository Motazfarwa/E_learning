import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Input, DatePicker, Button, message, Card, Form, Layout } from "antd";
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
          <Button type="primary">Logout</Button>
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

        <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: "8px", padding: "20px" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card title="Schedule New Meeting" bordered={false}>
              <Form form={form} layout="vertical" onFinish={handleAddMeeting}>
                <Form.Item 
                  label="Expert Email" 
                  name="expert"
                  rules={[{ required: true, message: "Please enter expert's email" }]}>
                  <Input placeholder="Enter expert's email" type="email" />
                </Form.Item>

             

                <Form.Item label="Meeting Time" name="timeRange" rules={[{ required: true }]}>
                  <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Duration (minutes)" name="duration">
                  <Input type="number" min={15} max={120} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block>
                    Schedule Meeting
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </motion.div>
        </div>
      </Content>
    </Layout>
  );
};

export default CalendarComponent;