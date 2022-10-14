import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridColumnMenuContainer,
  SortGridMenuItems,
  HideGridColMenuItem,
  GridFilterMenuItem,
} from "@mui/x-data-grid";
import { Box, Button, LinearProgress, Popper } from "@mui/material";
import { useMemo, useState } from "react";
import Cell from "./Cell";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import * as React from "react";
import TableChartIcon from "@mui/icons-material/TableChart";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ColSelector from "./ColumnSelector";
import VoyageModal from "../VoyageModal";
import UVModal from "../UVModal";
import HubIcon from "@mui/icons-material/Hub";
import "./tableStyle.css";

export const TableContext = React.createContext({});

export default function Table(props) {
  const {
    pageType,
    dataset,
    dataList,
    pagination,
    setPagination,
    setSortModel,
    isLoading,
    checkbox,
    default_list,
    variables_tree,
    options_flat,
    selectedData,
    setSelectedData,
    handleDialogOpen,
    handleGallery,
    setDrawerOpen,
  } = props.state;

  const [selectionModel, setSelectionModel] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(null);
  const [voyageOpen, setVoyageOpen] = useState(false);
  const [uvOpen, setUVOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [voyageId, setVoyageId] = useState(0);

  const var_list = useMemo(() => {
    let result = [];
    const buildVarList = (node) => {
      Object.keys(node).forEach((key) => {
        if (node[key]) {
          buildVarList(node[key]);
        } else {
          result.push(key);
        }
      });
    };
    buildVarList(variables_tree);
    return result;
  }, [variables_tree]);

  const columns = useMemo(() => {
    const result = [];
    const colVisModel = {};
    const length = (column) => {
      const defaultLength = Math.max(
        ...dataList.map((e) => (e[column] ? e[column].toString().length : 0)),
        options_flat[column].flatlabel.length
      );
      if (dataList.length === 0) return 1;
      // switch (options_flat[column].flatlabel) {
      //   case "Ship Owner Name":
      //     return defaultLength;
      // }
      if(defaultLength > 5 * options_flat[column].flatlabel.length) return options_flat[column].flatlabel.length;
      return defaultLength;
    };
    var_list.forEach((column) => {
      colVisModel[column] = !!default_list.find((e) => e === column);
      result.push({
        field: column,
        headerName: options_flat[column].flatlabel,
        renderCell: Cell,
        width: 10 * length(column)+10,
      });
    });
    if (!columnVisibilityModel) setColumnVisibilityModel(colVisModel);
    return result;
  }, [dataList]);
  
  function handledialogPagetype(){
    setSelectedData({
      ...selectedData,
      type: pageType,
    });
  }

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const handleChange = (event) => {
      setPagination({ ...pagination, rowsPerPage: event.target.value });
    };

    return (
      <Stack direction="row" spacing={2}>
        <div sx={{ border: 0 }}>
          Rows Per Page: &nbsp;&nbsp;
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={pagination.rowsPerPage}
            label="Age"
            onChange={handleChange}
            style={{ height: 30 }}
          >
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={24}>24</MenuItem>
          </Select>
        </div>
        <div>
          <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
          />
        </div>
      </Stack>
    );
  }

  const toolBarColor = useMemo(() => {
    if (pageType === "enslaver") {
      return "success";
    }
    if (dataset === "0") {
      return "primary";
    } else {
      return "secondary";
    }
  }, [pageType, dataset]);

  const PastToolbar = () => (
    <GridToolbarContainer>
      <Stack direction={"row"} spacing={1}>
        <Button
          color={toolBarColor}
          variant="contained"
          startIcon={<DashboardCustomizeIcon />}
          onClick={() => {
            handleGallery("story");
          }}
        >
          Gallery
        </Button>
        <Button
          color={toolBarColor}
          startIcon={<HubIcon />}
          disabled={selectionModel.length === 0 || dataset === "0"}
          onClick={() => {handledialogPagetype();handleDialogOpen()}}
        >
          Connections ({selectionModel.length})
        </Button>
        <ColSelector
          state={{
            columnVisibilityModel,
            setColumnVisibilityModel,
            variables_tree,
            options_flat,
            toolBarColor,
          }}
        />
        <GridToolbarDensitySelector color={toolBarColor} />
        <GridToolbarExport color={toolBarColor} />
        {pageType === "enslaver" ? (
          <Link to={"/past/enslaved"} style={{ textDecoration: "none" }}>
            <Button color={toolBarColor} startIcon={<TableChartIcon />}>
              to Enslaved
            </Button>
          </Link>
        ) : (
          <Link to={"/past/enslaver"} style={{ textDecoration: "none" }}>
            <Button color={toolBarColor} startIcon={<TableChartIcon />}>
              to Enslaver
            </Button>
          </Link>
        )}
      </Stack>
    </GridToolbarContainer>
  );

  const VoyageToolbar = () => (
    <GridToolbarContainer>
      <ColSelector
        state={{
          columnVisibilityModel,
          setColumnVisibilityModel,
          variables_tree,
          options_flat,
        }}
      />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  const ColumnMenu = (props)=>{
    const { hideMenu, currentColumn, open } = props;
    return (
      <GridColumnMenuContainer hideMenu={hideMenu} currentColumn={currentColumn} open={open}>
        <SortGridMenuItems column={currentColumn} onClick={hideMenu}/>
        <HideGridColMenuItem column={currentColumn} onClick={hideMenu}/>
        <MenuItem onClick={(event)=> {
          hideMenu(event)
          setDrawerOpen(true)
        }}>Filter</MenuItem>
      </GridColumnMenuContainer>
  )}

  return (
    <TableContext.Provider
      value={{
        selectedData,
        setSelectedData,
        handleDialogOpen,
        setVoyageOpen,
        setVoyageId,
        uvOpen,
        setUVOpen,
        url,
        setUrl,
      }}
    >
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight={true}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          rows={dataList}
          rowCount={pagination.totalRows}
          loading={isLoading}
          components={{
            LoadingOverlay: LinearProgress,
            Toolbar: pageType === "voyage" ? VoyageToolbar : PastToolbar,
            Pagination: CustomPagination,
            ColumnMenu: ColumnMenu
          }}
          // pagination
          pagination
          paginationMode="server"
          page={pagination.currPage}
          pageSize={pagination.rowsPerPage}
          onPageChange={(newPage) => {
            setPagination({ ...pagination, currPage: newPage });
          }}
          onPageSizeChange={(newPageSize) => {
            setPagination({ ...pagination, rowsPerPage: newPageSize });
          }}
          // sorting
          sortingMode="server"
          onSortModelChange={(newSortModel) => {
            setSortModel(newSortModel);
          }}
          // checkbox
          checkboxSelection={checkbox}
          keepNonExistentRowsSelected
          isRowSelectable={(params) => {
            if (
              (params.row.transactions != null &&
                params.row.transactions.length !== 0) ||
              (params.row.number_enslaved != null &&
                params.row.number_enslaved > 0) || pageType === "voyage"
            ) {
              return true;
            } else {
              return false;
            }
          }}
          onSelectionModelChange={(newSelectionModel) => {
            if (pageType === "voyage") {
              setVoyageId(newSelectionModel[0]);
              setVoyageOpen(true);
            } else if (newSelectionModel.length <= 10) {
              // set the maximum number of the selected people
              setSelectionModel(newSelectionModel);
              setSelectedData({
                ...selectedData,
                type: pageType,
                [pageType]: newSelectionModel,
              });
            }
          }}
          selectionModel={selectionModel}
          style={{ zIndex: 0 }}
        />
        {voyageOpen && (
          <VoyageModal
            context={{ voyageOpen, setVoyageOpen, voyageId, setUVOpen, setUrl }}
          />
        )}
        {uvOpen && <UVModal context={{ uvOpen, setUVOpen, url }} />}
      </div>
    </TableContext.Provider>
  );
}
