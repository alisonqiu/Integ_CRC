import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Paper, Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useWindowSize } from "@react-hook/window-size";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function Pivot(props) {
  // const [width, height] = useWindowSize();

  const { complete_object, set_complete_object, dataset, width, height } = props.state
  console.log("pivot complete object", props.state)

  //console.log(complete_object);
  // Responses
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);

  if(props.complete_object){
    complete_object = props.complete_object;
  }

  // Options
  // const [aggregation, setAgg] = React.useState("sum");
  // const [option, setOption] = useState({
  //   row: complete_object["groupby_fields"][0],
  //   col: complete_object["groupby_fields"][1],
  //   cell: complete_object["value_field_tuple"][0],
  // });

  //console.log(option);
  // const handleChange_agg = (event) => {
  //   setAgg(event.target.value);
  // };

  // const handleChange = (event, name) => {
  //   setOption({
  //     ...option,
  //     [name]: event.target.value,
  //   });
  // };

  // Set rows
  useEffect(() => {
    var data = new FormData();
    //data.append("hierarchical", "False");
    for (var property in complete_object) {
      if (property !== "groupby_fields") {
        // eslint-disable-next-line no-loop-func
        complete_object[property].forEach((v) => {
          //console.log(property, v);
          data.append(property, v);
        });
      }
    }
    data.append("dataset", dataset);
    data.append("dataset", dataset);

    data.append("groupby_fields", complete_object["groupby_fields"][1]);
    data.append("groupby_fields", complete_object["groupby_fields"][0]);
    // data.append("value_field_tuple", option.cell);
    // data.append("value_field_tuple", aggregation);
    // data.append("cachename", "voyage_export");
    axios
      .post("/voyage/crosstabs", data)
      .then(function (response) {
        //console.log("-----set rows-----");
        //console.log(response.data);
        const row_name = Object.keys(response.data);
        const rows = Object.values(response.data);
        for (var i = 0; i < rows.length; i++) {
          rows[i][""] = row_name[i];
        }
        if ("normalize" in complete_object) {
          rows.map((row) =>
            Object.keys(row)
              .filter((num) => num !== "")
              .filter(
                (num) => !isNaN(parseFloat(row[num])) && isFinite(row[num])
              )
              .map((e) => (row[e] = Math.round(row[e] * 1000) / 10 + "%"))
          );
        }
        setRows(rows);
        //console.log("rows=",rows);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [complete_object, props.disembark, dataset]);

  // Set columns
  useEffect(() => {
    var data = new FormData();
    //data.append("hierarchical", "False");
    for (var property in complete_object) {
      if (property !== "groupby_fields") {
        // eslint-disable-next-line no-loop-func
        complete_object[property].forEach((v) => {
          data.append(property, v);
        });
      }
    }
    data.append("groupby_fields", complete_object["groupby_fields"][0]);
    data.append("groupby_fields", complete_object["groupby_fields"][1]);
    data.append("dataset", dataset);
    data.append("dataset", dataset);

    // data.append("value_field_tuple", option.cell);
    // data.append("value_field_tuple", aggregation);
    // data.append("cachename", "voyage_export");
    axios
      .post("/voyage/crosstabs", data)
      .then(function (response) {
        //console.log("-----set columns-----");
        const empty = [""];
        //console.log(empty.concat(Object.keys(response.data)));
        setCols(empty.concat(Object.keys(response.data)));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [complete_object, props.disembark, dataset]);

  // if (isLoading) {
  //   return <div className="spinner"></div>;
  // }

  useEffect(() => {
    if (props.dispatch) {
      props.dispatch();
    }
  }, [rows, cols]);

  return (
    <div>
        {/* <Grid item sx={{ width: props.popup ? "120%" : (width > 800 ? width * 0.9 : width * 0.7) }}> */}
        <Grid item sx={{ }}>
          <TableContainer component={Paper} sx={{}}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
                  {cols.map((col, key) => (
                    <TableCell key={"title-" + key}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, key) => (
                  <TableRow
                    key={"row-" + key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {cols.map((s, key) => {
                      if (typeof row[s] === "number") {
                        return (
                          <TableCell key={"content-" + key}>
                            {Math.round(row[s])}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={"content-" + key}>
                            {row[s] || 0}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
    </div>
  );
}

export default Pivot;
