import React from "react";
import { useQuery } from "react-query";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { scaleSequential } from "d3-scale";
import { interpolateCool } from "d3";
import { linkHorizontal } from "d3-shape";
import Sankey from "./CircularSankey";
import { useState } from "react";
import {
  voyage_pivot_tables_source,
  voyage_pivot_tables_target,
  voyage_maps,
} from "./vars";
import _ from "lodash";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
export default function SankeyExample(props) {
  const { isLoading, error, data, refetch } = useQuery("", () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", AUTH_TOKEN);

    var formdata = new FormData();
    formdata.append("groupby_fields", option.fieldTarget);
    formdata.append("groupby_fields", option.fieldSource);

    formdata.append(
      "value_field_tuple",
      "voyage_slaves_numbers__imp_total_num_slaves_embarked"
    );
    formdata.append("value_field_tuple", "sum");
    formdata.append("cachename", "voyage_pivot_tables");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    return fetch(
      "https://voyages3-api.crc.rice.edu/voyage/crosstabs",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {

        let allNodes = new Set();
        let nodes = [];
        let links = [];

        Object.keys(result).forEach((source) => {
          allNodes.add(source);
          Object.keys(result[source]).forEach((target) => {
            allNodes.add(target);
          });
        });

        allNodes.forEach((source) => {
          nodes.push({ name: source });
        });

        let res = new Map(Object.entries(result));

        // Use Map to deal with Json -> with less memory usage

        res.forEach((value, key) => {
          new Map(Object.entries(value)).forEach((val, target) => {
            links.push({
              source: [...allNodes].indexOf(key),
              target: [...allNodes].indexOf(target),
              value: val,
            });
          });
        });

        // use Object to deal with Json [Use too much memeory, might lead website cursh]

        // Object.keys(result).forEach(source =>{
        //   // console.log("🔥",source)
        //   Object.keys(result[source]).forEach(target =>{
        //     // console.log("     🧍‍♀️",target)
        //     links.push({
        //       "source": [...allNodes].indexOf(source),
        //       "target": [...allNodes].indexOf(target),
        //       "value": result[source][target]
        //     })
        //   })
        // })

        return {
          nodes: nodes,
          links: links,
        };
        // return
      })
      .catch((error) => console.log("error", error));
  });

  // print the request data

  const [state, setState] = useState({
    highlightLinkIndexes: [],
    nodePadding: 10,
    component: "Sankey",
    nodeData: {},
    linkData: {
      source: "ini",
      target: "ini",
    },
  });

  const [optionSource, setOptionSource] = useState([
    ...voyage_pivot_tables_source,
  ]);
  const [optionTarget, setOptionTarget] = useState([
    ...voyage_pivot_tables_target,
  ]);
  const [option, setOption] = useState({
    fieldSource: voyage_pivot_tables_source[2],
    fieldTarget: voyage_pivot_tables_target[1],
  });


  const { filter_obj, set_filter_obj, endpoint, options_flat } = props.state;

  const handleChange = (event, name, type) => {
    console.log(name, event.target.value);
    setOption({
      ...option,
      [name]: event.target.value,
    });
    refetch();
  };

  const path = linkHorizontal()
    .source((d) => [d.source.x1, d.y0])
    .target((d) => [d.target.x0, d.y1]);

  const color = scaleSequential(interpolateCool);

  const {
    width,
    height,
    margin = {
      top: 0,
      left: 0,
      right: 200,
      bottom: 0,
    },
  } = props;

  const Title = styled("div")(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  }));

  if (width < 10) return null;
  if (isLoading) return "loading";
  if (error) return error.message;

 let resetHandClick = () =>{
  setState( (state) => ({ ...state, highlightLinkIndexes: []}));
  setState(
    (state) => (
    {
    ...state,
    linkData: {
      source: "ini",
      target: "ini",
    },
  }));

  let newObject = {...filter_obj}
  delete newObject[option.fieldSource]
  delete newObject[option.fieldTarget]
  set_filter_obj(newObject);

  // set_search_object({
  //   ...search_object,
  //   [option.fieldSource]: ["null"],
  //   [option.fieldTarget]: ["null"],
  // });
 }

 if(state.linkData.source != "ini" && state.linkData.target != "ini"){
   return(
    <div>

  <Typography>
   {`This path is from
 ${_.get(state, ["linkData", "source", "name"])}
  to
 ${_.get(state, ["linkData", "target", "name"])}
 `}
 </Typography>


 <br />
      <button onClick={() => resetHandClick()}>
        Click to reload the Sankey and the Map!
      </button>
      <br />
      <br />
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      >
        <Sankey
          top={margin.top}
          left={margin.left}
          data={data}
          size={[width, height]}
          nodeWidth={15}
          nodePadding={state.nodePadding}
          extent={[
            [1, 1],
            [width - 1, height - 6],
          ]}
        >
          {/* nodes */}
          {({ data }) => (
            <Group>
              {data.nodes.map((node, i) => (
                <Group top={node.y0} left={node.x0} key={`node-${i}`}>
                  <rect
                    id={`rect-${i}`}
                    width={Math.abs(node.x1 - node.x0)}
                    height={Math.abs(node.y1 - node.y0)}
                    fill={color(node.depth)}
                    opacity={0.5}
                    stroke="white"
                    strokeWidth={1}
                    onMouseOver={(e) => {
                      setState({
                        ...state,
                        highlightLinkIndexes: [
                          ...node.sourceLinks.map((l) => l.index),
                          ...node.targetLinks.map((l) => l.index),
                        ],
                      });
                    }}
                    onMouseOut={(e) => {
                      setState({ ...state, highlightLinkIndexes: [] });
                    }}
                    onClick={() => {
                      setState(
                        {
                          ...state,
                          nodeData: {
                            name: node.name,
                          },
                        }
                      );
                    }}
                  />

                  <Text
                    x={18}
                    y={(node.y1 - node.y0) / 2}
                    verticalAnchor="middle"
                    style={{
                      font: "10px sans-serif",
                    }}
                  >
                    {node.name}
                  </Text>
                </Group>
              ))}

              {/* Edges */}
              <Group>
                {data.links.map((link, i) => (
                  <path
                    key={`link-${i}`}
                    d={path(link)}
                    stroke="black"
                    stroke={
                      state.highlightLinkIndexes.includes(i) ? "red" : "black"
                    }
                    strokeWidth={Math.max(1, link.width)}
                    // opacity={0.2}
                    opacity={
                      state.highlightLinkIndexes.includes(i) ? 0.5 : 0.15
                    }
                    fill="none"
                    // onMouseOver={(e) => {
                    //   setState({ ...state, highlightLinkIndexes: [i] });
                    // }}
                    // onMouseOut={(e) => {
                    //   setState({ ...state, highlightLinkIndexes: [] });
                    // }}
                    onClick={() => {
                      console.log("💩", state.highlightLinkIndexes.length)
                      if (state.highlightLinkIndexes.length < 1) {
                        state.highlightLinkIndexes.push(i);
                        setState({
                          ...state,
                          linkData: {
                            source: link.source,
                            target: link.target,
                          },
                        });
                        set_filter_obj({
                          ...filter_obj,
                          [option.fieldSource]: [link.source.name],
                          [option.fieldTarget]: [link.target.name],
                        });
  
                        } else {
                        state.highlightLinkIndexes.shift();

                        let newObject = {...filter_obj}
                        delete newObject[option.fieldSource]
                        delete newObject[option.fieldTarget]
                        set_filter_obj(newObject);
                        }                            
                    }}
                  />
                ))}
              </Group>
            </Group>
          )}
        </Sankey>
      </svg>

</div>
   )
}

  return ( 
    <div>
      {/* The button allows me to check what I have got right now - testing useage, not necessary */}
      {/* <Button onClick={()=>console.log("data:", data)}>print data</Button> */}

      {/* Dropdown meun which allows users to choose the groupby field. However, some of them are not prefect drawing since the huge density of data. So during developing just comments it but you might want to use it and check it.  */}
      {/* <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Source Field</InputLabel>
      <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={option.fieldSource}
                            label="Source Field"
                            onChange={(event) => {handleChange(event, "fieldSource")}}
                            name="source"
                        >
                            {optionSource.map((option) => 
                              // console.log("op_voyage", options_flat)
                            (
                                <MenuItem key={option} value={option}>
                                     {options_flat[option].flatlabel}
                                </MenuItem>
                            )
                            )}

      </Select>
      </FormControl>

      <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Target Field</InputLabel>
      <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={option.fieldTarget}
                            label="Target Field"
                            onChange={(event) => {handleChange(event, "fieldTarget")}}
                            name="target"
                        >
                            {optionTarget.map((option) => (
                                <MenuItem key={option} value={option}>
                                        {options_flat[option].flatlabel}
                                </MenuItem>
                            ))}

      </Select>
      </FormControl> */}

      <br />
      <button onClick={() => resetHandClick()}>
        Click to reload the Sankey and the Map!
      </button>
      <br />
      <br />
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      >
        <Sankey
          top={margin.top}
          left={margin.left}
          data={data}
          size={[width, height]}
          nodeWidth={15}
          nodePadding={state.nodePadding}
          extent={[
            [1, 1],
            [width - 1, height - 6],
          ]}
        >
          {/* nodes */}
          {({ data }) => (
            <Group>
              {data.nodes.map((node, i) => (
                // console.log(node,i),
                <Group top={node.y0} left={node.x0} key={`node-${i}`}>
                  <rect
                    id={`rect-${i}`}
                    width={Math.abs(node.x1 - node.x0)}
                    height={Math.abs(node.y1 - node.y0)}
                    fill={color(node.depth)}
                    opacity={0.5}
                    stroke="white"
                    strokeWidth={1}
                    onMouseOver={(e) => {
                      setState({
                        ...state,
                        highlightLinkIndexes: [
                          ...node.sourceLinks.map((l) => l.index),
                          ...node.targetLinks.map((l) => l.index),
                        ],
                      });
                    }}
                    onMouseOut={(e) => {
                      setState({ ...state, highlightLinkIndexes: [] });
                    }}
                    onClick={() => {
                      setState(
                        {
                          ...state,
                          nodeData: {
                            name: node.name,
                          },
                        }
                        // console.log("source:"+link.source + " | target:"+link.target + " | value:"+ link.value )
                        // console.log("🫧", node.name)
                      );
                    }}
                  />

                  <Text
                    x={18}
                    y={(node.y1 - node.y0) / 2}
                    verticalAnchor="middle"
                    style={{
                      font: "10px sans-serif",
                    }}
                  >
                    {node.name}
                  </Text>
                </Group>
              ))}

              {/* Edges */}
              <Group>
                {data.links.map((link, i) => (
                  <path
                    key={`link-${i}`}
                    d={path(link)}
                    stroke="black"
                    stroke={
                      state.highlightLinkIndexes.includes(i) ? "red" : "black"
                    }
                    strokeWidth={Math.max(1, link.width)}
                    // opacity={0.2}
                    opacity={
                      state.highlightLinkIndexes.includes(i) ? 0.5 : 0.15
                    }
                    fill="none"
                    // onMouseOver={(e) => {
                    //   setState({ ...state, highlightLinkIndexes: [i] });
                    // }}
                    // onMouseOut={(e) => {
                    //   setState({ ...state, highlightLinkIndexes: [] });
                    // }}
                    onClick={() => {
                     
                     
                      if (state.highlightLinkIndexes.length < 1) {
                        state.highlightLinkIndexes.push(i);
                        setState({
                          ...state,
                          linkData: {
                            source: link.source,
                            target: link.target,
                          },
                        });
  
                        set_filter_obj({
                          ...filter_obj,
                          [option.fieldSource]: [link.source.name],
                          [option.fieldTarget]: [link.target.name],
                        });
                        } else {
                          state.highlightLinkIndexes.shift();
                          // console.log("💩", state.highlightLinkIndexes.length)

                          let newObject = {...filter_obj}
                          delete newObject[option.fieldSource]
                          delete newObject[option.fieldTarget]
                          set_filter_obj(newObject);
                        }
                   
                      
                    }}
                  />
                ))}
              </Group>
            </Group>
          )}
        </Sankey>
      </svg>

      {/* The area to view the path and node inforamtion which has been clicked */}
      {/* <Card sx={{ maxWidth: 345 }}>
        <Typography>{`Node is ${state.nodeData.name}`}</Typography>

        <Typography>
          {`This path is from
      ${_.get(state, ["linkData", "source", "name"])}
       to
      ${_.get(state, ["linkData", "target", "name"])}
      `}
        </Typography>
      </Card> */}
    </div>
  );
}
