import Auto from './Autocomplete';
import Slider from "./Slider"
// import BoundingBoxFilter from "../mapping/BoundingBoxFilter";

import * as React from 'react';
import { Chip } from '@mui/material';

function ComponentFac(props) {

    const {filter_obj, set_filter_obj, options_flat, pageType, key, dataset} = props.state

    switch (options_flat[key].type) {
        case "<class 'rest_framework.fields.IntegerField'>":
            return (
                <Slider state={{key, filter_obj, set_filter_obj, options_flat, pageType}} />
            );
        case "<class 'rest_framework.fields.DecimalField'>":
            return (
                <Slider state={{key, filter_obj, set_filter_obj, options_flat, pageType}} />
            );
        case "<class 'rest_framework.fields.BooleanField'>":
            return <Chip label={
                options_flat[key].flatlabel
            } color="primary" />;
        case "<class 'rest_framework.fields.CharField'>":
            return (
                    <Auto state={{key, filter_obj, set_filter_obj, options_flat, pageType}} />
            )
        // case "Map":
        //     return (
        //         <BoundingBoxFilter  state={{key, filter_obj, set_filter_obj, options_flat, pageType, dataset}}/>
        //     )
        default:
            return <Chip label="NA" color="primary" />;
    }

}

// function modifyName(rawName) {
//     const raw2 = rawName.replace(/ *\([^)]*\) */g, "")
//     const res = raw2.split(":").length > 2 ? raw2.split(':').slice(1).join(':') : raw2;
//     return res
// }

export default ComponentFac;