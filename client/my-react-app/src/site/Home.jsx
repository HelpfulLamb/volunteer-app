import { useMemo } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const mockEvents = [
  {
    id: 1,
    title: "Food Drive",
    startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    description: "Help collect and distribute food to local families in need.",
    location: "Community Center, 123 Main St",
    image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "Beach Cleanup",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
    description: "Join us to clean up our local beach and protect marine life.",
    location: "Sunset Beach, Coastal Highway",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "Blood Donation Camp",
    startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    description: "Donate blood and save lives at our annual blood drive.",
    location: "City Hospital, 456 Health Ave",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "Community Garden Setup",
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    description: "Help establish our new community garden space.",
    location: "Empty Lot, 789 Green St",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    title: "Senior Center Visit",
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    description: "Spend time with seniors at the local retirement home.",
    location: "Golden Years Retirement, 101 Elder Rd",
    image: "https://images.unsplash.com/photo-1529310399831-ed472b81d589?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    title: "Coog World",
    startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    description: "Help entertain local families with fun activities.",
    location: "University of Houston",
    image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
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
        now - e.endTime <= 10 * 24 * 60 * 60 * 1000 // within 10 days
    ),
  };
}

function getBadge(event) {
  const now = new Date();
  if (now >= event.startTime && now <= event.endTime) return "Live Now";
  if (event.startTime > now) return "Upcoming";
  if (event.endTime < now) return "Completed";
}

export default function Home() {
  const { ongoing, upcoming, past } = useMemo(() => categorizeEvents(mockEvents), []);
  return (
    <div className="container mx-auto px-4 py-8">
      <OngoingEventsSlider events={ongoing} />
      <EventsSection title="Upcoming Events" events={upcoming} badgeColor="bg-blue-100 text-blue-800" />
      <EventsSection title="Past Events (Last 10 Days)" events={past} badgeColor="bg-gray-300 text-gray-800" />
    </div>
  );
}

function OngoingEventsSlider({ events }) {
  if (events.length === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Live & Ongoing Events</h2>
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <div className="flex scrollbar-hide">
          {events.map(event => (
            <div key={event.id} className="flex-shrink-0 w-full">
              <div className="relative h-96">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-8 text-white">
                  <div>
                    <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">Live Now</div>
                    <h3 className="text-3xl font-bold mb-2">{event.title}</h3>
                    <p className="text-lg mb-3">{event.description}</p>
                    <div className="flex items-center text-white/90 mb-2">
                      <FaMapMarkerAlt className='mx-1' />
                      {event.location}
                    </div>
                    <div className="flex items-center text-white/90">
                      <FaClock className='mx-1' />
                      {event.startTime.toLocaleString()} - {event.endTime.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {events.map((_, index) => (
            <button key={index} className="w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 focus:outline-none" aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsSection({ title, events, badgeColor }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} badgeColor={badgeColor} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">No {title.toLowerCase()} to display</p>
        </div>
      )}
    </section>
  );
}

function EventCard({ event, badgeColor }) {
  const badge = getBadge(event);
  const isPast = badge === "Completed";
  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${isPast ? 'opacity-80' : ''}`}>
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
          {badge && (
            <span className={`text-xs ${badgeColor} px-3 py-1 rounded-full font-medium`}>{badge}</span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start">
            <FaMapMarkerAlt className='my-1 mx-2' />
            <span>{event.location}</span>
          </div>
          <div className="flex items-start">
            <FaClock className='my-1 mx-2' />
            <span>{event.startTime.toLocaleString()} - {event.endTime.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}