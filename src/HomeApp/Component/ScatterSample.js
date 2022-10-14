import React, {useEffect, useState,useRef} from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "../../../node_modules/react-plotly.js/react-plotly";
import {Box, Button, Card, CardContent, Typography,Grid} from "@mui/material";
import {scatter_plot_x_vars, scatter_plot_y_vars,} from "../../VoyageApp/var";
import {Link, useNavigate} from 'react-router-dom';
import {
  useWindowSize,
} from '@react-hook/window-size'



const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization - Scatter",
  date: "July 8, 2022",
  description:
    "This scatter/line chart shows the number of enslaved people who we estimate died during transportation each year during the slave trade. Click through to view more scatter/line charts, which compare 2 quantitative variables, such as mortality on the Y/vertical axis, and year on the X/horizontal axis",
};

function ScatterComponent() {
  const [width, height] = useWindowSize()
  // const [height, setHeight] = useState();
  // const [width, setWidth] = useState();
  // const windowRef = useRef(null);

  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: "voyage_dates__imp_arrival_at_port_of_dis_yyyy",
    value: "voyage_slaves_numbers__imp_adult_death_middle_passage",
  });
  const [aggregation, setAgg] = React.useState("sum");

  // useEffect(()=> {
  //   setHeight((0.7 * windowRef.current.offsetHeight).toString())
  //   setWidth((0.7 * windowRef.current.offsetWidth).toString())
  //   console.log("height",height,windowRef.current.offsetHeight);
  // }, [windowRef.current.offsetHeight])

  useEffect(() => {
    var value = option.value;
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("groupby_fields", option.field);
    data.append("groupby_fields", option.value);
    data.append("agg_fn", "sum");
    data.append("cachename", "voyage_xyscatter");

    axios
      .post("/voyage/groupby", (data = data))
      .then(function (response) {
        setarrx(Object.keys(response.data[value]));
        setarry(Object.values(response.data[value]));

        // console.log(plot_value)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.field, option.value, aggregation]);

  const navigate = useNavigate();
  const GotoVoyagePage = () => {
    navigate('/voyage/Scatter');
  }

  return (
    <div>
      <Card sx={{ display: "flex" }} style={{background: 'transparent', boxShadow: 'none'}}>
        <Grid container>
        {/* <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}> */}
        <Grid item sx={{width:"60%"}}>
          {/* <CardContent sx={{ flex: "1 0 auto" }}> */}
            <Plot
              data={[
                {
                  x: plot_field,
                  y: plot_value,
                  type: "scatter",
                  mode: "lines",
                  marker: {color: "red"},
                  line: {shape: 'spline'},
                 
                },
              ]}
              layout={{width: width>800 ? width*0.55: width * 0.9, height: height*0.9, title: "The sum of Year of arrival at port of disembarkation (YEARAM) vs <br> Imputed number of adults who died on Middle Passage (ADLT2IMP) Scatter Graph",
              font: {
                size: 8
              },
              xaxis:{
                title: 
                {text:"Year of arrival at port of disembarkation (YEARAM)"},
                fixedrange: true
              },
              yaxis:{
                title: 
                {text:"Imputed number of adults who died on Middle Passage (ADLT2IMP)"},
                fixedrange: true
              }}}

              config={{responsive: true}}
            />
          {/* </CardContent> */}
        </Grid>
        {/* </Box> */}
        <Grid item sx={{maxWidth: width>800 ? "40%": "100%"}}>

        <Box sx={{height:height*0.8,
                  boxShadow: 4, 
                  margin: 2, 
                  padding:2, 
                  borderRadius: '10px',
                  overflow: "hidden",
                  overflowY: "scroll"}} 
              style={{backgroundColor: "#f1f1f1"}}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Button variant="text" style={{ fontSize: '24px' }} component={Link} to="/voyage/Scatter">Data Visualization - Scatter Charts</Button>
              <CardContent sx={{overflow: 'auto'}}> 
                <Typography variant="subtitle1" color="textSecondary">
                  {featuredPosts.date}
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  {featuredPosts.description}
                </Typography>
                {/* <Button variant="text" type="button" onClick={GotoVoyagePage}>
                  Continue reading...
                </Button> */}
              </CardContent>
          </CardContent>
        </Box>
        </Grid>
        </Grid>
      </Card>
    </div>
  );
}

export default ScatterComponent;