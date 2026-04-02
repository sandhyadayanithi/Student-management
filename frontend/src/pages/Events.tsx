import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentEvents } from '../services/api';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import type { AppEvent } from '../types/Event';

const Events = () => {
  const { rollNumber } = useParams<{ rollNumber: string }>();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!rollNumber) {
        setError("No roll number provided.");
        setLoading(false);
        return;
      }
      try {
        const data = await getStudentEvents(rollNumber);
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'Error occurred while fetching events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [rollNumber]);

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
              Roll Number: <span className="font-semibold text-indigo-600">{rollNumber}</span>
            </p>
          </div>
          <Link
            to="/"
            className="mt-4 md:mt-0 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Switch Account
          </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;
