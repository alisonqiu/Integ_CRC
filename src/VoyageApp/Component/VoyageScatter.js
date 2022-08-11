// export default function VoyageScatter(props) {
//   return (
//     <div style={{height:"100%"}}>
//       Voyage scatter
//     </div>
//   )
// }
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Plot from '../../../node_modules/react-plotly.js/react-plotly';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {FormControlLabel, Grid, RadioGroup} from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import {scatter_plot_x_vars, scatter_plot_y_vars} from '../var';
import * as options_flat from "../options.json"
import {useWindowSize,} from '@react-hook/window-size'

const option_url = '/voyage/?hierarchical=false' // labels in dropdowns

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

function Scatter(props) {
  const [width, height] = useWindowSize()
  const {filter_object, dataset} = props.state;
  // const {
  //     search_object, endpoint
  // } = React.useContext(props.context)
  //console.log(search_object)
  const [plot_field, setarrx] = useState([])
  const [plot_value, setarry] = useState([])

  const [option, setOption] = useState({
    field: scatter_plot_x_vars[0],
    value: scatter_plot_y_vars[1]
  })

  const [aggregation, setAgg] = React.useState('sum');
  const [isLoading, setLoading] = useState(true);


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
    var value = option.value
    var data = new FormData();
    data.append('hierarchical', 'False');
    data.append("dataset", dataset);
    data.append("dataset", dataset);
    // //console.log("sb",search_object)
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
    data.append('cachename', 'voyage_xyscatter')

    axios.post('voyage/' + 'groupby', data = data)
      .then(function (response) {

        setarrx(Object.keys(response.data[value]))
        setarry(Object.values(response.data[value]))
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error);
        alert("undefined combination")
      });

  }, [option.field, option.value, aggregation, filter_object, dataset]);

  // useEffect(() => {
  //         axios.options(option_url)
  //             .then(function (response) {

  //                 setLabel(response.data)
  //                 setLoading(false)
  //             })
  //             .catch(function (error) {
  //                 console.log(error);
  //             })
  //     }, []
  // );

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div>
        <Box sx={{maxWidth: width > 500 ? width * 0.9 : width * 0.7}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">X Field</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option.field}
              label="X Field"
              onChange={(event) => {
                handleChange(event, "field")
              }}
              name="field"
            >
              {scatter_plot_x_vars.map((option) => {
                  return (
                    <MenuItem key={option} value={option}>
                      {options_flat[option].flatlabel}
                    </MenuItem>
                  )
                }
              )}

            </Select>
          </FormControl>
        </Box>
        <Box sx={{maxWidth: width > 500 ? width * 0.9 : width * 0.7, my: 2}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Y Field</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option.value}
              name="value"
              label="Y Field"
              onChange={(event) => {
                handleChange(event, "value")
              }}
            >
              {scatter_plot_y_vars.map((option) => (
                <MenuItem key={option} value={option}>
                  {options_flat[option].flatlabel}
                </MenuItem>
              ))}

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
                x: plot_field,
                y: plot_value,
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'red'},
                line: {shape: 'spline'},
              },
              {type: 'bar'},
            ]}

            layout={{
              width: width * 0.8,
              title: `The ${aggregation} of ${options_flat[option.field].flatlabel} vs <br> ${options_flat[option.value].flatlabel}  Scatter Graph`,
              xaxis: {
                title:
                  {text: `${options_flat[option.field].flatlabel}`},
                fixedrange: true
              },
              yaxis: {
                title:
                  {text: `${options_flat[option.value].flatlabel}`},
                fixedrange: true

              }
            }}

            config={{responsive: true}}
          />
        </Grid>
      </div>
    </div>
  )


}


export default Scatter;