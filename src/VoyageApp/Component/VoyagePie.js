import React, {useEffect, useState} from 'react'
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from 'axios'
import Plot from '../../../node_modules/react-plotly.js/react-plotly';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//import { VoyageContext } from '../VoyageApp';
import {FormControlLabel, Grid, RadioGroup} from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import {donut_name_vars, donut_value_vars} from '../var';
import * as options_flat from "../options.json"
import {useWindowSize,} from '@react-hook/window-size'


//const option_url = '/voyage/' + '?hierarchical=false'

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

console.log(process.env.REACT_APP_BASEURL)


function Pie(props) {
  const [width, height] = useWindowSize()
  // const {
  //     search_object, endpoint
  // } = React.useContext(props.context)
  const {filter_object, dataset} = props.state;
  const [plot_field, setarrx] = useState([])
  const [plot_value, setarry] = useState([])

  // const [option_field, setField] = React.useState(scatter_plot_x_vars[0]);
  // const [option_value, setValue] = React.useState(scatter_plot_y_vars[1]);

  const [option, setOption] = useState({
    field: donut_name_vars[0],
    value: donut_value_vars[1]
  })

  const [aggregation, setAgg] = React.useState('sum');

  //const {sum, average} = aggregation;

  const handleChange_agg = (event) => {
    setAgg(event.target.value);
  };

  const handleChange = (event, name) => {
    setOption({
      ...option,
      [name]: event.target.value,
    })
  }
  useEffect(() => {
    //var group_by = option.field
    var value = option.value
    //var agg = aggregation


    var data = new FormData();
    data.append('hierarchical', 'False');
    data.append("dataset", dataset);
    data.append("dataset", dataset);
    for(var property in filter_object) {
        //console.log("p",property)
        //console.log('so', search_object[property])
        // eslint-disable-next-line no-loop-func
        filter_object[property].forEach((v)=>{
          if(v.length != 0){
            data.append(property, v)
          }
            //console.log("v", v)
        })
    }


    data.append('groupby_fields', option.field)
    data.append('groupby_fields', option.value)
    data.append('agg_fn', aggregation)
    data.append('cachename', 'voyage_bar_and_donut_charts')

    axios.post('voyage/' + 'groupby', data = data)
      .then(function (response) {

        setarrx(Object.keys(response.data[value]))
        setarry(Object.values(response.data[value]))

        // console.log(plot_value)

      })
      .catch(function (error) {
        console.log(error);
        alert("undefined combination")
      });

  }, [option.field, option.value, aggregation, filter_object, dataset]);


  return (
    <div>
      <div>
        <Box sx={{maxWidth: width > 500 ? width * 0.9 : width * 0.7}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sectors</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option.field}
              label="Sectors"
              onChange={(event) => {
                handleChange(event, "field")
              }}
              name="field"
            >
              {donut_name_vars.map((option) => (
                <MenuItem value={option} key={option}>
                  {options_flat[option].flatlabel}
                  {/* {option} */}
                </MenuItem>
              ))}

            </Select>
          </FormControl>
        </Box>
        <Box sx={{maxWidth: width > 500 ? width * 0.9 : width * 0.7, my: 2}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Values</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option.value}
              name="value"
              label="Values"
              onChange={(event) => {
                handleChange(event, "value")
              }}
            >
              {donut_value_vars.map((option) => (
                <MenuItem value={option} key={option}>
                  {options_flat[option].flatlabel}
                </MenuItem>
              ))}
              {/* <MenuItem value={scatter_plot_x_vars}>{scatter_plot_x_vars}</MenuItem> */}

            </Select>
          </FormControl>
        </Box>
      </div>
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Aggregation Function</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={aggregation}
            onChange={handleChange_agg}
            row
          >
            <FormControlLabel value="sum" control={<Radio/>} label="Sum"/>
            <FormControlLabel value="mean" control={<Radio/>} label="Average"/>
          </RadioGroup>
        </FormControl>
      </div>

      <div>
        <Grid>
          <Plot
            data={[
              {
                labels: plot_field,
                values: plot_value,
                type: 'pie',
                mode: 'lines+markers',
              }
            ]}
            layout={{
              width: width * 0.8,
              title: `The ${aggregation} of ${options_flat[option.field].flatlabel} vs <br> ${options_flat[option.value].flatlabel} Pie Graph`
            }}
            config={{responsive: true}}
          />
        </Grid>
      </div>
    </div>
  )


}


export default Pie;


