import React, { useState } from 'react';
import {
  Map,
  GoogleApiWrapper,
  Marker,
  InfoWindow,
  Polygon,
  Polyline,
} from 'google-maps-react';
const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_API_KEY;

const MapContainer = (props) => {
  const [markers, setMarkers] = useState([]);
  const [outMarkers, setOutMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 37.513571, lng: 127.054629 });
  const [activeMarker, setActiveMarker] = useState(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);

  const [waypoints, setWaypoints] = useState([]);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          console.log(json);
          if (json.waypoints && Array.isArray(json.waypoints)) {
            const w = json.waypoints.map((item) => ({
              lat: item.latitude,
              lng: item.longitude,
            }));

            setWaypoints(w);
            console.log(w);
          }

          if (json.metadata.inner_boundary) {
            const newMarkers = [
              {
                lat: json.metadata.inner_boundary.left_top.latitude,
                lng: json.metadata.inner_boundary.left_top.longitude,
                label: '1',
              },
              {
                lat: json.metadata.inner_boundary.left_bottom.latitude,
                lng: json.metadata.inner_boundary.left_bottom.longitude,
                label: '2',
              },
              {
                lat: json.metadata.inner_boundary.right_bottom.latitude,
                lng: json.metadata.inner_boundary.right_bottom.longitude,
                label: '3',
              },
              {
                lat: json.metadata.inner_boundary.right_top.latitude,
                lng: json.metadata.inner_boundary.right_top.longitude,
                label: '4',
              },
            ];
            setMarkers(newMarkers);
            // 4개의 점의 가운데로 지도 이동
            const newCenter = {
              lat:
                (newMarkers[0].lat +
                  newMarkers[1].lat +
                  newMarkers[2].lat +
                  newMarkers[3].lat) /
                4,
              lng:
                (newMarkers[0].lng +
                  newMarkers[1].lng +
                  newMarkers[2].lng +
                  newMarkers[3].lng) /
                4,
            };
            setCenter(newCenter);
          }

          if (json.metadata.outer_boundary) {
            const outMarkers = [
              {
                lat: json.metadata.outer_boundary.left_top.latitude,
                lng: json.metadata.outer_boundary.left_top.longitude,
                label: '1',
              },
              {
                lat: json.metadata.outer_boundary.left_bottom.latitude,
                lng: json.metadata.outer_boundary.left_bottom.longitude,
                label: '2',
              },
              {
                lat: json.metadata.outer_boundary.right_bottom.latitude,
                lng: json.metadata.outer_boundary.right_bottom.longitude,
                label: '3',
              },
              {
                lat: json.metadata.outer_boundary.right_top.latitude,
                lng: json.metadata.outer_boundary.right_top.longitude,
                label: '4',
              },
            ];
            setOutMarkers(outMarkers);
          }
        } catch (error) {
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  const onMoveClick = () => {
    // 이동 버튼 클릭 시 구글지도에서 입력받은 gps 위치로 이동
    const newMarkers = [
      {
        lat: parseFloat(document.getElementById('lat1').value),
        lng: parseFloat(document.getElementById('lng1').value),
        label: '1',
      },
      {
        lat: parseFloat(document.getElementById('lat2').value),
        lng: parseFloat(document.getElementById('lng2').value),
        label: '2',
      },
      {
        lat: parseFloat(document.getElementById('lat3').value),
        lng: parseFloat(document.getElementById('lng3').value),
        label: '3',
      },
      {
        lat: parseFloat(document.getElementById('lat4').value),
        lng: parseFloat(document.getElementById('lng4').value),
        label: '4',
      },
    ];
    setMarkers(newMarkers);

    // 4개의 점의 가운데로 지도 이동
    const newCenter = {
      lat:
        (newMarkers[0].lat +
          newMarkers[1].lat +
          newMarkers[2].lat +
          newMarkers[3].lat) /
        4,
      lng:
        (newMarkers[0].lng +
          newMarkers[1].lng +
          newMarkers[2].lng +
          newMarkers[3].lng) /
        4,
    };
    setCenter(newCenter);
  };

  const onMarkerClick = (props, marker) => {
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const onClose = () => {
    if (showingInfoWindow) {
      setActiveMarker(null);
      setShowingInfoWindow(false);
    }
  };

  return (
    <div>
      <div>
        <text>Point 1</text>
        <input type='text' id='lat1' placeholder='latitude' />
        <input type='text' id='lng1' placeholder='longitude' />
      </div>
      <div>
        <text>Point 2</text>
        <input type='text' id='lat2' placeholder='latitude' />
        <input type='text' id='lng2' placeholder='longitude' />
      </div>
      <div>
        <text>Point 3</text>
        <input type='text' id='lat3' placeholder='latitude' />
        <input type='text' id='lng3' placeholder='longitude' />
      </div>
      <div>
        <text>Point 4</text>
        <input type='text' id='lat4' placeholder='latitude' />
        <input type='text' id='lng4' placeholder='longitude' />
      </div>
      <div>
        <button onClick={onMoveClick}>이동</button>
        <input type='file' onChange={onFileChange} />
      </div>
      <Map
        google={props.google}
        zoom={20}
        initialCenter={center}
        center={center}
        mapType='satellite'
      >
        {/* {markers.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
        ))} */}
        {outMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={onMarkerClick}
            label={marker.label}
          />
        ))}
        <Polygon
          paths={markers}
          strokeColor='#0000ee'
          strokeOpacity={0.8}
          strokeWeight={5}
          fillColor='#00000F'
          fillOpacity={0.02}
        />
        <Polygon
          paths={outMarkers}
          strokeColor='#00cc00'
          strokeOpacity={0.7}
          strokeWeight={4}
        />
        <Polyline
          path={waypoints}
          strokeColor='#eeeeee'
          strokeOpacity={0.8}
          strokeWeight={3}
        />
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
          onClose={onClose}
        >
          <div>{activeMarker && activeMarker.label}</div>
        </InfoWindow>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAP_API_KEY,
})(MapContainer);
