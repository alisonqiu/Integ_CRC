import * as React from "react";
import {useEffect, useState} from "react";
import Story from "./Story.js";
import Grid from '@mui/material/Grid';
import TablePagination from '@mui/material/TablePagination';
import './styles.css'



const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export default function StoryInPAST (props) {
    const {selectedData} = props
    const [src, setSrc] = React.useState([]);
    // console.log("selectedData: ",selectedData);

    useEffect(() => {
        const endpoint = selectedData.type  == "enslaved" ? "past/enslaved/" : "past/enslavers/";
        const targets = (() => {
          switch (selectedData.type) {
            case "enslaved": return selectedData.enslaved;
            case "enslaver": return selectedData.enslaver; // here check
          }
        })()
        // console.log("targets: ", targets);
        // console.log("endpoint: ", endpoint);
        const fetchData = async ()=> {
          const promises = targets.map(target => {
            let queryData = new FormData();
            queryData.append("hierarchical", "False");
            queryData.append("id", target.toString());
            queryData.append("id", target.toString());
            return fetch(base_url + endpoint, {
              method: "POST",
              body: queryData,
              headers: {'Authorization': auth_token}
            }).then(res => res.json()).then(res => res[0])
          })
          const response = await Promise.all(promises)
          setSrc(response)
        }
        fetchData().catch(console.error);
      }, [])

    return(
        <Grid  container spacing={{ xs: 6, md: 4, lg:5}} padding={{ xs: 4, md: 3, lg:4 }} paddingTop={{ xs: 0, md: 0, lg:0 }}  >
        {src.map((item, index) => {
            return <Grid item xs={12} sm={6} md={4} lg={3} key={index}><Story target={item} dynamic={true} slavery={selectedData.type}/></Grid>
        })}
        </Grid>
    )
    
}