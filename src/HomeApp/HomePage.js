import * as React from "react";
import { Box, Button, Divider, List} from "@mui/material";
import Navbar from "../CommonComponent/NavBar";
import Container from "@mui/material/Container";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import BarComponent from "./Component/BarSample";
import PieComponent from "./Component/PieSample";
import ScatterComponent from "./Component/ScatterSample";

// import TableHome from "./HomePagePlotly/TableHome/TableHome";
// import SankeyHome from "./HomePagePlotly/SankeyHome";
// import StoryHome from "./HomePagePlotly/StoryHome";
// import NetworkHome from "./HomePagePlotly/NetworkHome";
//import PAST from "../PAST/PAST";
//import {PASTContext} from "../PAST/PASTApp";
// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });
import {
  useWindowSize,
} from '@react-hook/window-size'
import ArchiveHome from "./ArchiveHome";
import SankeyComponent from "./Component/SankeySample";
import NetworkComponent from "./Component/NetworkSample";
import TableComponent from "./Component/TableSample";

export default function Home() {
  const [width, height] = useWindowSize()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    });
  };

  const dataset = "0";
  const state = { dataset, pageType: "home" };
  const sample = [<SankeyComponent/>, <BarComponent />, <PieComponent />, <ScatterComponent/>, <TableComponent/>];
  return (
    <div>
      <Navbar state={state} />
      <Container maxWidth={false} >
        <List>
              <NetworkComponent/>
              <Divider/>
              <ArchiveHome components={sample} scrollPosition={window.scrollY}/>
        </List>
        <Box display="flex"
          justifyContent="flex-end"
          alignItems="flex-end" padding={4}>
            <Button variant="outlined" onClick={scrollToTop} startIcon={<ArrowDropUpIcon />}>
              Up
            </Button>
        </Box>
      </Container>
    </div>
  );
}
