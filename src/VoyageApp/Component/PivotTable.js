import Pivot from "./Pivot";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormControlLabel, RadioGroup } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import { pivot_row_vars, pivot_col_vars, pivot_cell_vars } from "../var";
import * as options_flat from "../../Util/options.json";
import { useWindowSize } from "@react-hook/window-size";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const default_object = {
    groupby_fields: [pivot_row_vars[0], pivot_col_vars[1]],
    value_field_tuple: [pivot_cell_vars[0], "sum"],
    cachename: ["voyage_pivot_tables"],
};

function PivotTable(props) {

    const [width, height] = useWindowSize();
    const { filter_object, dataset } = props.state;

    const [complete_object, set_complete_object] = useState(default_object);
    const [selected_object, set_selected_object] = useState(default_object);

    // Options
    const [option, setOption] = useState({
        0: pivot_row_vars[0],
        1: pivot_col_vars[1],
    });

    const [value, setValue] = useState({
        0: pivot_cell_vars[0],
        1: "sum",
    });

    const handleCell = (event) => {
        value[0] = event.target.value;
        let tmp = selected_object["value_field_tuple"];
        tmp[0] = event.target.value;
        set_selected_object({
            ...selected_object,
            value_field_tuple: tmp,
        });
    };

    const handleGroupby = (event, idx) => {
        setOption({
            ...option,
            [idx]: event.target.value,
        });
        let tmp = selected_object["groupby_fields"];
        tmp[idx] = event.target.value;
        set_selected_object({
            ...selected_object,
            groupby_fields: tmp,
        });
    };

    const handleValueFunction = (event, valueSelected) => {
        value[1] = valueSelected;
        let tmp = selected_object["value_field_tuple"];
        tmp[1] = valueSelected;
        if (event.target.value === "mean" || event.target.value === "sum") {
            delete selected_object["normalize"];
        } else {
            selected_object["normalize"] = [event.target.value];
        }
        set_selected_object({
            ...selected_object,
            value_field_tuple: tmp,
        });
    };

    // Combine the filter and the default
    useEffect(() => {
        set_complete_object(Object.assign({}, filter_object, selected_object));
    }, [filter_object, selected_object]);

    return (
        <div>
            <div>
                <Box sx={{ maxWidth: width > 500 ? width * 0.9 : width * 0.7 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Rows</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selected_object.groupby_fields[0]}
                            label="Rows"
                            name="Rows"
                            onChange={(event) => {
                                handleGroupby(event, 0);
                            }}
                        >
                            {pivot_row_vars.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {options_flat[option]["flatlabel"]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ maxWidth: width > 500 ? width * 0.9 : width * 0.7, my: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Columns</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selected_object.groupby_fields[1]}
                            name="Columns"
                            label="Columns"
                            onChange={(event) => {
                                handleGroupby(event, 1);
                            }}
                        >
                            {pivot_col_vars.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {options_flat[option]["flatlabel"]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ maxWidth: width > 500 ? width * 0.9 : width * 0.7, my: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Cells</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selected_object.value_field_tuple[0]}
                            name="Cells"
                            label="Cells"
                            onChange={(event) => {
                                handleCell(event);
                            }}
                        >
                            {pivot_cell_vars.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {options_flat[option]["flatlabel"]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                        Value Function
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={
                            "normalize" in selected_object
                                ? selected_object.normalize
                                : selected_object.value_field_tuple[1]
                        }
                        row
                    >
                        <FormControlLabel
                            value="sum"
                            onChange={(event) => {
                                handleValueFunction(event, "sum");
                            }}
                            control={<Radio />}
                            label="Sum"
                        />
                        <FormControlLabel
                            value="mean"
                            onChange={(event) => {
                                handleValueFunction(event, "mean");
                            }}
                            control={<Radio />}
                            label="Mean"
                        />
                        <FormControlLabel
                            value="columns"
                            onChange={(event) => {
                                handleValueFunction(event, "sum");
                            }}
                            control={<Radio />}
                            label="Normalized Rows"
                        />
                        <FormControlLabel
                            value="index"
                            onChange={(event) => {
                                handleValueFunction(event, "sum");
                            }}
                            control={<Radio />}
                            label="Normalized Columns"
                        />
                    </RadioGroup>
                </FormControl>
            </div>
                <Pivot state={{ complete_object, set_complete_object, dataset, width: width > 500 ? width * 0.9 : width * 0.7, height }} />
        </div>
    );
}
export default PivotTable;