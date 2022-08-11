// The Spatial.js is a component to read a csv file and a Geojson file and draw the geosankey diagram on the map.
// References: https://github.com/geodesign/spatialsankey, https://github.com/UNFPAmaldives/migration

import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
//import ReactDOMServer from "react-dom/server";
import L from "leaflet";

import * as d3 from "d3";
import axios from "axios";
import ReactDOM from "react-dom/client";
import IntraTabs from "./Tab";
import _ from "lodash";
import { set } from "lodash";

import "./Style.css"
import "leaflet/dist/leaflet.css";

import 'leaflet.markercluster';
import '@elfalem/leaflet-curve';
import 'leaflet-area-select';


const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

var nodeLayers = {};
var linkLayers = {};


var groupby_fields_region = [
  "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id",
  "voyage_itinerary__imp_principal_region_slave_dis__geo_location__id",
];

// only use for pivot table
var groupby_fields_region_name = [
  "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name",
  "voyage_itinerary__imp_principal_region_slave_dis__geo_location__name",
];

var groupby_fields_port = [
  "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id",
  "voyage_itinerary__imp_principal_port_slave_dis__geo_location__id",
];

// only use for pivot table
var groupby_fields_port_name = [
  "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name",
  "voyage_itinerary__imp_principal_port_slave_dis__geo_location__name",
];

var value_field_tuple = [
  "voyage_slaves_numbers__imp_total_num_slaves_embarked",
  "sum",
];

var cachename = "voyage_maps";
var dataset = [0, 0];
var output_format = "geosankey";

export const PivotContext = React.createContext({});
var customIcon = L.divIcon({ className: "leaflet-div-icon2" });
L.Marker.prototype.options.icon = customIcon;

