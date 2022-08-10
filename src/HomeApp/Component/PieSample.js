import React, {useEffect, useState} from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "../../../node_modules/react-plotly.js/react-plotly";
import {Box, Button, Card, CardContent, Typography,Grid} from "@mui/material";
import {donut_name_vars, donut_value_vars,} from "../../VoyageApp/var";
import {Link, useNavigate} from "react-router-dom";
import {
  useWindowSize,
} from '@react-hook/window-size'


const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization - Pie",
  date: "June 14, Tue",
  description:
    "This pie chart shows the aggregated numbers of people who we know were enslaved and embarked on voyages, grouped by the relative numbers / precentages of their outcome on those voyages. Most voyages completed with the transportation of most of the enslaved people on board, but some vessels were lost at sea, some were captured or attacked, and in some cases the enslaved people aboard successfully rebelled. Click to view more pie charts, which (like bar charts) show qualitative variables (like voyage outcomes) alongside quantitative variables (like numbers of people).",
};

function PieComponent() {
  const [width, height] = useWindowSize()
  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: "voyage_outcome__outcome_slaves__name",
    value: "voyage_slaves_numbers__imp_total_num_slaves_embarked",
  });
  const [aggregation, setAgg] = React.useState("sum");
  useEffect(() => {
    var value = option.value;
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("groupby_fields", option.field);
    data.append("groupby_fields", option.value);
    data.append("agg_fn", "sum");
    data.append("cachename", "voyage_bar_and_donut_charts");

    axios
      .post("/voyage/groupby", (data = data))
      .then(function (response) {
        setarrx(Object.keys(response.data[value]));
        setarry(Object.values(response.data[value]));
        //console.log(plot_value);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.field, option.value, aggregation]);

  const navigate = useNavigate();
  const GotoVoyagePage = () => {
    navigate("/voyage/Pie");
  };

  return (
    <Card sx={{display: "flex"}} style={{background: 'transparent', boxShadow: 'none'}}>
       <Grid container>
        {/* <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}> */}
        <Grid item sx={{width:"60%"}}>
          <Plot
            data={[
              {
                labels: plot_field,
                values: plot_value,
                type: "pie",
                mode: "lines+markers",
              },
            ]}
            layout={{width: width>800 ? width*0.55: width * 1, height: width>800 ? height*0.9: height * 0.8, title: "Total enslaved people embarked (imputed) <br> by Voyage outcome for captives aboard"}}
            config={{responsive: true}}
          />
         </Grid>

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
            {/* <CardContent> */}
              <Button
                variant="text"
                style={{fontSize: "24px"}}
                component={Link}
                to="voyage/Pie"
              >
                Data Visualization - Pie Charts
              </Button>
              <Typography variant="subtitle1" color="textSecondary">
                {featuredPosts.date}
              </Typography>
              <Typography variant="subtitle1" paragraph>
                {featuredPosts.description}
              </Typography>
              {/* <Button variant="text" type="button" onClick={GotoVoyagePage}>
                Continue reading...
              </Button> */}
            {/* </CardContent> */}
        </CardContent>
      </Box>
      </Grid>
      </Grid>
    </Card>
  );
}

export default PieComponent;