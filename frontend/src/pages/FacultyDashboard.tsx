import React, { useEffect, useState } from 'react';
import { getFacultyEvents, deleteEvent, addEvent, updateEvent } from '../services/api';
import { getUserInfo } from '../services/auth';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import type { AppEvent } from '../types/Event';

const FacultyDashboard = () => {
  const userInfo = getUserInfo();
  const facultyId = userInfo?.facultyId;
  
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<AppEvent>({
    studentName: '',
    rollNumber: '',
    eventName: '',
    location: '',
    date: '',
    description: '',
    facultyId: facultyId || '',
  });
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchEvents = async () => {
    if (!facultyId || !selectedMonth) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFacultyEvents(facultyId, selectedMonth);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Error occurred while fetching events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const isPastEvent = (dateValue: string) => {
    const eventDate = new Date(dateValue);
    if (Number.isNaN(eventDate.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  useEffect(() => {
    fetchEvents();
  }, [facultyId, selectedMonth]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id, facultyId);
      fetchEvents();
    } catch (err: any) {
      alert("Failed to delete the event: " + err.message);
    }
  };

  const handleEdit = (event: AppEvent) => {
    setModalMode('edit');
    setFormData(event);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setModalMode('add');
    setFormData({
      studentName: '',
      rollNumber: '',
      eventName: '',
      location: '',
      date: '',
      description: '',
      facultyId: facultyId || '',
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await addEvent(formData);
      } else {
        if (!formData.id) throw new Error("Event ID missing for update");
        await updateEvent(formData.id, facultyId, formData);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      alert(`Failed to save event: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Faculty Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Manage student registrations and events</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              + Add Event
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md shadow-sm">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">There are no events registered for {selectedMonth}.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              {events.filter((event) => !isPastEvent(event.date)).length === 0 ? (
                <div className="text-sm text-gray-500">No upcoming events.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.filter((event) => !isPastEvent(event.date)).map((event) => (
                    <EventCard key={event.id} event={event} variant="faculty" onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Events</h2>
              {events.filter((event) => isPastEvent(event.date)).length === 0 ? (
                <div className="text-sm text-gray-500">No past events.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.filter((event) => isPastEvent(event.date)).map((event) => (
                    <EventCard key={event.id} event={event} variant="faculty" onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'add' ? 'Add Registration' : 'Edit Registration'}</h3>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input name="studentName" required value={formData.studentName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                <input name="rollNumber" required value={formData.rollNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                <input name="eventName" required value={formData.eventName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input name="location" required value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date (e.g. 2024-05-15)</label>
                <input name="date" type="date" required value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" rows={3} required value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
