import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addEvent, deleteStudentEvent, getStudentEvents, updateStudentEvent } from '../services/api';
import { getUserInfo } from '../services/auth';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import type { AppEvent } from '../types/Event';

const Events = () => {
  const { rollNumber } = useParams<{ rollNumber: string }>();
  const userInfo = getUserInfo();
  const defaultRollNumber = rollNumber || userInfo?.rollNumber || '';
  const defaultStudentName = userInfo?.name || '';
  const lockStudentFields = Boolean(defaultRollNumber && defaultStudentName);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isExternal, setIsExternal] = useState(false);
  const [formData, setFormData] = useState<AppEvent>({
    studentName: defaultStudentName,
    rollNumber: defaultRollNumber,
    eventName: '',
    location: '',
    date: '',
    description: '',
    facultyId: '',
  });

  const fetchEvents = async () => {
    if (!defaultRollNumber) {
      setError("No roll number provided.");
      setLoading(false);
      return;
    }
    try {
      const data = await getStudentEvents(defaultRollNumber);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Error occurred while fetching events');
    } finally {
      setLoading(false);
    }
  };

  const isExternalEvent = (event: AppEvent) => !event.facultyId || event.facultyId.trim() === '';

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
    setFormData((prev) => ({
      ...prev,
      studentName: defaultStudentName,
      rollNumber: defaultRollNumber,
    }));
    fetchEvents();
  }, [defaultRollNumber, defaultStudentName]);

  const handleAddClick = () => {
    setModalMode('add');
    setIsExternal(false);
    setFormData({
      studentName: defaultStudentName,
      rollNumber: defaultRollNumber,
      eventName: '',
      location: '',
      date: '',
      description: '',
      facultyId: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (event: AppEvent) => {
    setModalMode('edit');
    setIsExternal(isExternalEvent(event));
    setFormData(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, event: AppEvent) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      if (!event.rollNumber) throw new Error("Roll number missing for delete");
      await deleteStudentEvent(id, event.rollNumber);
      setLoading(true);
      fetchEvents();
    } catch (err: any) {
      alert("Failed to delete the event: " + err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExternalToggle = (checked: boolean) => {
    setIsExternal(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, facultyId: '' }));
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        if (!isExternal && !formData.facultyId.trim()) {
          throw new Error("Faculty ID is required for faculty-included events");
        }
        const payload = isExternal ? { ...formData, facultyId: '' } : formData;
        await addEvent(payload);
      } else {
        if (!formData.id) throw new Error("Event ID missing for update");
        if (!formData.rollNumber) throw new Error("Roll number missing for update");
        await updateStudentEvent(formData.id, formData.rollNumber, formData);
      }
      setIsModalOpen(false);
      setLoading(true);
      fetchEvents();
    } catch (err: any) {
      alert(`Failed to save event: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              My Registered Events
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Roll Number: <span className="font-semibold text-indigo-600">{defaultRollNumber}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <button
              onClick={handleAddClick}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
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
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              {events.filter((event) => !isPastEvent(event.date)).length === 0 ? (
                <div className="text-sm text-gray-500">No upcoming events.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.filter((event) => !isPastEvent(event.date)).map((event, index) => (
                    <EventCard
                      key={index}
                      event={event}
                      variant="student"
                      onEdit={handleEdit}
                      onDelete={(id) => handleDelete(id, event)}
                    />
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
                  {events.filter((event) => isPastEvent(event.date)).map((event, index) => (
                    <EventCard
                      key={index}
                      event={event}
                      variant="student"
                      onEdit={handleEdit}
                      onDelete={(id) => handleDelete(id, event)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {modalMode === 'add' ? 'Add Registration' : 'Edit Registration'}
            </h3>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {modalMode === 'add' && (
                <div className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">External Event</p>
                    <p className="text-xs text-gray-500">No faculty approval required</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isExternal}
                      onChange={(e) => handleExternalToggle(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 transition"></div>
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></span>
                  </label>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input
                  name="studentName"
                  required
                  value={formData.studentName}
                  onChange={handleChange}
                  readOnly={lockStudentFields}
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${lockStudentFields ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                <input
                  name="rollNumber"
                  required
                  value={formData.rollNumber}
                  onChange={handleChange}
                  readOnly={lockStudentFields}
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${lockStudentFields ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
              {!isExternal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Faculty ID</label>
                  <input
                    name="facultyId"
                    required
                    value={formData.facultyId}
                    onChange={handleChange}
                    readOnly={modalMode === 'edit'}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              )}
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

export default Events;
