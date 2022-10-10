import React from "react";
import Documents from "./Documents";
//import Archive from "./Archive";
import Archive from "./ArchiveInf"
import ResponsiveAppBar from "../NavBar";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const DocContext = React.createContext({});

export default function DocApp(props) {
    return (
        <div>
        <DocContext.Provider 
            value={{
                dataSet:"0", 
                pageType:"home",
                }}>
            <ResponsiveAppBar context={DocContext}/>
            <Archive/>
        </DocContext.Provider>
        </div>
    )
};
