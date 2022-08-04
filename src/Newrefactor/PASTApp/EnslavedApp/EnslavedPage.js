import NavBar from "../../CommonComponent/NavBar";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Table from "../../CommonComponent/Table/Table";
import * as options_flat from "./options.json";
import {
  enslaved_var_list as variables_tree,
  enslaved_default_list,
} from "./var";
import Filter from "../../CommonComponent/Filter/Filter";

import {Box, Button, Card, Tab, Tabs, Typography,Dialog,AppBar,Toolbar,IconButton,Slide, Grid} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Sankey from "../Component/Sankey"
import Network from '../Component/Network'
// import Story from './RelationGraph/Story'
import Grow from '@mui/material/Grow';
// import Gallery from "./Gallery.js"
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import TocIcon from '@mui/icons-material/Toc';
import { useWindowSize } from "@react-hook/window-size";



const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
const endpoint = "past/enslaved/";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function TabPanel(props) {
  const {children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{width: '100%'}}
    >{value === index && (
      <Box sx={{p: 3}}>
        {children}
      </Box>
    )}
    </div>
  );
}

export default function EnslavedPage(props) {
  const [width, height] = useWindowSize();
  const [dataset, setDataset] = useState(1);
  const [filter_object, set_filter_object] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cols, setCols] = useState(enslaved_default_list);
  // data response
  const [dataList, setDataList] = useState([]);
  // pagination
  const [pagination, setPagination] = useState({
    currPage: 0,
    rowsPerPage: 10,
    totalRows: 0,
  });
  // sorting
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
  // sankey modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [selectedData, setSelectedData] = useState({
    enslaved: [],
    type: "enslaved",
    enslaver: [],
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const state = {
    dataset,
    setDataset,
    drawerOpen,
    setDrawerOpen,
    pageType: "enslaved",
  };
  const state2 = {
    filter_obj: filter_object,
    set_filter_obj: set_filter_object,
    dataset,
    setDataset,
    drawerOpen,
    setDrawerOpen,
    pageType: "enslaved",
    options_flat,
    variables_tree,
  };
  const state_graph = {selectedData,endpoint}
  // view connections & click popover & click number_slaved
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    //console.log("fetching...", pagination);
    setIsLoading(true);
    setDataList([]);
    let queryData = new FormData();
    queryData.append("hierarchical", "False");
    queryData.append("results_page", pagination.currPage + 1);
    queryData.append("results_per_page", pagination.rowsPerPage);
    queryData.append("dataset", dataset);
    queryData.append("dataset", dataset);
    if (sortModel.length !== 0) {
      sortModel.map((field) =>
        field.sort === "asc"
          ? queryData.append("order_by", field.field)
          : queryData.append("order_by", "-" + field.field)
      );
    }
    for (const property in filter_object) {
      filter_object[property].forEach((v) => {
        queryData.append(property, v);
      });
    }
    axios.post("/" + endpoint, queryData).then((res) => {
      setPagination({
        ...pagination,
        totalRows: Number(res.headers.total_results_count),
      });
      setDataList(res.data);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.currPage,
    pagination.rowsPerPage,
    filter_object,
    sortModel,
    dataset,
  ]);

  return (
    <div style={{ height: "100%" }}>
      <NavBar state={state} />
      <Filter state={state2} />
      <Button onClick={() => console.log(selectedData)}>
        {" "}
        Show Selected People
      </Button>
      <Button onClick={handleDialogOpen}>
        View Connections
      </Button>
      <Table
        state={{
          pageType: "enslaved",
          dataList,
          isLoading,
          checkbox: true,
          default_list: enslaved_default_list,
          variables_tree,
          options_flat,
          // pagination
          pagination,
          setPagination,
          // sorting
          sortModel,
          setSortModel,
          // filter object
          filter_object,
          set_filter_object,
          // selected ids
          selectedData,
          setSelectedData,
          setDialogOpen,
          handleDialogOpen,
        }}
      />
       <Dialog
        fullScreen
        open={dialogOpen}
        onClose={handleDialogClose}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        TransitionComponent={Transition}
        sx={{width: "100%", height: "100%"}}
        // ref={windowRef}
      >
        <AppBar sx={{ position: 'relative', background: 'white'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <CloseIcon color="action"/>
            </IconButton>
            <Tabs
              variant="scrollable"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue)
              }}
              sx={{borderRight: 1, borderColor: 'divider'}}
            >
              <Tab label="Sankey"/>
              <Tab label="Network"/>
              <Tab label="Story"/>
            </Tabs>
          </Toolbar>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Sankey state={state_graph}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Network state={state_graph}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* <Grid  container spacing={{ xs: 6, md: 4, lg:5}} padding={{ xs: 4, md: 3, lg:4 }} paddingTop={{ xs: 0, md: 0, lg:0 }}  >
          {queryData["type"] == "slaves" && data.map((item, key) => {
              return <Grid key={'grid-' + key}item xs={12} sm={6} md={4} lg={3}><Story target={item} dynamic={true}/></Grid>
            })}
          {queryData["type"] != "slaves" && data.map((item, key) => {
            return <Grid key={'grid-' + key}item xs={12} sm={6} md={4} lg={3}><Story target={item} dynamic={true} slavery="slaver"/></Grid>
          })}
          </Grid> */}
          Story
        </TabPanel>
      </Dialog>
    </div>
  );
}
