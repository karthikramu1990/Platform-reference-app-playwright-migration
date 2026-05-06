import React, { useEffect } from "react";
import { IafResourceUtils } from '../../../core/IafResourceUtils.js';
import IafUtils from "../../../core/IafUtils.js";

export const IafGeoCoder = ({ map, zoom = 18, speed = 1.2, curve = 1.42, onLocationSelect, iafViewer }) => {
    useEffect(() => {
      const initializeSearchBox = async () => {
        try {
          // Load required Mapbox search resources
          await IafResourceUtils.loadMapboxGeocoder();
          if (!map || !mapboxgl || !mapboxsearch?.MapboxSearchBox) return;
  
          // Instantiate and configure the MapboxSearchBox
          const searchBox = new mapboxsearch.MapboxSearchBox();
          searchBox.accessToken = mapboxgl.accessToken;
          searchBox.options = { language: 'es' };
          searchBox.mapboxgl = mapboxgl;
          searchBox.marker = false;
  
          // Bind to the map and attach to the DOM
          searchBox.bindMap(map);
          const searchBoxElement = document.getElementById(iafViewer.evmElementIdManager.getEvmElementUuidGeoCoder());
          if (searchBoxElement) {
            searchBoxElement.appendChild(searchBox);
          }
  
          
          searchBox.addEventListener("retrieve", (event) => {
            const result = event?.detail?.features?.[0];
            if (result && onLocationSelect) {
              map.flyTo({
                center: result.geometry.coordinates,
                zoom,
                speed,
                curve,
                essential: true,
              });
  
              map.once("moveend", () => {
                IafUtils.devToolsIaf && console.log("IafGeoCoder.flyTo.moveend", "FlyTo animation complete!");
                onLocationSelect(result);
              });
            }
          });
  
          // Cleanup on unmount
          return () => {
            if (searchBoxElement) {
              searchBoxElement.innerHTML = "";
            }
          };
        } catch (error) {
          console.error("Error initializing Mapbox Search:", error);
        }
      };
  
      initializeSearchBox();
    }, [map]);
  
    return (
      <div id={iafViewer.evmElementIdManager.getEvmElementUuidGeoCoder()}>
        {/* Geocoder dynamically injected here */}
      </div>
    );
  };