import React, { useState } from "react";
import { Box, Tab, Tabs, Grid, Stack, Button } from "@mui/material";
import VoyageScatter from "./Component/VoyageScatter";
import VoyageBar from "./Component/VoyageBar";
import VoyagePie from "./Component/VoyagePie";
import MapBoundingBox from "./Component/VoyageMap";
import Navbar from "../CommonComponent/NavBar";
import PivotTable from "./Component/PivotTable";
import VoyageTable from "./Component/VoyageTable";
import { useWindowSize } from "@react-hook/window-size";

import * as options_flat from "../Util/options.json";
import { columnOptions } from "../Util/tableVars";

import SankeyExample from "./Component/mapping/sankey/CircularExample"

import Filter from "../CommonComponent/Filter/Filter";
import {useParams} from "react-router-dom";

function TabPanel(props) {
  const { children, value, index } = props;
  const [width, height] = useWindowSize();


  return (
    <div
      role="tabPanel"
      hidden={value !== index}
      style={{ width: width, height: 0.885 * height, margin: 20 }}
    >
      {value === index && children}
    </div>
  );
}

export default function VoyagePage() {
  const [filter_object, set_filter_object] = useState({});
  const [dataset, setDataset] = useState("0");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [showSankey, setShowSankey] = React.useState(false);
  const { id } = useParams();
  React.useEffect(() => {
    switch (id) {
      case "Scatter":
        setValue(0);
        break;
      case "Bar":
        setValue(1);
        break;
      case "Pie":
        setValue(2);
        break;
      case "Table":
        setValue(3);
        break;
      case "Pivot":
        setValue(4);
        break;
      case "Map":
        setValue(5);
        break;
      default:
        setValue(0);
    }
  }, []);

  const state = {
    filter_object,
    set_filter_object,
    dataset,
    setDataset,
    drawerOpen,
    setDrawerOpen,
    pageType: "voyage",
  };
  const state2 = {
    filter_obj: filter_object,
    set_filter_obj: set_filter_object,
    dataset,
    setDataset,
    drawerOpen,
    setDrawerOpen,
    pageType: "voyage",
    options_flat,
    variables_tree: columnOptions,
  };

  const [value, setValue] = useState(0);

  return (
    <div>
      <Navbar state={state} />
      <Filter state={state2} />
      <Box sx={{ flexGrow: 1, display: "flex", height: "100%" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          sx={{ borderRight: 1, borderColor: "divider", minWidth: 80 }}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <Tab label="Scatter" />
          <Tab label="Bar" />
          <Tab label="Pie" />
          <Tab label="Table" />
          <Tab label="Pivot" />
          <Tab label="Map" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <VoyageScatter state={state} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VoyageBar state={state} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <VoyagePie state={state} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <VoyageTable state={state} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <PivotTable state={state} />
        </TabPanel>
        {/* <TabPanel value={value} index={5}>
          <MapBoundingBox state={state} />
        </TabPanel> */}

        <TabPanel value={value} index={5}>
          <Grid container justifyContent="flex-end">
            {/* <FormLabel id="boundingBoxFilter">Components Display</FormLabel> */}
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={() => setShowSankey(false)}>
                Map Only
              </Button>
              <Button variant="outlined" onClick={() => setShowSankey(true)}> Map + Aggregation </Button>
            </Stack>
          </Grid>


          {showSankey ? (
            <Grid
              container
              spacing={2}
              columns={16}
              alignItems="center"
              justify="center"
            >
              <Grid item xs={10}>
                <MapBoundingBox state={state} />
              </Grid>
              <Grid item xs={6}>
                <SankeyExample
                  width={960}
                  height={500}
                  state={state2}
                />
              </Grid>
            </Grid>
          ) :
            <Grid
              container
              spacing={2}
              columns={16}
              alignItems="center"
              justify="center"
            >
              <Grid item xs={16}>
                <MapBoundingBox state={state} />
              </Grid>
            </Grid>
          }

        </TabPanel>


      </Box>
    </div>
  );
}
