import React from 'react';
import {createRoot} from 'react-dom/client';
import {Map, NavigationControl, useControl} from 'react-map-gl';
import {H3HexagonLayer} from 'deck.gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import lub_pop_data from './lub_pop_h3.json';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';
const geoRegionPoints = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_geography_regions_points.geojson';
const geoRegionPolys = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_geography_regions_polys.geojson';
const testH3data = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/test-data/h3/8148bffffffffff.json';
const sfH3Data = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.h3cells.json';

// Set your Mapbox token here or via environment variable
const MAPBOX_TOKEN = "pk.eyJ1IjoiZXJpY2tlcm5leSIsImEiOiJja2FjbTNiMXcwMXp1MzVueDFjdDNtcW92In0.LW0qdB-2FmA3UK51M67fAQ"; 
const INITIAL_VIEW_STATE = {
  latitude: 33.4,
  longitude: -102,
  zoom: 7,
  bearing: 0,
  pitch: 0
};
const MAP_STYLE = 'mapbox://styles/mapbox/dark-v9';
function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

function Root() {
  
  const getHexColor = (d) => 
  d < 1 ? [252, 231, 36, 5] 
  : d <= 100 ? [86,198,102, 127]
    : d <= 1000 ? [32, 150, 139, 127]
      : d <= 10000 ? [62, 71, 136, 127]
        : [69, 13, 84, 127];

  function getTooltip({object, coordinate}) {
    if (!object) {
      return null;
    }
    return (
      {
      html: `\
      <div><b>${object.pop_den}</b> pop density sq/mi</div>
      `
      }
    );
  }

  const newLayers =  [
    new H3HexagonLayer({
      id: 'H3HexagonLayer',
      data: lub_pop_data,
      extruded: false,
      getHexagon: (d) => d.hex,
      getFillColor: d => getHexColor(d.pop_den), 
      autoHighlight: true,
    //   getElevation: (d) => d.temp^5,
      getLineWidth: 0,
      pickable: true,
    })
  ]

  return (
    <>
    <Map
      initialViewState={INITIAL_VIEW_STATE}
      mapStyle={MAP_STYLE}
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <DeckGLOverlay 
          layers={newLayers} 
          controller={true}
          getTooltip={getTooltip}
          /* interleaved*/ />
      <NavigationControl position="top-left" />
    </Map>
    </>
  );
}

const container = document.body.appendChild(document.createElement('div'));
createRoot(container).render(<Root />);
