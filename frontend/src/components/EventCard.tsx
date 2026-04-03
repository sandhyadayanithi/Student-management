import type { AppEvent } from '../types/Event';

interface EventCardProps {
  event: AppEvent;
  onEdit?: (event: AppEvent) => void;
  onDelete?: (id: string) => void;
  variant?: 'student' | 'faculty';
}

const EventCard = ({ event, onEdit, onDelete, variant = 'faculty' }: EventCardProps) => {
  const isExternal = !event.facultyId || event.facultyId.trim() === '';

  return (
    <div className="bg-white shadow-lg rounded-xl flex flex-col justify-between border border-gray-100 p-6 transform hover:scale-105 transition duration-300 ease-in-out">
      <div>
        <div className="mb-4">
          <h3 className="text-xl flex items-center justify-between font-bold text-gray-900 mb-1">
            {event.eventName}
            {variant === 'student' ? (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${isExternal ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}
              >
                {isExternal ? 'External' : 'Faculty'}
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                {event.date}
              </span>
            )}
          </h3>
          {variant === 'student' ? (
            <div className="space-y-1">
              <p className="text-lg text-gray-800 font-semibold">{event.location}</p>
              <p className="text-base text-gray-600 font-medium">{event.date}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 font-medium">Location: {event.location}</p>
          )}
        </div>

        <p className="text-gray-700 text-base mb-4 line-clamp-3">
          {event.description}
        </p>
      </div>

      <div className="mt-auto">
        {variant === 'faculty' && (
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Student</span>
              <span className="text-sm font-medium text-gray-900">{event.studentName}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Roll Number</span>
              <span className="text-sm font-medium text-indigo-600">{event.rollNumber}</span>
            </div>
          </div>
        )}

        {(onEdit || onDelete) && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="px-3 py-1 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition"
              >
                Edit
              </button>
            )}
            {onDelete && event.id && (
              <button
                onClick={() => onDelete(event.id!)}
                className="px-3 py-1 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
