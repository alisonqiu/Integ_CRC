import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Button, Modal, Box, Container, Avatar, ListItem,Dialog,TablePagination, CardMedia, Typography, Grid, Link, CircularProgress } from "@mui/material";
import "universalviewer/dist/esm/index.css";
import { init } from "universalviewer";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import ArchiveItem from "./ArchiveItem";

import {
    useWindowSize,
  } from '@react-hook/window-size'
import axios from "axios";
import { SettingsOverscanOutlined } from "@mui/icons-material";
import { alpha } from "@mui/material";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
function useUniversalViewer(ref, options) {
    const [uv, setUv] = useState();
  
    useLayoutEffect(() => {
      const currentUv = init(ref.current, options);
      setUv(currentUv);
  
      return () => {
        currentUv.dispose();
      };
    }, []);
  
    return uv;
  }

const UV = ({ manifest, parentWidth }) => {
  const el = useRef();
  const viewer = useUniversalViewer(
    el,
    {
      manifest,
    }
  );
  return <div ref={el} 
          className="uv" 
          style={{
            width: "50vw",
            height: "50vh"
          }}
          />;
};
function curImage(src){
  var arr1 = src.split("medium");
  return arr1[0] + "square" + arr1[1];
}


export default function Archive() {
    const [width, height] = useWindowSize()
    const [manifest, setManifest]= useState({});
    const [open, setOpen] = useState(false);
    const [apiUrl,setapiurl] = useState([])
    const [itemData, setData] = useState([])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(16);
    const [total, setTotal] = useState(0)
    
    const [pics, setPics] = useState([]);
    const temp = []

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleOpen = (manifest) => {
      setOpen(true);
      setManifest(manifest);
    }
    const handleClose = () => setOpen(false);
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        p: 4,
        // overflow: "scroll",
        maxHeight: 500,
      };

      useEffect(()=>{
        var data = new FormData();
        fetch('https://voyages3-api.crc.rice.edu/docs/',{
          method: 'POST',
          body: data,
          headers: {'Authorization':AUTH_TOKEN}
        }).then(res=>setTotal(parseInt(res.headers.get("total_results_count"))));
      },[])

      useEffect(()=>{
        const fetchData = async () => {
        var data = new FormData();
        data.append("hierarchical", "False");
        data.append("selected_fields", 'url');
        data.append("results_per_page", total);
        // data.append("results_page", page + 1);
        const res = await fetch('https://voyages3-api.crc.rice.edu/docs/',{
          method: 'POST',
          body: data,
          headers: {'Authorization':AUTH_TOKEN}
        })
        const result = await res.json();
        setapiurl(result)
      }
        fetchData().catch(console.error);
      },[total])

      useEffect(() => {
        const fetchData = async ()=> {
          const promises = apiUrl.map(iifUri => {
            return fetch(Object.values(iifUri), {
              method: "GET",
            }).then(res => Promise.resolve(res.json())).then(res => {
            // setPics([...pics, <ArchiveItem img ={curImage(res.thumbnail[0].id)} title={res.label.none[0]} uri={iifUri.url} scrollPosition={window.scrollY} handleOpen={handleOpen}/>])
              // temp.push(<ArchiveItem img ={curImage(res.thumbnail[0].id)} title={res.label.none[0]} uri={iifUri.url} scrollPosition={window.scrollY} handleOpen={handleOpen}/>);
              return ({"title": res.label.none[0], "image": curImage(res.thumbnail[0].id),"uri":iifUri.url});
            })
          })
          const response = await Promise.all(promises)
          setData(response)
        }
        fetchData().catch(console.error);
      }, [apiUrl])
    // console.log(itemData)

    // for(const url of apiUrl){
    //     fetch(Object.values(url), {method: "GET"}).then(res => res.json()).then(res => {
    //       var dict = {"title": res.label.none[0], "image": curImage(res.thumbnail[0].id),"uri":url}
    //       return dict;
    //     }).then(res => setPics(...pics, res.image))
    // }

    // if(itemData.length < 20){
    //   return <CircularProgress />
    // }
    return (
        // <div>
        //     <TablePagination
        //       component="div"
        //       count={total}
        //       page={page}
        //       onPageChange={handleChangePage}
        //       rowsPerPage={rowsPerPage}
        //       onRowsPerPageChange={handleChangeRowsPerPage}
        //       rowsPerPageOptions={[16, 25, 36, 49, 64]}
        //     />
        //     <ImageList sx={{ width: width, height: (page + 1) * rowsPerPage > total ? 200: height }} cols={
        //       (page + 1) * rowsPerPage > total ? 8 :
        //       Math.sqrt(rowsPerPage)
        //       } gap={30} >
        //     {/* <ImageList sx={{ width: width, height: height }} cols={parseInt(width/300)} gap={20} > */}
        //       {itemData.map((item) => (
        //         <ImageListItem key={item.image}>
        //           <img
        //             src={`${item.image}?w=248&fit=crop&auto=format`}
        //             srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
        //             alt={item.title}
        //             loading="lazy"
        //           />
        //           <ImageListItemBar
        //             title={item.title}
        //             sx ={{
        //               bgcolor: alpha('#549165',0.8)
        //             }}
        //             actionIcon={
        //               <IconButton
        //                 sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
        //                 aria-label={`info about ${item.title}`}
        //                 onClick={() => handleOpen(item.uri.url)}
        //               >
        //                 <InfoIcon />
        //               </IconButton>
        //             }
        //           />
        //         </ImageListItem>
        //       ))}
        //     </ImageList>
        //     <Modal
        //         open={open}
        //         onClose={handleClose}
        //         aria-labelledby="modal-modal-title"
        //         aria-describedby="modal-modal-description"
        //     >
        //         <Box sx={modalStyle}>
        //             <UV manifest={manifest} />
        //         </Box>
        //     </Modal>
        // </div>
      <div>
        {/* <Gallery itemData={itemData} scrollPosition={window.scrollY} handleOpen={handleOpen}/> */}
        <Grid  container spacing={{ xs: 2, md: 2, lg:2}} padding={{ xs: 4, md: 3, lg:4 }}>
        {/* {itemData.map(item => {
          return <ArchiveItem image ={item.image} title={item.title} uri={item.uri} scrollPosition={window.scrollY} handleOpen={handleOpen}/>
        })} */}
        {apiUrl.map((item,index) => {
          return <ArchiveItem key={index} iifUrl={item} scrollPosition={window.scrollY} handleOpen={handleOpen}/>
        })}
        </Grid>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <UV manifest={manifest} />
            </Box>
        </Modal>
    </div>

    );
}
