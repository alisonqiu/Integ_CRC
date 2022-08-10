import React from 'react'
import { Button,Typography, Card, CardContent, Box,Grid } from "@mui/material";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import VoyageTable from '../../VoyageApp/Component/VoyageTable'
import {
  useWindowSize,
} from '@react-hook/window-size'



const featuredPosts = {
    title: "Data Table",
    date: "July 8, 2022",
    description:
      "This table shows some data on several voyages: the place and year where enslaved people were forced aboard and the name of the ship. Click through to read through many more of our linked records of the history of the slave trade in the Atlantic and American Oceanic worlds.",
  };


  
function TableComponent() {
    const [width, height] = useWindowSize()

    const navigate = useNavigate();
    const GotoVoyagePage = () => {
      navigate('voyage/Table');
    }

    let filter_object = {}
    let dataset = 0
    let pageType = "voyage"
    let state = {
        filter_object,
        dataset,
        pageType,
    }
  return (
    <div>
         <Card sx={{ display: "flex" }} style={{ background: 'transparent', boxShadow: 'none'}}>
         <Grid container>
        {/* <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}> */}
        <Grid item sx={{maxWidth: width>800 ? "40%": width}}>
        <Box sx={{height:height*0.9,
                  boxShadow: 4, 
                  margin: 2, 
                  padding:2, 
                  borderRadius: '10px',
                  overflow: "hidden",
                  overflowY: "scroll"}} style={{backgroundColor: "#f1f1f1"}}>
          <CardContent sx={{ flex: "1 0 auto" }} >
            <Button
              variant="text"
              style={{ fontSize: "24px" }}
              component={Link}
              to="voyage/Table"
            >
              Data Table
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
        <Grid item sx={{width:width>800 ? "60%": width*0.9}}>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
           <VoyageTable state = {state}/>
          </CardContent>
        </Box>
        </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default TableComponent