const { getDistance } = require("./distanceService");
const db = require('../db.js');

exports.getMatchingSuggestions = async (volunteers, events) => {
  console.log('match logic:', volunteers);
  const [assignments] = await db.query('SELECT u_id, e_id from ASSIGNMENT');
  const assignedSet = new Set(assignments.map(row => `${row.u_id}-${row.e_id}`));
    const suggestions = [];
    for(const vol of volunteers) {
        const matchedEvents = [];
        for(const event of events) {
            const hasMatchingSkills = event.event_skills.some(skill => vol.skills.includes(skill));
            if(!hasMatchingSkills) continue;
            const pairKey = `${vol.id}-${event.id}`;
            if(assignedSet.has(pairKey)) continue;
            // concatentate volunteer address
            const volAddress = `${vol.address1}, ${vol.city}, ${vol.state} ${vol.zipcode}`;
            console.log(volAddress);
            const distance = await getDistance(volAddress, event.event_location);
            // console.log(`Matching: ${vol.name} -> ${event.event_name}`);
            // console.log(`From: ${vol.location}, To: ${event.event_location}`);
            // console.log(`Distance: ${distance} meters\n`);
            matchedEvents.push({
                id: event.id,
                distanceInMeters: distance,
                isOutsideRange: distance > 80000  // further than 50 miles away
            });
        }
        suggestions.push({ ...vol, matchedEvents });
    }
    return suggestions;
};