import React from "react";
import { Button, Modal, Box, Container, Avatar, ListItem,Dialog,TablePagination, CardMedia, Typography, Grid, Link } from "@mui/material";
import {
  LazyLoadImage,
  trackWindowScroll
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import Loading from "./logo512.png";

const ArchiveItem = ({ image, title, uri, scrollPosition, handleOpen }) => (
      <Grid item xs={12} sm={6} md={4} lg={3} width="40vh" >
      <Box sx={{ position: 'relative' }} >
        <LazyLoadImage
          key={image}
          alt={"documents_".concat(title)}
          height="100%"
          effect="opacity"
          scrollPosition={scrollPosition}
          src={image}
          width="100%"
          placeholder={<img src={Loading} alt="logo"/>}
          threshold={400}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height:{xs:"2em", sm:"2.7em"},
            // bgcolor: 'rgba(0, 0, 0, 0.54)',
            bgcolor: "rgba(123,139,111, 0.7)",
            // padding: '10px',
            // py: {xs: 0, md: '0.4em', lg:'0.2em'},
            mb:"0.25em",
            fontStyle: 'italic',
            textAlign: "center",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body3"color="#FFFFFF" component={Link} underline="hover">
            <Link href="src/DocumentsApp/Component/ArchiveItem#" underline="hover" color="#FFFFFF" onClick={() => handleOpen(uri)}>{title}</Link>
          </Typography>
        </Box>
      </Box>
      </Grid>
);

export default trackWindowScroll(ArchiveItem);