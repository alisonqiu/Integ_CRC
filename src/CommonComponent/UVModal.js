import React, {
    useRef,
    useState,
    useEffect,
    useLayoutEffect,
    useContext,
  } from "react";
  import "universalviewer/dist/esm/index.css";
  import { init } from "universalviewer";
  import {
    //Button,
    Modal,
    Box,
    // Card,
    // CardContent,
    // Typography,
    // Container,
    // Avatar,
  } from "@mui/material";
  // import ResponsiveAppBar from "../NavBar";
  // import { DocContext } from "./DocumentsApp";
  // import UVModal from "./UVModal";
  // import Link from "@mui/material/Link";
  
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
  
  const UniversalViewer = ({ manifest }) => {
    const el = useRef();
    const viewer = useUniversalViewer(el, {
      manifest,
    });
    return (
      <div
        ref={el}
        className="uv"
        style={{
          width: "50vw",
          height: "50vh",
        }}
      />
    );
  };
  
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    p: 4,
    // overflow: "scroll",
    maxHeight: 500,
  };
  
  export default function UVModal(props) {
    const { uvOpen, setUVOpen, url } = props.context;
    //const UVContext = React.createContext({});
    const [title, setTitle] = useState(null);
    const [image, setImage] = useState(null);
    const handleUVClose = () => setUVOpen(false);
  
    useEffect(() => {
      if (url !== "") {
        fetch(url)
          .then((response) => response.json())
          .then((response) => {
            setTitle(response.label.none);
            setImage(response.thumbnail[0].id);
          });
      }
    }, [url]);
  
    return (
      <div>
        {/* <ResponsiveAppBar context={DocContext}/> */}
        <Modal open={uvOpen} onClose={handleUVClose}>
          <Box sx={modalStyle}>
            <UniversalViewer manifest={url} />
          </Box>
        </Modal>
      </div>
    );
  }
  