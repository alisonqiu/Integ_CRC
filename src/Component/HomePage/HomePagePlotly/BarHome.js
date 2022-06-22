import React, {useEffect, useState} from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "react-plotly.js";
import {Box, Button, Card, CardContent, Typography} from "@mui/material";
import {bar_x_vars, bar_y_vars} from "../../VoyagePage/Result/vars";
import {Link, useNavigate} from "react-router-dom";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization - Bar",
  date: "June 14, Tue",
  description:
    "The sobriquet was first applied around 1879. While it was not intended as flattering, it washardly inappropriate. The Academicians at whom it was aimed had worked and socialized in NewYork, the Hudson's port city, and had painted the river and its shores with varying frequency.Most important, perhaps, was that they had all maintained with a certain fidelity a manner oftechnique and composition consistent with those of America's first popular landscape artist,Thomas Cole, who built a career painting the Catskill Mountain scenery bordering the HudsonRiver. A possible implication in the term applied to the group of landscapists was that many ofthem had, like Cole, lived on or near the banks of the Hudson. Further, the river had long servedas the principal route to other sketching grounds favored by the",
};

function BarComponent() {
  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: bar_x_vars[0],
    value: bar_y_vars[1],
  });
  const [aggregation, setAgg] = React.useState("sum");
  useEffect(() => {
    var value = option.value;
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("groupby_fields", option.field);
    data.append("groupby_fields", option.value);
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
        <Box sx={{boxShadow: 4, margin: 2, padding: 2, borderRadius: '10px'}} style={{backgroundColor: "#f1f1f1"}}>
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
                <Button variant="text" type="button" onClick={GotoVoyagePage}>
                  Continue reading...
                </Button>
              </CardContent>
            </div>
          </CardContent>
        </Box>

        <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
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
              layout={{width: 800, height: 600, title: "Bar Plot"}}
              config={{responsive: true}}
            />
          </CardContent>
        </Box>
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