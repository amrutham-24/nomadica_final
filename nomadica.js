// Function to calculate distance using Haversine Formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Function to get user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                // Fetch user's location name from OpenStreetMap API
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLon}`)
                    .then(response => response.json())
                    .then(data => {
                        // Update location display
                        document.getElementById("user-location").textContent = `📍 ${data.display_name}`;
                    });

                // Get all destination elements
                let destinations = document.querySelectorAll(".destination");
                let distances = [];

                destinations.forEach(dest => {
                    const destLat = parseFloat(dest.dataset.lat);
                    const destLon = parseFloat(dest.dataset.lon);
                    const distance = calculateDistance(userLat, userLon, destLat, destLon);
                    dest.querySelector(".distance").textContent = `${distance.toFixed(2)} km away`;
                    distances.push({ element: dest, distance: distance });
                });

                // Sort destinations based on distance (ascending order)
                distances.sort((a, b) => a.distance - b.distance);

                // Update the DOM with sorted destinations
                const container = document.getElementById("destinations");
                container.innerHTML = ""; // Clear the current destinations
                distances.forEach(d => container.appendChild(d.element));
            },
            (error) => {
                console.log("Error getting location: " + error.message);
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to display place details when the "View Details" button is clicked
function viewDetails(place) {
    alert(`More details about ${place} will be added soon!`);
}

// Function to search destinations by name
document.getElementById("search").addEventListener("keyup", function() {
    const filter = this.value.toLowerCase(); // Get search query
    const destinations = document.querySelectorAll(".destination"); // Get all destination cards

    destinations.forEach(dest => {
        // Get the name of the destination from <h3> tag
        const destName = dest.querySelector("h3").textContent.toLowerCase();
        
        // Show or hide destination based on the search input
        if (destName.includes(filter)) {
            dest.style.display = "block"; // Show if it matches
        } else {
            dest.style.display = "none"; // Hide if it doesn't match
        }
    });
});

// Initialize on window load
window.onload = () => {
    getUserLocation(); // Fetch user's location and update distances
};
