import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


const AreaSnap = ({ socket }) => {
  const [areaSnaps, setAreaSnaps] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    libraries: ['geometry', 'places'],
  });

  useEffect(() => {
    if (socket) {
      socket.on('areaSnapToWebsite', (data) => {
        // Update the areaSnaps state with the received message
        setAreaSnaps((prevAreaSnaps) => [...prevAreaSnaps, { alias: data.alias, areaSnap: data.areaSnap }]);
        console.log(data);
      });
    }
  }, [socket]);

  const calculateCenter = () => {
    if (areaSnaps.length === 0) {
      return { lat: 20.5937, lng: 78.9629 }; // Default center if there are no points
    }

    const sumLat = areaSnaps.reduce((sum, { areaSnap }) => sum + areaSnap.latitude, 0);
    const sumLng = areaSnaps.reduce((sum, { areaSnap }) => sum + areaSnap.longitude, 0);

    const avgLat = sumLat / areaSnaps.length;
    const avgLng = sumLng / areaSnaps.length;

    return { lat: avgLat, lng: avgLng };
  };

  const aliasColorMap = {};

  return (
    <div className='areaSnap'>
      <h4>Area Snapping</h4>
      <div>
        <div className='card2'>
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
              {areaSnaps.map(({ alias, areaSnap }) => (
                <tr key={`${alias}-${areaSnap.timestamp}`}>
                  <td>{areaSnap.latitude}</td>
                  <td>{areaSnap.longitude}</td>
                  <td>{areaSnap.timestamp}</td>
                  <td>{alias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='card2'>
          {isLoaded ? (
            <GoogleMap
              center={calculateCenter()}
              zoom={5}
              mapContainerStyle={{ height: '300px', width: '100%' }}
            >
              {areaSnaps.reduce((markers, { alias, areaSnap }) => {
                if (!aliasColorMap[alias]) {
                  aliasColorMap[alias] = getRandomColor();
                }

                markers.push(
                  <Marker
                    key={`${alias}-${areaSnap.timestamp}`}
                    position={{ lat: areaSnap.latitude, lng: areaSnap.longitude }}
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
          ) : (
            <div>Loading...</div>
          )}

        </div>
      </div>
    </div>
  )
}

export default AreaSnap