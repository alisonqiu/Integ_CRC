import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography,Grid, Popover, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useWindowSize } from '@react-hook/window-size';
import _ from 'lodash';
import EastIcon from '@mui/icons-material/East';
import {sankey, sankeyLeft, sankeyLinkHorizontal} from "d3-sankey";
import Sankey from "../../PASTApp/Component/Sankey";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
const baseURL = process.env.REACT_APP_BASEURL;

const featuredPosts = {
  title: "Data Visualization: Sankey Diagrams",
  date: "July 7, 2022",
  description:
    "The Sankey Diagrams shows relationships between several enslaved people. For example, this sankey shows connections between Henry, Patrick and Brown, Cesar, who are on the same voyage from Alexandria to New Orleans. Click through to study more relationships among enslavers (shipper, consigner), enslaved people, and information about their voyages.",
};

function SankeyComponent() {
  const [winwidth, winheight] = useWindowSize()
  const [selectedData, setSelectedData] = useState({
    enslaved: [500002, 500004],
    type: "enslaved",
    enslaver: [],
  });
  let width = winwidth > 800 ? winwidth*0.6 : winwidth * 0.8
  let height = winheight
  const state = {selectedData,width,height};
  return (
    <div>
      <Card sx={{display: "flex"}} style={{background: 'transparent', boxShadow: 'none'}}>
        <Grid container>
          <Grid item sx={{width:"60%"}}>
            <CardContent sx={{flex: "1 0 auto"}}>
              <Sankey state={state}/>
            </CardContent>
          </Grid>
          <Grid item sx={{maxWidth: winwidth>800 ? "40%": "100%"}}>
            <Box sx={{height:height*0.9,boxShadow: 4, margin: 2, padding:2, borderRadius: '10px', overflow: "hidden", overflowY: "scroll"}} style={{backgroundColor: "#f1f1f1"}}>
              <CardContent sx={{flex: "1 0 auto"}}>
                <Button
                  variant="text"
                  style={{fontSize: "24px"}}
                  component={Link}
                  to="past/enslaved"
                >
                Data Visualization - Sankey Diagrams
                </Button>
                <div>
                  <CardContent>
                    <Typography variant="subtitle1" color="textSecondary">
                      {featuredPosts.date}
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                      {featuredPosts.description}
                    </Typography>
                  </CardContent>
                </div>
              </CardContent>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}

export default SankeyComponent;