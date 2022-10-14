import { useState, useEffect } from "react";
import {
  voyage_default_list,
  columnOptions as variables_tree,
} from "../../Util/tableVars";
import axios from "axios";
import * as options_flat from "../options.json";
import Table from "../../CommonComponent/Table/Table";

export default function VoyageTable(props) {
  const { filter_object, dataset, pageType, setDrawerOpen } = props.state;
  const [isLoading, setIsLoading] = useState(false);
  const [cols, setCols] = useState(voyage_default_list);
  // data response
  const [dataList, setDataList] = useState([]);
  // pagination
  const [pagination, setPagination] = useState({
    currPage: 0,
    rowsPerPage: 12,
    totalRows: 0,
  });
  // sorting
  const [sortModel, setSortModel] = useState([]);

  useEffect(() => {
    //console.log("fetching...", pagination);
    setIsLoading(true);
    setDataList([]);
    let queryData = new FormData();
    queryData.append("hierarchical", "False");
    queryData.append("results_page", pagination.currPage + 1);
    queryData.append("results_per_page", pagination.rowsPerPage);
    queryData.append("dataset", dataset);
    queryData.append("dataset", dataset);
    if (sortModel.length !== 0) {
      sortModel.map((field) =>
        field.sort === "asc"
          ? queryData.append("order_by", field.field)
          : queryData.append("order_by", "-" + field.field)
      );
    }
    for (const property in filter_object) {
      filter_object[property].forEach((v) => {
        queryData.append(property, v);
      });
    }
    axios.post("/" + pageType + "/", queryData).then((res) => {
      setPagination({
        ...pagination,
        totalRows: Number(res.headers.total_results_count),
      });
      setDataList(res.data);
      setIsLoading(false);
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.currPage,
    pagination.rowsPerPage,
    filter_object,
    sortModel,
    dataset,
  ]);

  return (
    <div style={{ height: "100%" }}>
      <Table
        state={{
          pageType: "voyage",
          dataList,
          isLoading,
          checkbox: false,
          default_list: voyage_default_list,
          variables_tree,
          options_flat,
          // pagination
          pagination,
          setPagination,
          // sorting
          sortModel,
          setSortModel,
          // filter object
          filter_object,
          setDrawerOpen,
        }}
      />
    </div>
  );
}
