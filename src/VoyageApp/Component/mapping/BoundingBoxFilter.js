import React, { useState, useEffect } from 'react'
import {MapContainer, TileLayer, LayersControl} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import { Button } from '@mui/material';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Avatar from 'react-avatar';

import 'leaflet-area-select';
import AreaSelect from "./AreaSelect";
import axios from 'axios';
import { ReadFeature } from "./Spatial.js"
import map_icon from "./map_icon.png";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import L from 'leaflet'

import emb_icon from "./emb_icon.png"
import disemb_icon from "./disemb_icon.png"

const { BaseLayer } = LayersControl;
//+ '?hierarchical=false'
const location_url = '/voyage/aggroutes' 

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export default function BoundingBoxFilter(props){

    const [radioOptions, onChangeRadioOption] = React.useState("embarkation");
   
    
    const [longitude1, onChangelongitude1] = React.useState(-360);
    const [longitude2, onChangelongitude2] = React.useState(359.99);
    const [latitude1, onChangelatitude1] = React.useState(-90);
    const [latitude2, onChangelatitude2] = React.useState(90);

    
    const {set_search_object, search_object, labels, setLabels} = React.useContext(props.context);
    
    //const [map_search_object, set_map_search_object] = useState(search_object);

    const [selectMode, SetselectMode] = useState(false);

    const [latlong, setlatlong] = useState([[0, 0], [0, 0]]);
    
    const handle = useFullScreenHandle();

    useEffect(() => {
        var out;
        if(radioOptions=="embarkation"){
            if(!labels.some(e=>e.option == "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name")){
                setLabels([...labels, {option:"voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name", type:"<class 'rest_framework.fields.Map'>", label:""}])
            }
            

            let newObject = { ...search_object };
            out = "embarkation***<class 'rest_framework.fields.Map'>***Map embarkation filter";

            delete newObject["voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude"];
            delete newObject["voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude"];
            //set_search_object(newObject);
            set_search_object({
                ...newObject,
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude": [latitude1, latitude2],
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude": [longitude1, longitude2]
            });
        }
        else{
            if(!labels.some(e=>e.option == "voyage_itinerary__imp_principal_port_slave_dis__geo_location__name")){
                setLabels([...labels, {option:"voyage_itinerary__imp_principal_port_slave_dis__geo_location__name", type:"<class 'rest_framework.fields.Map'>", label:""}])
            }

            let newObject = { ...search_object };
            out = "disembarkation***<class 'rest_framework.fields.Map'>***Map disembarkation filter";

            delete newObject["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude"];
            delete newObject["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude"];

            console.log("New OBject: ", newObject)
            //set_search_object(newObject);
            set_search_object({
                ...newObject,
                "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude": [latitude1, latitude2],
                "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude": [longitude1, longitude2]
            });
        }
        
    }, [longitude1, longitude2, latitude1, latitude2, radioOptions]);
  
    const position = [0, -20];
    
    const normal = `https://api.mapbox.com/styles/v1/jcm10/cl2gmkgjt000014rstx5nmcj6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw`

    const noBorder = `https://api.mapbox.com/styles/v1/jcm10/cl2glcidk000k14nxnr44tu0o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw`

    const normal_old = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`

    const noBorder_old = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`

    const mapping_specialists = "https://api.mapbox.com/styles/v1/jcm10/cl5v6xvhf001b14o4tdjxm8vh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw"


    const SwitchBoundingBoxSelection = (event) => {
        // if(event.target.value=="embarkation"){
        //     setLabels(labels.filter((e)=>e.option!=="voyage_itinerary__imp_principal_port_slave_dis__geo_location__name"))
        // }
        // else{
        //     setLabels(labels.filter((e)=>e.option!=="voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name"))
        // }
        console.log("Event target: ", event.target.value)
        onChangeRadioOption(event.target.value)

        SetselectMode(true);
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',

        transform: 'translate(-50%, -50%)',
        width: 630,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    

    return (
        <div>
            <img src={map_icon} alt="map icon" style={{width:"100%", height:"60px"}} onClick={handleOpen}/>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Select filter by bounding box
            </Typography>
            <Button variant="contained" color="grey" startIcon={<Avatar src={emb_icon} size="20"/>} value='disembarkation' onClick={SwitchBoundingBoxSelection}> 
                Select Disembarkation
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="contained" color="grey" endIcon={<Avatar src={disemb_icon} size="20"/>} value='embarkation' onClick={SwitchBoundingBoxSelection}> 
                Select Embarkation
            </Button>
            <br/> <br/>
            <MapContainer center={position} zoom={2.5} minZoom={2.2} style={{ height: "75vh", zIndex: 0}}>
                <LayersControl position="bottomleft">
                    <BaseLayer name="modern country border (old map)">
                        <TileLayer
                            url={normal_old}
                            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                        /> 
                    </BaseLayer>
                    <BaseLayer checked name="no country border (old map)">
                        <TileLayer
                            url={noBorder_old}
                            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                        />
                    </BaseLayer>
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
                    <BaseLayer checked name="no country border">
                        <TileLayer
                            url={mapping_specialists}
                            attribution="mapping_specialists"
                        />
                    </BaseLayer>
                </LayersControl>
                <ReadFeature search_object={search_object}  radio = {radioOptions} filter={true} latlong={latlong} />

                <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2} selectMode={selectMode} SetselectMode={SetselectMode} latlong={latlong} setlatlong={setlatlong} />

            </MapContainer>
            </Box>
            </Modal>
        </div>      
    );
}