import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import { Button } from '@mui/material';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Avatar from 'react-avatar';

import 'leaflet-area-select';
import AreaSelect from "./AreaSelect";
import axios from 'axios';
import { ReadFeature } from "./mapping/Spatial"
import map_icon from "./mapping/map_icon.png";
import emb_icon from "./mapping/emb_icon.png"
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Typography, Box, Modal } from '@mui/material';

const { BaseLayer } = LayersControl;

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export default function BoundingBoxFilter(props) {

    const [longitude1, onChangelongitude1] = React.useState(-180);
    const [longitude2, onChangelongitude2] = React.useState(180);
    const [latitude1, onChangelatitude1] = React.useState(-180);
    const [latitude2, onChangelatitude2] = React.useState(180);

    const [selectMode, setSelectMode] = useState(false);

    const { filter_obj, set_filter_obj, key, dataset } = props.state;
    const [latlong, setlatlong] = useState([[0, 0], [0, 0]]);

    console.log("Key: ", key)

    useEffect(() => {
        var out;

        if (key === "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name") {
            set_filter_obj({...filter_obj, 
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude": [latitude1, latitude2],
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude": [longitude1, longitude2]
            });
        }
        else {
            set_filter_obj({...filter_obj, 
                "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude": [latitude1, latitude2],
                "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude": [longitude1, longitude2]
            });
        }


    }, [longitude1, longitude2, latitude1, latitude2, key])


    const normal = `https://api.mapbox.com/styles/v1/jcm10/cl2gmkgjt000014rstx5nmcj6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw`
    const noBorder = `https://api.mapbox.com/styles/v1/jcm10/cl2glcidk000k14nxnr44tu0o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw`
    const normal_old = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
    const noBorder_old = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
    const mapping_specialists = "https://api.mapbox.com/styles/v1/jcm10/cl5v6xvhf001b14o4tdjxm8vh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw"


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const resetBox = () => {
        if (key === "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name") {
            set_filter_obj({...filter_obj, 
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude": [-180, 180],
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude": [-180, 180]
            });
        }
        else {
            set_filter_obj({...filter_obj, 
                "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude": [-180, 180],
                "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude": [-180, 180]
            });
        }
        setlatlong([[0, 0], [0, 0]])
    }

    

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
            <img src={map_icon} alt="map icon" style={{ width: "100%", height: "60px" }} onClick={handleOpen} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {key==="voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name" ? "Select Embarkation Location" : "Select Disembarkation Location"}
                    </Typography>
                    <Button variant="contained" color="grey" startIcon={<Avatar src={emb_icon} size="20" />} value='embarkation' onClick={() => { setSelectMode(true) }}>
                        {key==="voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name" ? "Select Embarkation Area" : "Select Disembarkation Area"}
                    </Button>
                    <Button variant="contained" color="grey" startIcon={<RestartAltIcon />} value='reset' onClick={ resetBox }>
                    {key==="voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name" ? "Remove Embarkation Filter" : "Remove Disembarkation Filter"}
                    </Button>

                    <br /> <br />
                    <MapContainer center={[0, -20]} zoom={2.5} minZoom={2.2} style={{ height: "75vh", zIndex: 0 }}>
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
                        
                        <ReadFeature 
                            search_object={filter_obj} key={key} filter={false} latlong={latlong} dataset={dataset}
                            // radio={radioOptions}
                        />

                        <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                            onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2} selectMode={selectMode} SetselectMode={setSelectMode} latlong={latlong} setlatlong={setlatlong} />

                    </MapContainer>
                </Box>
            </Modal>
        </div>
    );
}