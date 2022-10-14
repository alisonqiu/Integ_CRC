import * as React from 'react';
import { Grid, Button, IconButton, AppBar, Toolbar, Drawer, Divider, Menu } from "@mui/material";
import { useMemo } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FilterAlt from "@mui/icons-material/FilterAlt";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import ComponentFac from './ComponentFac';
import FilterSelector from './FilterSelector'
import BoundingBoxFilter from "../../VoyageApp/Component/BoundingBoxFilter";

export default function Filter(props) {

    const { filter_obj, set_filter_obj, variables_tree, options_flat, drawerOpen, setDrawerOpen, pageType, dataset } = props.state;

    const color = useMemo(() =>{
        if(pageType === "enslaver") {
          return "success"
        }
        if(dataset==="0") {
          return "primary"
        }else{
          return "secondary"
        }
      }, [pageType, dataset])

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const [fullScreen, setFullScreen] = React.useState(false);
    const [rightScreen, setRightScreen] = React.useState(false);

    const [openBoundingBox, setOpenBoundingBox] = React.useState(false);

    const variables_for_map = ["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name", 
    "voyage_itinerary__imp_principal_port_slave_dis__geo_location__name"];

    // Handle Menu Open and Close
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
      };
    const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    };

    // Handle Full Screen and Exit
    const handleFullScreen = () => {
        setFullScreen(!fullScreen);
    };

    // Handle Screen LR switch
    const handleSwitchScreen = () => {
        setRightScreen(!rightScreen);
    };

    // Handle Filter Reset Action
    const handleFilterReset = () => {
        set_filter_obj({});
        setOpenBoundingBox(false);
    };


    const handleDelete = (key, boundingBox) => {
        let temp = { ...filter_obj };
        if (boundingBox & (key === "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name" 
            || key === "voyage_itinerary__imp_principal_port_slave_dis__geo_location__name")) {
            delete temp["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude"];
            delete temp["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude"];
            delete temp["voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude"];
            delete temp["voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude"];
        }
        else {
            delete temp[key];
        }
        set_filter_obj(temp)
    };

    // console.log("Filter Obj: ", filter_obj)

    return (
        <div>
            {drawerOpen ?
                <AppBar key="menu_appbar_1"
                    position="fixed" 
                    color={color} 
                    elevation={0} 
                    style={{ zIndex: 3, paddingTop: "64px" }}
                >
                    <Toolbar key="menu_toolbar" 
                        sx={{ display: { xs: "none", sm: "flex", md: "flex" } }}
                    >
                        <Grid container key="menu_items" direction="row" spacing={1}>
                            {
                                Object.keys(variables_tree).map((key) => {
                                    return (
                                        <FilterSelector key={"menu_items_" + key} state={{ key, filter_obj, set_filter_obj, variables_tree, options_flat, fontcolor:"#fff" }} />
                                    )
                                })
                            }
                        </Grid>
                    </Toolbar>
                    <Toolbar key="menu_toolbar_2" 
                        sx={{ display: { xs: "flex", sm: "none", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="whiteIcon"
                            >
                            <FilterAlt />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            >
                                <Grid container key="menu_items" direction="column" spacing={1} onClick={handleCloseNavMenu}>
                                    {Object.keys(variables_tree).map((key) => {
                                        return (
                                            <FilterSelector key={"menu_items_" + key} state={{ key, filter_obj, set_filter_obj, variables_tree, options_flat, fontcolor:"#000" }} />
                                        )
                                    })}
                                </Grid>
                        </Menu>
                    </Toolbar>
                </AppBar>
                : null}
            <Drawer
                key="filter_drawer"
                className={"Selected Fields Drawer"}
                variant="persistent"
                anchor={rightScreen ? "right" : "left"}
                open={drawerOpen}
                PaperProps={{ sx: { width: fullScreen ? "100%" : "25%", background: "#EAECEE" } }}
                style={{ position: 'relative', zIndex: 2 }}
            >
                <Toolbar />
                <Toolbar />
                <Divider />
                <Grid container key="top_grid" direction="row" justifyContent="center" sx={{ mb: "10px" }}>
                    <Grid container item justifyContent={rightScreen ? "flex-start" : "flex-end"}>
                        <IconButton onClick={handleFilterReset}>
                            <RestartAltIcon />
                        </IconButton>
                        <IconButton onClick={handleSwitchScreen}>
                            {rightScreen ? <SwitchLeftIcon /> : <SwitchRightIcon />}
                        </IconButton>
                        <IconButton onClick={handleFullScreen}>
                            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </Grid>
                    {
                        pageType == 'voyage' ?
                            <Grid item sx={{mb:openBoundingBox?"10px":"0px"}}>
                                {
                                !openBoundingBox?
                                <Button variant="contained"
                                    color={color}
                                    onClick={()=>{setOpenBoundingBox(true)}}
                                >
                                    <Typography color="white">Add Visual Filter</Typography>
                                </Button>
                                :
                                <Button variant="contained"
                                    color={color}
                                    onClick={()=>{
                                                    setOpenBoundingBox(false);
                                                    handleDelete("voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name", true);
                                                    handleDelete("voyage_itinerary__imp_principal_port_slave_dis__geo_location__name", true);
                                                }}
                                >
                                    <Typography color="white">Remove Visual Filter</Typography>
                                </Button>
                                }
                            </Grid>
                            : null
                    }
                    {
                        openBoundingBox ?
                            <Grid container item key={'visual_filter_container'} justifyContent="center" spacing={1}>
                                {variables_for_map.map(key => {
                                    return (
                                            <Grid item key={'item' + key} xs={fullScreen ? 5 : 10}>
                                                <Accordion key={'accord'+key}>
                                                    <AccordionSummary key={'accordSum'+key}>
                                                        <Typography key={'typo'+key}>
                                                            {options_flat[key].flatlabel}
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails key={'accordDet'+key}>
                                                        <BoundingBoxFilter state={{ key, filter_obj, set_filter_obj, options_flat, pageType, dataset }} />
                                                    </AccordionDetails>
                                                </Accordion>
                                            
                                            </Grid>
                                    )
                                })}
                            </Grid>
                            : null
                    }
                </Grid>
                <Divider />
                <Grid
                    container
                    item
                    key="main_grid"
                    direction="row"
                    rowSpacing={1} columnSpacing={0.5}
                    justifyContent="center"
                    sx={{ mt: "5px", mb: "15px" }}
                >
                    {Object.keys(filter_obj).length === 0 ?
                        <Grid container item key="empty_filter" justifyContent="center">
                            <Typography color="#808B96">No Filter</Typography>
                        </Grid>
                        :
                        Object.keys(filter_obj).map((key) => {

                            if (key === "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude"
                                || key === "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude"
                                || key === "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude"
                                || key === "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude") {
                                return null;
                            }

                            return (
                                <Grid container item key={'container' + key} xs={fullScreen ? 5 : 10}>
                                    <Grid item key={'item1' + key} xs={10}>
                                        <Accordion key={'accord' + key}>
                                            <AccordionSummary key={'accordSum' + key}>
                                                <Typography key={'typo' + key}>{options_flat[key].flatlabel}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails key={'accordDet' + key}>
                                                <ComponentFac key={'compFac' + key} state={{ filter_obj, set_filter_obj, options_flat, pageType, key }} />
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                    <Grid item key={'item2' + key} align="center" xs={2}>
                                        <IconButton key={'iconB' + key} onClick={() => { handleDelete(key, false) }}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                </Grid>
                <Divider />
                <Grid container item justifyContent={rightScreen ? "flex-start" : "flex-end"}>
                    <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                        {rightScreen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </Grid>
            </Drawer>
            {drawerOpen ?
                <Toolbar />
                : null}
        </div>

    )
}
