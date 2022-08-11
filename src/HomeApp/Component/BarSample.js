import React, {useEffect, useState} from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "../../../node_modules/react-plotly.js/react-plotly";
import {Box, Button, Card, CardContent, Typography,Grid} from "@mui/material";
import {bar_x_vars, bar_y_vars} from "../../VoyageApp/var";
import {Link, useNavigate} from "react-router-dom";
import {
  useWindowSize,
} from '@react-hook/window-size'

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization: Bar Charts",
  date: "July 7, 2022",
  description:
    "This bar chart shows how many enslaved people were embarked on voyages between 1800-1830 by the different (mostly European) colonial powers that enslaved them. Click through to study more bar charts, which show qualitative variables (like colonizing nation) alongside quantitative variables (like numbers of people).",
};

function BarComponent() {
  const [width, height] = useWindowSize()
  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: "voyage_ship__imputed_nationality__name",
    value: "voyage_slaves_numbers__imp_total_num_slaves_embarked",
  });
  const [aggregation, setAgg] = React.useState("sum");
  useEffect(() => {
    var value = option.value;
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("groupby_fields", option.field);
    data.append("groupby_fields", option.value);
    data.append("voyage_dates__imp_arrival_at_port_of_dis_yyyy", 1830);
    data.append("voyage_dates__imp_arrival_at_port_of_dis_yyyy", 1850);
    data.append("agg_fn", "sum");
    data.append("cachename", "voyage_export");

    axios
      .post("/voyage/groupby", (data = data))
      .then(function (response) {
        setarrx(Object.keys(response.data[value]));
        setarry(Object.values(response.data[value]));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.field, option.value, aggregation]);

  const navigate = useNavigate();
  const GotoVoyagePage = () => {
    navigate("/voyage/Bar");
  };

  return (
    <div>
      <Card sx={{display: "flex"}} style={{background: 'transparent', boxShadow: 'none'}}>
      <Grid container>
        {/* <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}> */}
        <Grid item sx={{maxWidth: width>800 ? "40%": width*0.9}}>
        <Box sx={{height:height*0.8,
                  boxShadow: 4, 
                  margin: 2, 
                  padding:2, 
                  borderRadius: '10px',
                  overflow: "hidden",
                  overflowY: "scroll"}} 
              style={{backgroundColor: "#f1f1f1"}}>
          <CardContent sx={{flex: "1 0 auto"}}>
            <Button
              variant="text"
              style={{fontSize: "24px"}}
              component={Link}
              to="voyage/Bar"
            >
              Data Visualization - Bar Charts
            </Button>
            <div>
              <CardContent>
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
            </div>
          </CardContent>
        </Box>
        </Grid>
        <Grid item sx={{width:"60%"}}>
        {/* <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}> */}
          <CardContent sx={{flex: "1 0 auto"}}>
            <Plot
              data={[
                {
                  x: plot_field,
                  y: plot_value,
                  type: "bar",
                  mode: "lines+markers",
                },
                {type: "bar"},
              ]}
              layout={{width: width>800 ? width*0.55: width * 0.9, height: height*0.9, title: "The sum of the total number (imputed) of enslaved people who were embarked on voyages <br> by The nationality of the ship",
              font: {
                size: 8
              },
              xaxis:{
                title: 
                {text:"Name "},
                fixedrange: true
              },
              yaxis:{
                title: 
                {text:"Total slaves embarked imputed * (slaximp)"},
                fixedrange: true
              }
            }}
              config={{responsive: true}}
            />
          </CardContent>
        {/* </Box>
         */}
         </Grid>
         </Grid>
      </Card>
      {/* <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
      </Backdrop> */}
    </div>
  );
}

export default BarComponent;