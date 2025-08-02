const { getDistance } = require("./distanceService");

exports.getMatchingSuggestions = async (volunteers, events) => {
  console.log('match logic:', volunteers);
    const suggestions = [];
    for(const vol of volunteers) {
        const matchedEvents = [];
        for(const event of events) {
            const hasMatchingSkills = event.event_skills.some(skill => vol.skills.includes(skill));
            if(!hasMatchingSkills) continue;
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