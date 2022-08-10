import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer,FeatureGroup,Marker, Popup,useMapEvents,LayersControl, useMap, GeoJSON} from "react-leaflet";
import "./Style.css"
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-timedimension";
import "../../../../node_modules/leaflet-timedimension/dist/leaflet.timedimension.control.min.css";


import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import 'leaflet-area-select';
import AreaSelect from "./AreaSelect";
import { ReadFeature } from "./Spatial.js"
import 'leaflet.markercluster';

import "@elfalem/leaflet-curve";

// import * as d3 from "d3"

var d3 = require("d3")
// import {d3-geo} from "d3"


// import * as turf from "@turf/turf"

// import * as file from "./example_routes.json";

// import * as file from "./example.json";

const { BaseLayer } = LayersControl;

// const json = require("./transatlantic_bezier_example.json")
// const json2 = require("./iam.json")
// const json = require("./response.json")
const file = require("./example.json")

//https://github.com/tomik23/react-leaflet-examples/tree/main/src/pages
//pass location to routing https://codesandbox.io/s/react-leaflet-v3-how-to-dynamicallly-pass-the-routing-coordinates-to-leaflet-routing-using-react-hooks-852ji?file=/src/App.js

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});



const center = [23.486678, -88.59375]


const Map = () => {
  const rMachine = useRef();
  const [points, setPoints] = useState(true);

  const [longitude1, onChangelongitude1] = React.useState(0);
  const [longitude2, onChangelongitude2] = React.useState(359);
  const [latitude1, onChangelatitude1] = React.useState(-90);
  const [latitude2, onChangelatitude2] = React.useState(90);

  const [radioOptions, onChangeRadioOption] = React.useState("embarkation");

  const getRadioValue = (event) => {
    onChangeRadioOption(event.target.value);
    console.log(radioOptions);
  }

  const [search_object, set_search_object] = useState({});

  useEffect(() => {
    

    if(radioOptions=="embarkation"){
      set_search_object({
        "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude": [latitude1, latitude2],
        "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude": [longitude1, longitude2]
      });
    }
    else{
      set_search_object({
        "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude": [latitude1, latitude2],
        "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude": [longitude1, longitude2]
      });
    }
  }, [longitude1, longitude2, latitude1, latitude2, radioOptions]);

  const normal = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
  const noBorder = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`


  const line = (coord1, coord2) => {

    const lengthX = coord2.x - coord1.x;
    const lengthY = coord2.y - coord1.y;
    
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };
  
  var smoothing_factor = 0.15

  const controlPoint = (
    smoothing,
    map,
    current,
    previous,
    next
  ) => {

    const p = previous || current;
    const n = next || current;


    const currPoint = map.latLngToLayerPoint(L.latLng(current));
    const prevPoint = map.latLngToLayerPoint(L.latLng(p));
    const nextPoint = map.latLngToLayerPoint(L.latLng(n));

    var l= line(prevPoint, nextPoint)

    l.length = l.length * smoothing

    const x = currPoint.x + Math.cos(l.angle) * l.angle;
    const y = currPoint.y + Math.sin(l.length) * l.length;

    const { lat, lng } = map.layerPointToLatLng([x, y]);

    return [lat, lng]
  }
  
  function drawCurve (map, points) {
    const first = points[0]
    var pl = points.length;

    const controlPoints = [];

    for (let i = 0; i < pl; i++) {
      controlPoints.push(
        controlPoint(
          smoothing_factor,
          map,
          points[i],
          points[i + 1],
          points[i - 1]
        )
      );
      controlPoints.push(
        controlPoint(
          smoothing_factor,
          map,
          points[i],
          points[i - 1],
          points[i + 1]
        )
      );
    }

     /* Remove first (and last) control points for open shapes */
     controlPoints.shift();
     /* Push one last control point just before the last reference point, has no 'next' */
     controlPoints.push(
       controlPoint(
        smoothing_factor,
         map,
         points[pl - 1],
         undefined,
         points[pl - 2]
       )
     );

    //  const commands = ["M", [first.lat, first.lng]]; // Begin with placing pen at first point 
     const commands = ["M", [first[0], first[1]]]; // Begin with placing pen at first point 
     
     const commands1 = ["M", [first[0], first[1]]];
     const commands2 = ["M", [first[0], first[1]]];

     var cp1 = controlPoints.shift();
     var cp2 = controlPoints.shift();
     var destination = points.shift();
     commands.push(...(["Q", cp1, [destination[0], destination[1]]]));
     commands1.push(...(["Q", cp1, [destination[0], destination[1]]]));
     commands2.push(...(["C", cp1, cp2 [destination[0], destination[1]]]));

     while (points.length > 0) {
       cp1 = controlPoints.shift();
       cp2 = controlPoints.shift();

      destination = points.shift();
      console.log("Destination: ", destination)
      // commands.push(...(["C", cp1, cp2, [destination.lat, destination.lng]]));
      commands.push(...(["Q", cp1, [destination[0], destination[1]]]));
      commands1.push(...(["S", cp1, [destination[0], destination[1]]]));
      commands2.push(...(["C", cp1, cp2 [destination[0], destination[1]]]));
      // commands.push(...(["T", [destination[0], destination[1]]]));
    }

    console.log("Command: ", commands)
    L.curve(commands, {color: 'red', weight: 1}).addTo(map)
    L.curve(commands1, {color: 'blue', weight: 1}).addTo(map)
    L.curve(commands2, {color: 'yellow', weight: 1}).addTo(map)
  }


  function draw(map, route) {

    var weight = route[0]

    var commands = []
    commands = ["M", route[1]]

    L.marker(route[1]).addTo(map)

    commands.push("Q", route[2][0], route[2][1])
    L.marker(route[2][1]).addTo(map)

    for(var i = 3; i < route.length; i++) {
      commands.push("C", route[i][0], route[i][1], route[i][2])
      // L.marker(route[i][0]).bindPopup(route[i][0].toString()).addTo(map)
      L.marker(route[i][2]).addTo(map)
    }

    // console.log("Commands: ", commands)

    L.curve(commands, {color:'blue', weight: weight*0.1}).addTo(map);
  }




  function drawUpdate(map, routes) {

    console.log(routes)

    var valueMin = d3.min(routes, function (l) {
      return l[2];
    });
    var valueMax = d3.max(routes, function (l) {
      return l[2];
    });
    
    var valueScale = d3.scaleLinear().domain([valueMin, valueMax]).range([1, 10]);


    routes.map(route => {
      var commands = [];

      console.log("weight: ", route[2])

      commands.push('M', route[0][0])
      commands.push('C', route[1][0], route[1][1], route[0][1])

      L.curve(commands, {color: 'blue', weight: valueScale(route[2])}).bindPopup("Sum of slaves: " + route[2]).addTo(map)
    })

  }


  function MyComponent() {
    
    const map = useMapEvents({
      click: (e) => {

        // L.timeDimension().addTo(map);
        // L.control.timeDimension().addTo(map);
        // drawUpdate(map, json.routes)

        map.timeDimension.on("timeloading", (data) => {
          // console.log("Time Loading");
        });

        var line = [];
        var points = [];

        file.routes.map((route) => {
          line.push([route[0][0], route[0][1]])
          points.push(route[0][0])
          points.push(route[0][1])
        })

        var svg = d3.select(map.getPanes().overlayPane).append("svg")
        var width = 960, height = 500;
        
        // define projection
        var projection = d3.geo.conicConformal()
                                .rotate([98, 0])
                                .center([0, 38])
                                .parallels([29.5, 45.5])
                                .scale(1000) // Change to 300 to zoom out
                                .translate([width / 2, height / 2]);

        // var transform = d3.geo.transform({point, projectPoint});
        // var path = d3.geo.path().projection(transform);

        // project
        var path = d3.geo.path()
            .projection(projection);   

        // define line property
        var line = d3.svg.line()
            .interpolate("cardinal-closed")
            .x(function(d) { return projection(d)[0]; })
            .y(function(d) { return projection(d)[1]; });

        // 
        svg.append("g")
            .attr("class", "land")
          // .selectAll("path")
          //   .data(topojson.feature(us, us.objects.state_pol).features) 
          .enter().append("path")
            .attr("class", function(d) {return d.id})
            .attr("d", path)
        
        // define path from points
        var linepath = svg.append("path")
            .data([points])
            .attr("d", line)
            .attr('class', 'journey');
      
        // append circles to points
        svg.selectAll(".point")
            .data(points)
          .enter().append("circle")
            .attr("r", 8)
            .attr("transform", function(d) { return "translate(" + projection(d) + ")"; });
      
        // define circle transformation
        var circle = svg.append("circle")
            .attr("r", 19)
            .attr("transform", "translate(" + projection(points[0]) + ")");

        transition();



        function transition() {
          circle.transition()
              .duration(10000)
              .attrTween("transform", translateAlong(linepath.node()))
              .each("end", transition);
        }


        function translateAlong(path) {
          var l = path.getTotalLength();
          return function(d, i, a) {
            return function(t) {
              var p = path.getPointAtLength(t * l);
              return "translate(" + p.x + "," + p.y + ")";
            };
          };
        }

        function projectPoint(x, y) {
          var point = map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        }

      },

    });
    return null;
  }

  const customPopup = (
    <iframe
      width="auto"
      title="Marek Grechuta"
      height="310"
      src="https://www.youtube.com/embed/glKDhBuoRUs"
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );

  

  const onClickFeature = (feature, layer) => {
      layer.bindPopup(function (layer) {
        // adding popup to port / link
        if(layer.feature.properties.name)
          return layer.feature.properties.name;
        else
          return layer.feature.geometry.type;
      });

      layer.on({
        click: (event) => {
          event.target.setStyle(
            {
              color: "green"
            }
          );
        }
      });
  }

  let currentTime = new Date();

  const timeDimensionOptions = {
    timeInterval: "2021-07-01/" + "2050-07-01",
    period: "P1Y",
    currentTime: Date.parse("2020-01-01")
  };

  return (
    <div>
      <FormControl>
        <FormLabel id="boundingBoxFilter">Bounding box select options</FormLabel>
        <RadioGroup
            row
            aria-labelledby="boundingBoxFilter"
            defaultValue="embarkation"
            name="radio-buttons-group"
            onChange={getRadioValue}
        >
            <FormControlLabel value="embarkation" control={<Radio />} label="embarkation" />
            <FormControlLabel value="disembarkation" control={<Radio />} label="disembarkation" />
        </RadioGroup>
        </FormControl>

        
      <MapContainer
        id="mapId"
        center={center}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100vh' }}
        timeDimension={{position: "topright"}}
        timeDimensionOptions={timeDimensionOptions}
        timeDimensionControl={true}
      >
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=' &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors"'
        /> */}  
      
        <button>Example</button>
        <LayersControl position="bottomleft">
              <BaseLayer name="modern country border">
              <TileLayer
                url={normal}
                attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
              /> 
              </BaseLayer>
              <BaseLayer checked name="no country border">
              <TileLayer
                url={noBorder}
                attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
              />
              </BaseLayer>
        </LayersControl>

        <MyComponent/>
        {/* <ReadFeature search_object={search_object}/> */}

        {/* <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                  onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2}  /> */}

      </MapContainer>
    </div>
  );
};

// };
export default Map;