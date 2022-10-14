import React from "react";
import {
    LazyLoadComponent,
    trackWindowScroll
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { Animated } from "react-animated-css";
import { Box, Button, Divider, List, ListItem } from "@mui/material";
const Gallery = ({ components, scrollPosition }) => (
    <div>
        {components.map((component, index) =>
            <LazyLoadComponent key={index} placeholder={<Box sx={{ width: 300, height: 300 }} />} scrollPosition={scrollPosition} threshold={1} >
                <ListItem >
                    <Animated
                        animationIn="slideInLeft"
                        animationOut="fadeOut"
                        animationInDelay={400}
                        animationOutDelay={500}
                        animationOutDuration={3000}
                    >
                        {component}
                        <Divider />
                    </Animated>
                </ListItem>
            </LazyLoadComponent>
        )}
    </div>
);
// Wrap Gallery with trackWindowScroll HOC so it receives
// a scrollPosition prop to pass down to the images
export default trackWindowScroll(Gallery);
