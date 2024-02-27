import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const LineSnap = ({ socket }) => {
  const [snaps, setSnaps] = useState([]);
  const [selectedAlias, setSelectedAlias] = useState(null);
  const [filteredSnaps, setFilteredSnaps] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    libraries: ['geometry', 'places'],
  });

  useEffect(() => {
    if (socket) {
      socket.on('lineSnapToWebsite', (data) => {
        // Update the snaps state with the received message
        setSnaps((prevsnaps) => [...prevsnaps, { alias: data.alias, lineSnap: data.lineSnap }]);
        console.log(data);
      });
      socket.on('areaSnapToWebsite', (data) => {
        // Update the areaSnaps state with the received message
        setSnaps((prevsnaps) => [...prevsnaps, { alias: data.alias, lineSnap: data.areaSnap }]);
        console.log(data);
      });
    }
  }, [socket]);

  useEffect(() => {
    // Update filteredSnaps whenever snaps or selectedAlias changes
    setFilteredSnaps(selectedAlias ? snaps.filter(({ alias }) => alias === selectedAlias) : snaps);
  }, [snaps, selectedAlias]);

  const calculateCenter = () => {
    if (snaps.length === 0) {
      return { lat: 20.5937, lng: 78.9629 }; // Default center if there are no points
    }

    const sumLat = snaps.reduce((sum, { lineSnap }) => sum + lineSnap.latitude, 0);
    const sumLng = snaps.reduce((sum, { lineSnap }) => sum + lineSnap.longitude, 0);

    const avgLat = sumLat / snaps.length;
    const avgLng = sumLng / snaps.length;

    return { lat: avgLat, lng: avgLng };
  };

  const aliasColorMap = {};

  const handleAliasChange = (event) => {
    setSelectedAlias(event.target.value);
  };


  return (
    <div className='lineSnap'>
      <h4>Live Snapping</h4>
      <div>
        <div className='card2'>
          {/* Add the select dropdown */}
          <label htmlFor="aliasSelect">Select Alias: </label>
          <select id="aliasSelect" onChange={handleAliasChange} value={selectedAlias || ''}>
            <option value="">All</option>
            {/* Map through unique aliases and create an option for each */}
            {[...new Set(snaps.map(({ alias }) => alias))].map((alias) => (
              <option key={alias} value={alias}>
                {alias}
              </option>
            ))}
          </select>
          <table>
            <thead>
              <tr>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Timestamp</th>
                <th>Alias</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through the filteredSnaps instead of snaps */}
              {filteredSnaps.map(({ alias, lineSnap }) => (
                <tr key={`${lineSnap.latitude}-${lineSnap.timestamp}`}>
                  <td>{lineSnap.latitude}</td>
                  <td>{lineSnap.longitude}</td>
                  <td>{lineSnap.timestamp}</td>
                  <td>{alias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoaded ? (
          <div className='card2'>
            <GoogleMap
              center={calculateCenter()}
              zoom={5}
              mapContainerStyle={{ height: '300px', width: '100%' }}
            >
              {filteredSnaps.reduce((markers, { alias, lineSnap }) => {
                if (!aliasColorMap[alias]) {
                  aliasColorMap[alias] = getRandomColor();
                }

                markers.push(
                  <Marker
                    key={`${alias}-${lineSnap.timestamp}`}
                    position={{ lat: lineSnap.latitude, lng: lineSnap.longitude }}
                  // icon={{
                  //   path: 'M10 0C4.477 0 0 4.477 0 10c0 6.063 8.66 18.184 9 18.711.344.527 1.567.527 1.911 0 .34-.527 9-12.648 9-18.711 0-5.523-4.477-10-10-10zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z', // Custom SVG path for the marker
                  //   fillColor: aliasColorMap[alias], // Set the fill color dynamically based on alias
                  //   fillOpacity: 1.0,
                  //   strokeWeight: 1,
                  //   strokeColor: '#fdhhks',
                  //   scale: 1, // Adjust the scale as needed
                  // }}
                  />
                );

                return markers;
              }, [])}
            </GoogleMap>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default LineSnap;
