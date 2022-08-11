import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {Box, Button, Card, CardContent, Typography,Grid, Popover, CircularProgress} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import { useWindowSize } from '@react-hook/window-size';
import Graph from "react-graph-vis";
import _ from 'lodash';
import Network from "../../PASTApp/Component/Network";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization: Network Diagram",
  date: "July 7, 2022",
  description:
    "The Network Diagrams shows relationships between selected enslaved people, enslavers (shippers, owners) and their corresponding voyages. For example, this Network shows connections between Henry Patrick and Hanson John who are on the same voyage from Alexandria to New Orleans. Click through to study more relationships among enslavers (shipper, consigner), enslaved people, and information about their relationships.",
};

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export default function NetworkComponent() {
  const [winwidth, winheight] = useWindowSize();
  const [selectedData, setSelectedData] = useState({
    enslaved: [500002, 500004],
    type: "enslaved",
    enslaver: [],
  });

  const state = {selectedData, width: winwidth>800 ?0.6*winwidth:0.91*winwidth, height: winheight};

  return (
    <div>
      <Card sx={{display: "flex"}} style={{background: 'transparent', boxShadow: 'none'}}>
        <Grid container>
          {/* <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}> */}
          <Grid item sx={{maxWidth: winwidth>800 ? "40%": winwidth*0.9}}>
            <Box sx={{height:winheight*0.9,boxShadow: 4, margin: 2, padding:2, borderRadius: '10px', overflow: "hidden",
                  overflowY: "scroll"}} style={{backgroundColor: "#f1f1f1"}}>
              <CardContent sx={{flex: "1 0 auto"}}>
                <Button
                  variant="text"
                  style={{fontSize: "24px"}}
                  component={Link}
                  to="past/enslaved"
                >
                Data Visualization - Network Diagrams
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
          <Grid item sx={{width:winwidth>800 ?"60%":"91%"}}>
          {/* <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}> */}
            <CardContent sx={{flex: "1 0 auto"}}>
              <Network state={state}/>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
