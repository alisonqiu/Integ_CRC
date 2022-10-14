import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import OptionSelector from './Util/OptionSelector';

import { ThemeProvider } from '@mui/material/styles';
import {theme} from "./Theme";
import VoyagePage from "./VoyageApp/VoyagePage";
import DocumentPage from "./DocumentsApp/DocumentPage";
import EnslavedPage from "./PASTApp/EnslavedApp/EnslavedPage";
import EnslaverPage from "./PASTApp/EnslaverApp/EnslaverPage";
import HomePage from "./HomeApp/HomePage"

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="documents" element={<DocumentPage/>}/>
            <Route path="optionSelector" element={<OptionSelector/>}/>
            <Route path="voyage/:id" element={<VoyagePage/>}/>
            <Route path="past/enslaved" element={<EnslavedPage/>}/>
            <Route path="past/enslaver" element={<EnslaverPage/>}/>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

