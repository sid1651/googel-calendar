import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  getDate,
  addDays,
  subDays,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const timeZone = "Asia/Kolkata";
const miniCalDays = ["S", "M", "T", "W", "T", "F", "S"];

const CalendarPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    color: "#3788d8",
  });

  const [miniCalDate, setMiniCalDate] = useState(new Date());
  const [view, setView] = useState("month"); // 👈 current calendar view
  const [currentDate, setCurrentDate] = useState(new Date()); // 👈 current main calendar date

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formatted = res.data.map((event) => ({
        id: event._id,
        _id: event._id,
        title: event.title,
        description: event.description || "",
        start: new Date(event.startTime || event.start),
        end: new Date(event.endTime || event.end),
        color: event.color || "#3788d8",
      }));
      setEvents(formatted);
    } catch (err) {
      console.error("Error fetching events:", err.response?.data || err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        description: event.description || "",
        start: event.start.toISOString().slice(0, 16),
        end: event.end.toISOString().slice(0, 16),
        color: event.color || "#3788d8",
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: "",
        description: "",
        start: "",
        end: "",
        color: "#3788d8",
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      startTime: new Date(formData.start),
      endTime: new Date(formData.end),
      color: formData.color,
    };
    try {
      if (selectedEvent) {
        await axios.put(
          `http://localhost:5000/api/events/${selectedEvent._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/events/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchEvents();
      closeModal();
    } catch (err) {
      console.error("Error saving event:", err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/events/${selectedEvent._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchEvents();
        closeModal();
      } catch (err) {
        console.error("Error deleting event:", err.response?.data || err.message);
      }
    }
  };

  // Mini calendar navigation
  const handleMiniCalNext = () => setMiniCalDate(addMonths(miniCalDate, 1));
  const handleMiniCalPrev = () => setMiniCalDate(subMonths(miniCalDate, 1));

  const miniCalDates = useMemo(() => {
    const firstDay = startOfMonth(miniCalDate);
    const lastDay = endOfMonth(miniCalDate);
    const startDate = startOfWeek(firstDay, { locales: { "en-US": enUS } });
    const endDate = endOfWeek(lastDay, { locales: { "en-US": enUS } });

    const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });

    return daysInGrid.map((day) => ({
      date: day,
      dayOfMonth: getDate(day),
      isCurrentMonth: isSameMonth(day, miniCalDate),
      isToday: isToday(day),
    }));
  }, [miniCalDate]);

  // ---- Main calendar navigation ----
  const handleToday = () => setCurrentDate(new Date());
  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };
  const handlePrev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subDays(currentDate, 7));
    else setCurrentDate(subDays(currentDate, 1));
  };

  return (
    <>
      <div className="google-calendar-layout">
        {/* SIDEBAR */}
        <div className="calendar-sidebar">
          <button className="btn btn-create" onClick={() => openModal()}>
            Create
          </button>

          {/* MINI CALENDAR */}
          <div className="mini-calendar">
            <div className="mini-cal-header">
              <strong>{format(miniCalDate, "MMMM yyyy")}</strong>
              <div className="mini-cal-nav">
                <span onClick={handleMiniCalPrev}>&lt;</span>
                <span onClick={handleMiniCalNext}>&gt;</span>
              </div>
            </div>
            <div className="mini-cal-grid-header">
              {miniCalDays.map((day, i) => (
                <span key={i}>{day}</span>
              ))}
            </div>
            <div className="mini-cal-grid-body">
              {miniCalDates.map(
                ({ date, dayOfMonth, isCurrentMonth, isToday: isTodayFlag }) => (
                  <span
                    key={date.toString()}
                    className={`${
                      !isCurrentMonth ? "off-range" : ""
                    } ${isTodayFlag ? "today" : ""}`}
                  >
                    {dayOfMonth}
                  </span>
                )
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="Search for people"
            className="sidebar-search"
          />

          <div className="sidebar-section">
            <h4>Booking pages</h4>
          </div>

          <div className="sidebar-section">
            <h4>My calendars</h4>
            <div className="sidebar-checklist">
              <label>
                <input type="checkbox" defaultChecked />{" "}
                <span>Narva Siddharth</span>
              </label>
              <label>
                <input type="checkbox" defaultChecked /> <span>Birthdays</span>
              </label>
              <label>
                <input type="checkbox" defaultChecked /> <span>Tasks</span>
              </label>
            </div>
          </div>
        </div>

        {/* MAIN CALENDAR */}
        <div className="calendar-main-content">
          <div className="calendar-header">
            <h2>Welcome, {user?.name}</h2>
            <div className="header-right">
              <p>Time Zone: {timeZone}</p>
              <button className="btn btn-logout" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          {/* Google Calendar-style navigation */}
          <div className="calendar-controls">
            
            
            <div className="view-switcher">
              
            </div>
          </div>

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectEvent={openModal}
            eventPropGetter={(event) => ({
              style: { backgroundColor: event.color },
            })}
            date={currentDate}
            view={view}
            onView={(v) => setView(v)}
            onNavigate={(date) => setCurrentDate(date)}
          />
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Event Modal"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <h2 className="modal-title">
          {selectedEvent ? "Edit Event" : "Add New Event"}
        </h2>
        <div className="modal-form">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <label>Start:</label>
          <input
            type="datetime-local"
            name="start"
            value={formData.start}
            onChange={handleInputChange}
          />
          <label>End:</label>
          <input
            type="datetime-local"
            name="end"
            value={formData.end}
            onChange={handleInputChange}
          />
          <label>Color:</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
          />
        </div>

        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={handleSave}>
            {selectedEvent ? "Update" : "Save"}
          </button>
          {selectedEvent && (
            <button className="btn btn-secondary" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="btn" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CalendarPage;