// Drawing nodes and edges on the map
export function ReadFeature(props) {

  console.log("LatLong: ", props.latlong)


  const [isLoading, setIsLoading] = useState(false);
  const [isRegion, setIsRegion] = useState(true);

  const [csv, setCsv] = useState(null);
  const [nodes, setNodes] = useState(null);

  const [groupby_fields, setGroupBy] = useState(groupby_fields_region); // used for aggroutes useEffect

  const map = useMap();

  // tab selection in popup
  const [disembark, setDisembark] = React.useState(
    "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name"
  );
  const [area, setArea] = useState(groupby_fields_region[0]); // port or region
  const [complete_object, set_complete_object] = useState({
    groupby_fields: groupby_fields_region_name,
    value_field_tuple: value_field_tuple,
    cachename: ["voyage_pivot_tables"],
  });

  var markers = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
      return L.divIcon({
        html: "<div><span>" + cluster.getChildCount() + "</span></div>",
        className: " cluster-small",
      });
    },
  });

  // Switching region/port views based on map zoom level
  map.on("zoomend", function () {
    if (map.getZoom() < 8) {
      setGroupBy(groupby_fields_region);
      setIsRegion(true);
      setDisembark("voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id");
      set_complete_object({
        ...complete_object,
        groupby_fields: groupby_fields_region_name,
      });
      setArea(groupby_fields_region[0]);
    } else {
      setGroupBy(groupby_fields_port);
      setIsRegion(false);
      setDisembark("voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id");
      set_complete_object({
        ...complete_object,
        groupby_fields: groupby_fields_port_name,
      });
      setArea(disembark);
    }
  });

  useEffect(() => {
    var data = new FormData();
    for (var property in props.search_object) {
      props.search_object[property].forEach((v) => {
        data.append(property, v);
      });
    }
    data.append("dataset", props.dataset);
    data.append("dataset", props.dataset);
    data.append("groupby_fields", groupby_fields[0]);
    data.append("groupby_fields", groupby_fields[1]);
    data.append("value_field_tuple", value_field_tuple[0]);
    data.append("value_field_tuple", value_field_tuple[1]);
    data.append("cachename", cachename);
    data.append("output_format", output_format);

    axios.post("/voyage/aggroutes", data).then(function (response) {
      setIsLoading(true);
      setCsv(response.data.routes);
      setNodes(response.data.points);
      
    });
  }, [props.search_object, groupby_fields, props.dataset]);

  // Update complete object based on tab selection in popup
  // useEffect(() => {
  //   //selected disembark
  //   if(isRegion==false){
  //     var [embkey, diskey] = groupby_fields_port;
  //   }
  //   else{
  //     var [embkey, diskey] = groupby_fields_region;
  //   }
  //   if (disembark === diskey) {
  //     //if currently search_object is embark
  //     // console.log("🚀 ~ file: Spatial.js ~ line 95 ~ useEffect ~ DISEMBARK")
  //     const res = delete Object.assign(complete_object, {
  //       [diskey]: complete_object[embkey],
  //     })[embkey];
  //     // console.log("🚀 ~ file: Spatial.js ~ line 150 ~ useEffect ~ res", res)
  //     set_complete_object(complete_object);
  //     // }
  //   } else {
  //     //  console.log("🚀 ~ file: Spatial.js ~ line 95 ~ useEffect ~ EMBARK")
  //     const res = delete Object.assign(complete_object, {
  //       [embkey]: complete_object[diskey],
  //     })[diskey];
  //     // console.log("🚀 ~ file: Spatial.js ~ line 150 ~ useEffect ~ res", res)
  //     set_complete_object(complete_object);
  //   }

  //   console.log(
  //     "🚀 ~ file: Spatial.js ~ line 176 ~ useEffect ~ complete_object",
  //     JSON.parse(JSON.stringify(complete_object))
  //   );
  // }, [disembark]);

  // useEffect(() =>{
  //   let point = complete_object[area];
  //   if (area === groupby_fields_region[0]){
  //       delete Object.assign(complete_object, {[area]: point })[disembark];
  //     }
  //   else if (area === disembark) {
  //       delete Object.assign(complete_object, {[area]: point })[groupby_fields_region[0]];
  //    }
  //    set_complete_object(complete_object)
  // },[area])  

  useEffect(() => {
    // map.on('popupopen', function(){

    const container = L.DomUtil.create("div");

    const root = ReactDOM.createRoot(container);
  }, [complete_object]);

  useEffect(() => {
    for (var i in map._layers) {
      if (
        map._layers[i]._path != undefined ||
        map._layers[i]._layers != undefined
      ) {
        try {
          map.removeLayer(map._layers[i]);
        } catch (e) {
          console.log("problem with " + e + map._layers[i]);
        }
      }
    }
    //filter nodes so that the return nodes are all on the left/right of longitude -23.334960 and are not ocean waypts
    var filterNodes = (feature) => {
      //if embarkation is selected; only show nodes on African side
      // if (props.radio == "embarkation") {
      if (props.key == "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name") {
        console.log("Filter embarkation locations")
        return (
          feature.geometry.coordinates[0] >= -23.33496 &&
          !feature.properties.name.includes("ocean waypt")
        );
      } else {
        //if disembarkation is selected, only show nodes on American side
        console.log("Filter Disembarkation locations")
        return (
          feature.geometry.coordinates[0] < -23.33496 &&
          !feature.properties.name.includes("ocean waypt")
        );
      }
    };


    if (nodes) {
      // Add all features for drawing links (including waypoints to nodeslayers)
      L.geoJSON(nodes.features, {
        onEachFeature: function (feature, layer) {
          nodeLayers[feature.id] = {
            layer: layer,
          };
        },
      });
      map.removeLayer(markers);
      // Add only actual locations to the map with markers (with clicking events and popups)
      if (!props.filter) {
        filterNodes = (feature) => {
          return true;
        };
      }
      L.geoJSON(nodes.features, {
        filter: filterNodes,
        onEachFeature: function (feature, layer) {

          layer.on("click", function (e) {

            const temp = complete_object;
            delete temp[groupby_fields_region[0]];
            delete temp[groupby_fields_region[1]];
            delete temp[groupby_fields_port[0]];
            delete temp[groupby_fields_port[1]];
            if(isRegion){
              complete_object[groupby_fields_region[0]] = [layer.feature.id, layer.feature.id];
            }
            else{
              complete_object[groupby_fields_port[0]] = [layer.feature.id, layer.feature.id];
            }
            //complete_object["dataset"]=[props.dataset, props.dataset]
            //set_complete_object({...temp, [disembark]:[layer.feature.id, layer.feature.id]})
            const container = L.DomUtil.create("div");
            var event = new Event('update_popup');
            const state={complete_object, set_complete_object, disembark, setDisembark, layer}
            var dispatch=()=>{document.querySelector(".leaflet-popup-pane").dispatchEvent(event)};
            ReactDOM.createRoot(container).render(
                <IntraTabs state={state} dispatch={dispatch} dataset={props.dataset[0]} title={layer.feature.properties.name +" " +layer.feature.geometry.coordinates} isRegion={isRegion}/>  
            );

            // L.marker(layer["_latlng"]).addTo(map).bindPopup(container, {
            //   maxWidth: "auto",
            // });
            markers.addLayer(layer).bindPopup(container, { maxWidth: "800", maxHeight: "300" });
            // var popup = L.popup();
            // layer.on('click', (e)=> {
            //   popup.setContent(container, {maxWidth:"auto"}).setLatLng(e.target.getLatLng()).addTo(map)
            // })
          });
          markers.addLayer(layer);
        },
      });

      map.addLayer(markers);
      // DrawLink(map, csv);
      drawUpdate(map, csv);
    }

    document.querySelector(".leaflet-popup-pane").addEventListener("update_popup", function (event) {
      var tagName = event.target.tagName,
          popup = map._popup; 
      popup.update();
    }, true); // Capture the load event, because it does not bubble.

    let drawbox = L.rectangle(props.latlong, {
      color: "red",
      weight: 3,
      fillOpacity: 0.0,
    });
    drawbox.addTo(map);
  }, [nodes, csv, props.search_object.dataset, complete_object]);

  if (isLoading == false) {
    return "isLoading";
  }

  return null;
}

function drawUpdate(map, routes) {
  var valueMin = d3.min(routes, function (l) {
    return l[2];
  });
  var valueMax = d3.max(routes, function (l) {
    return l[2];
  });

  var valueScale = d3.scaleLinear().domain([valueMin, valueMax]).range([1, 10]);

  routes.map((route) => {
    var commands = [];

    commands.push("M", route[0][0]);
    commands.push("C", route[1][0], route[1][1], route[0][1]);

    L.curve(commands, { color: "blue", weight: valueScale(route[2]) })
      .bindPopup("Sum of slaves: " + route[2])
      .addTo(map);
  });
}
