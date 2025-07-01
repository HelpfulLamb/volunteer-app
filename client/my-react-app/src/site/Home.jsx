import { useMemo } from 'react';
import { motion } from "framer-motion";

const mockEvents = [
  {
    id: 1,
    title: "Food Drive",
    startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  },
  {
    id: 2,
    title: "Beach Cleanup",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Blood Donation Camp",
    startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "Community Garden Setup",
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
  },
];

const now = new Date();

function categorizeEvents(events) {
  return {
    ongoing: events.filter(
      (e) => now >= e.startTime && now <= e.endTime
    ),
    upcoming: events.filter((e) => e.startTime > now),
    past: events.filter(
      (e) =>
        e.endTime < now &&
        now - e.endTime <= 10 * 24 * 60 * 60 * 1000 // within 7 days
    ),
  };
}

function getBadge(event){
  const now = new Date();
  if(now >= event.startTime && now <= event.endTime) return "Live Now";
  if(event.startTime > now) return "Starts Soon";
  if(event.endTime < now) return "Ended";
}

export default function Home() {
  const { ongoing, upcoming, past } = useMemo(() => categorizeEvents(mockEvents), []);

  return (
    <div className="space-y-10">
      <EventSection title="Ongoing Events" events={ongoing} />
      <EventSection title="Upcoming Events" events={upcoming} />
      <EventSection title="Past Events (Last 10 Days)" events={past} />
    </div>
  );
}

function EventSection({ title, events }) {
  return (
    <motion.div className='bg-white shadow rounded-lg p-4 border hover:shadow-lg hover:border-blue-500' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="text-gray-500">No events to show.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EventCard({ event }) {
  const badge = getBadge(event);
  return (
    <div className="bg-white shadow rounded-lg p-4 border hover:shadow-lg hover:border-blue-500 transition-all duration-200">
      <div className='flex justify-between items-start'>
        <h3 className="text-lg font-bold">{event.title}</h3>
        {badge && (
          <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full'>
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">
        {event.startTime.toLocaleString()} - {event.endTime.toLocaleString()}
      </p>
    </div>
  );
}
