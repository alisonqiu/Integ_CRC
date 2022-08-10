import * as React from "react";
import {useEffect, useState} from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItem,
  ListItemText,
  OutlinedInput,
  TablePagination
} from '@mui/material';
import {TreeItem, TreeView} from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import _ from 'lodash';
import {usePagination} from "react-use-pagination";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from '@mui/icons-material/Menu';
import fileDownload from 'js-file-download';
import CloseIcon from '@mui/icons-material/Close';
import {useQuery} from "react-query";
import TextField from "@mui/material/TextField";
// import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
// import BookmarkIcon from '@mui/icons-material/Bookmark';

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

function OptionSelector(props) {
  const [resultObject, setResultObject] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resultObjectPage = usePagination({totalItems: Object.keys(resultObject).length, initialPageSize: 8});
  const [endPoint, setEndPoint] = useState('voyage/');
  const [id, setId] = useState("1");
  const {isLoading, error, data: options, refetch} = useQuery('Options',
    () => fetch(base_url + endPoint, {
      method: "OPTIONS",
      headers: {'Authorization': auth_token}
    }).then(res => res.json())
      .then((res => {
        addSelf(res)
        return res
      }))
  )

  function addSelf(node) {
    Object.keys(node).forEach(key => {
      if(!isLast(node[key])) {
        node[key] = {
          self : {
            type: "group label",
            label: node[key].label,
            flatlabel: node[key].flatlabel
          },
          ...node[key]
        }
        addSelf(node[key])
      }
    })
  }

  const getChildrenPath = (node) => {
    let result = []
    node = node ? node : options
    const helper = (node, path) => Object.keys(node).forEach((key) => {
      if (isLast(node[key])) {
        if (isChildren(key)) {
          result.push([...path, key])
        }
      } else {
        return helper(node[key], [...path, key])
      }
    })
    helper(node, [])
    return result;
  }

  function isChildren(key) {
    return key !== "type" && key !== "label" && key !== "flatlabel"
  }

  function isLast(node) {
    return node.type !== "table"
  }

  function handleClick(path) {
    if (_.has(resultObject, path.join('__'))) {
      setResultObject(_.omit(resultObject, path.join("__")))
    } else {
      setResultObject({
        [path.join('__')]: _.get(options, path),
        ...resultObject
      })
    }
  }

  // function handleClickGroupLabel(event, path) {
  //   event.stopPropagation();
  //   if (_.has(resultObject, path.join('__'))) {
  //     setResultObject(_.omit(resultObject, path.join("__")))
  //   } else {
  //     const groupObject = _.get(options, path)
  //     setResultObject({
  //       [path.join('__')]: {type: groupObject.type, label:groupObject.label, flatlabel: groupObject.flatlabel},
  //       ...resultObject
  //     })
  //   }
  // }

  function isAllChildrenChecked(path) {
    let result = true;
    getChildrenPath(_.get(options, path)).forEach((itemPath) => {
      if (!_.has(resultObject, [...path, ...itemPath].join("__"))) {
        result = false;
      }
    })
    return result;
  }

  function isAllChildrenUnChecked(path) {
    let result = true;
    getChildrenPath(_.get(options, path)).forEach((itemPath) => {
      if (_.has(resultObject, [...path, ...itemPath].join("__"))) {
        result = false;
      }
    })
    return result;
  }

  function handleClickParent(event, path) {
    event.stopPropagation();
    if (isAllChildrenChecked(path)) {
      let newResult = {...resultObject}
      getChildrenPath(_.get(options, path)).forEach((itemPath) => {
        newResult = _.omit(newResult, [...path, ...itemPath].join("__"))
      })
      setResultObject(newResult)
    } else {
      let newResult = {...resultObject}
      getChildrenPath(_.get(options, path)).forEach((itemPath) => {
        newResult = {
          [[...path, ...itemPath].join("__")]: _.get(options, [...path, ...itemPath]),
          ...newResult
        }
        // _.set(newResult, [...path, ...itemPath].join("__"), _.get(options, [...path, ...itemPath]))
      })
      setResultObject(newResult)
    }
  }

  const loadFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      // console.log(text.replace(/[\r\n\t\s]+/g, ""))
      const tmp = JSON.parse(text.replace(/[\r\n\t\s]+/g, ""));
      _.forIn(tmp, (value, key) =>{
        console.log(value)
        if(value.type === "table"){
          tmp[key+"__self"] = {...value, type:"group label"}
          delete tmp[key]
        }
      })
      setResultObject(tmp)
    };
    reader.readAsText(e.target.files[0]);
  };

  const pageSelector =
    <table hidden={Object.keys(resultObject).length <= resultObjectPage.pageSize}>
      <tbody><tr>
        <TablePagination
          count={Object.keys(resultObject).length}
          page={resultObjectPage.currentPage > 0 ? resultObjectPage.currentPage : 0}
          onPageChange={(e, v) => {
            resultObjectPage.setPage(v)
          }}
          rowsPerPage={resultObjectPage.pageSize}
          onRowsPerPageChange={(e) => {
            resultObjectPage.setPageSize(parseInt(e.target.value, 10))
            resultObjectPage.setPage(0)
          }}
          rowsPerPageOptions={[4, 8, 16, 32, 64]}
        />
      </tr></tbody>
    </table>

  var count = 0;
  const renderTree = (nodes, path) => (
    <TreeItem key={nodes.label} nodeId={"" + count++} label={
      <div>
        <Checkbox
          checked={isAllChildrenChecked(path)}
          indeterminate={!isAllChildrenUnChecked(path) && !isAllChildrenChecked(path)}
          onClick={(event) => handleClickParent(event, path)}/>
        {nodes.label ?
          <label>{nodes.label}
            {/*<Checkbox checked={_.has(resultObject, path.join('__'))}*/}
            {/*          onClick={(event) => handleClickGroupLabel(event, path)}*/}
            {/*          icon={<BookmarkBorderIcon />}*/}
            {/*          checkedIcon={<BookmarkIcon />}/>*/}
          </label>
          : "Select All"}

      </div>
    }>
      {Object.keys(nodes).map((key) =>
        isChildren(key)?
          isLast(nodes[key]) ?
            <ListItem key={key} disablePadding>
              <Checkbox checked={_.has(resultObject, [...path, key].join('__'))}
                        onClick={(event) => handleClick([...path, key])}/>
              <ListItemText primary={key} secondary={nodes[key].flatlabel}/>
            </ListItem>
            : renderTree(nodes[key], [...path, key])
          :null
      )}
    </TreeItem>
  );

  function handleShowData(){
    let queryData = new FormData();
    queryData.append("id", id);
    queryData.append("id", id);
    fetch(base_url + endPoint, {
      method: "POST",
      headers: {'Authorization': auth_token},
      body: queryData,
    }).then(res => res.json()).then(res=>console.log(res[0]))
  }

  if (error) return 'An error has occurred on options: ' + error.message
  if (isLoading) return <CircularProgress/>

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" color="inherit" onClick={() => {
            setIsMenuOpen(!isMenuOpen)
          }}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            Option Selector
          </Typography>

          <TextField sx={{background: "rgba(255,255, 255, 0.5)", width: 100}} label="id" variant="filled" value={id} type="number"
                     onChange={(e)=>setId(e.target.value)}/>
          <Button color="inherit" onClick={handleShowData} sx={{marginRight: 5}}>
            print
          </Button>

          <TextField sx={{background: "rgba(255,255, 255, 0.5)"}} label="end point" variant="filled" value={endPoint}
                     onChange={(e)=>setEndPoint(e.target.value)}/>
          <Button color="inherit" onClick={()=>{setResultObject({}); refetch()}} sx={{marginRight: 5}}>
            Set Endpoint
          </Button>
          <Button color="inherit" component="label">
            Import
            <input type="file" onChange={loadFile} hidden/>
          </Button>
          <Button color="inherit" onClick={() => {
            fileDownload(JSON.stringify(resultObject, null, 2)
              .replaceAll("__self", "")
              .replaceAll("\"type\": \"group label\"", "\"type\": \"table\""),
              "options.json")
          }}>Export</Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={1}>
        <Grid item xs={4} hidden={isMenuOpen}>
          <Card sx={{height: 850, flexGrow: 1, maxWidth: 800, overflowY: 'auto', overflowX: 'auto'}}>
            <CardContent>
              <TreeView
                aria-label="option menu"
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
              >
                {renderTree(options, [])}
              </TreeView>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={isMenuOpen ? 12 : 8}>
          <Card sx={{flexGrow: 1, height: 850, overflowY: 'auto'}}>
            <CardHeader title={"Selected Options"}/>
            {pageSelector}
            <CardContent>
              <Box>
                <Grid container spacing={2}>
                  {Object.keys(resultObject).slice(resultObjectPage.startIndex, resultObjectPage.endIndex + 1).map((key) =>
                    <Grid item key={key}>
                      <FormControl id={key} sx={{width: key.length * 10 + 70}} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">{key}</InputLabel>
                        <OutlinedInput
                          value={resultObject[key].flatlabel}
                          onChange={(event) => setResultObject({
                            ...resultObject,
                            [key]: {...resultObject[key], flatlabel: event.target.value}
                          })}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setResultObject(_.omit(resultObject, key))}
                                edge="end"
                              >
                                <CloseIcon/>
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>)}
                </Grid>
              </Box>
            </CardContent>
            <CardActions>
              {pageSelector}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      {/*<p>{JSON.stringify(resultObject)}</p>*/}
    </div>
  );
}

export default OptionSelector;