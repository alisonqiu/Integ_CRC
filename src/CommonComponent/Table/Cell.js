import React, { useContext } from "react";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { TableContext } from "./Table";

export default function Cell(props) {
  const { row, field } = props;
  // console.log(props)
  const {
    selectedData,
    setSelectedData,
    handleDialogOpen,
    setVoyageOpen,
    setVoyageId,
    setUVOpen,
    setUrl,
  } = useContext(TableContext);

  // check if the string is numeric
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // popover event & open sankey modal in past table
  const handleSankeyOpen = (e, id, variety) => {
    setSelectedData({
      ...selectedData,
      [variety]: id,
      type: variety,
    });
    handleDialogOpen();
    e.stopPropagation();
  };

  // open voyage modal in enslaved table
  const handleVoyageOpen = (event, id) => {
    setVoyageOpen(true);
    setVoyageId(id);
    event.stopPropagation();
  };

  // handle UV modal
  const handleUV = (e, url) => {
    setUrl(url);
    setUVOpen(true);
    e.stopPropagation();
  };

  // create popover for enslaver alias in enslaved table
  const createPopover = (row) => {
    const people = row[
      "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
    ]
      ? row[
          "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
        ].flat(Infinity)
      : [];
    const roles = row["transactions__transaction__enslavers__role__role"]
      ? row["transactions__transaction__enslavers__role__role"].flat(Infinity)
      : [];
    const ids = row[
      "transactions__transaction__enslavers__enslaver_alias__identity__id"
    ]
      ? row[
          "transactions__transaction__enslavers__enslaver_alias__identity__id"
        ].flat(Infinity)
      : [];
    const output = {};
    for (let i = 0; i < people.length; i++) {
      if (!(people[i] in output)) {
        output[people[i]] = { roles: [], id: 0 };
      }
      output[people[i]]["roles"].push(roles[i]);
      output[people[i]]["id"] = ids[i];
    }
    return output;
  };

  // gender cell
  function genderCell(gender) {
    if (isNumeric(gender)) {
      return gender === 1 ? "Male" : "Female";
    }
    return gender;
  }

  // alias cell
  function aliasCell(row) {
    const popover = createPopover(row);
    return (
      <Stack direction="row" spacing={1}>
        {Object.keys(popover).map((name, key) => (
          <Tooltip
            key={"tooltip-" + key}
            arrow
            title={popover[name]["roles"].join(", ")}
            placement="top"
          >
            <Chip
              label={name}
              onClick={(e) =>
                handleSankeyOpen(e, [popover[name]["id"]], "enslaver")
              }
            />
          </Tooltip>
        ))}
      </Stack>
    );
  }

  // voyage id cell
  function voyageIdCell(ids) {
    return (
      <div
        style={{ color: "blue" }}
        onClick={(e) => {
          handleVoyageOpen(e, ids[0]);
        }}
      >
        <u>{[...new Set(ids)].filter((n) => n != null).join(", ")}</u>
      </div>
    );
  }

  // object cell
  function objectCell(obj) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: [...new Set([].concat.apply([], obj))].join(", "),
          // .replaceAll("</p>,<p>", "</p><p>"),
        }}
      />
    );
  }

  // number enslaved cell
  function numberEnslavedCell(row) {
    return isNumeric(row.number_enslaved) &&
      <Chip label={row.number_enslaved}
        onClick={(e)=>handleSankeyOpen(e, [row.id], "enslaver")}/>

    //   Number(row.number_enslaved) <= 30 ? (
    //   <div
    //     style={{ color: "blue" }}
    //     onClick={(e) =>
    //       handleSankeyOpen(
    //         e,
    //         [
    //           ...new Set(
    //             row[
    //               "alias__transactions__transaction__enslaved_person__enslaved__id"
    //             ].flat(Infinity)
    //           ),
    //         ],
    //         "enslaved"
    //       )
    //     }
    //   >
    //     <u>{row.number_enslaved}</u>
    //   </div>
    // ) : (
    //   row.number_enslaved
    // );
  }

  // text ref cell
  function textRefCell(row) {
    return Object.values(row["voyage_sourceconnection"]).map(
      (element, ref_key) => {
        if (element["doc"] != null) {
          return (
            <div
              style={{
                color: "#f21b42",
              }}
              onClick={(e) => handleUV(e, element["doc"]["url"])}
            >
              <u>{element["text_ref"]}</u>
            </div>
          );
        } else {
          return element["text_ref"];
        }
      }
    );
  }

  if (field === "gender") {
    // enslaved
    return genderCell(row[field]);
  } else if (
    field ===
    "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
  ) {
    // enslaved
    return aliasCell(row);
  } else if (field === "transactions__transaction__voyage__id") {
    // enslaved
    return voyageIdCell(row[field]);
  } else if (field === "number_enslaved") {
    // enslaver
    return numberEnslavedCell(row);
  } else if (field === "voyage_sourceconnection__text_ref") {
    // voyage
    return textRefCell(row);
  } else if (typeof row[field] === "object") {
    return objectCell(row[field]);
  } else {
    return row[field];
  }
}
