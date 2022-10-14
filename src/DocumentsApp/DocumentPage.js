import React from "react";
//import Archive from "./Component/Archive";
import Archive from "./Component/ArchiveInf";
// import ResponsiveAppBar from "../NavBar";
import Navbar from "../CommonComponent/NavBar";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const DocContext = React.createContext({});

export default function DocApp(props) {
    const state = {dataset: "0", pageType: "documents"};
    return (
        <div>
            <Navbar state={state}/>
            <Archive/>
        </div>
    )
};
