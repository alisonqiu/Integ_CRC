import * as React from "react";
import {useContext, useEffect, useMemo, useState} from "react";
import {CircularProgress} from "@mui/material";
import Graph from "react-graph-vis";
import _ from 'lodash';
import {useWindowSize} from "@react-hook/window-size";
import VoyageModal from "../../CommonComponent/VoyageModal";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;


export default function Network(props) {
  const {selectedData, width, height} = props.state
  const [graph, setGraph] = useState(null);
  const [myQueryData, setMyQueryData] = useState({...selectedData});
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [voyageOpen, setVoyageOpen] = useState(false);
  const [voyageId, setvoyageId] = useState(0);
  // const endpoint = useMemo(() => {
  //   switch (myQueryData.type) {
  //     case "enslaved":
  //       return "past/enslaved/"
  //     case "enslaver":
  //       return "past/enslavers/"
  //   }
  // }, [myQueryData.type])
  // const targets = useMemo(() => {
  //   switch (myQueryData.type) {
  //     case "enslaved":
  //       return myQueryData.enslaved
  //     case "enslaver":
  //       return myQueryData.enslaver
  //   }
  // }, [myQueryData])
  useEffect(() => {
    // console.log("myQueryData", myQueryData)
    setIsLoading(true)
    const endpoint = (() => {
        switch (myQueryData.type) {
          case "enslaved":
            return "past/enslaved/"
          case "enslaver":
            return "past/enslavers/"
        }
      })()
    const targets = (() => {
        switch (myQueryData.type) {
          case "enslaved":
            return myQueryData.enslaved
          case "enslaver":
            return myQueryData.enslaver
        }
      })()

    const fetchData = async () => {
      // console.log("targets", targets)
      const promises = targets.map(target => {
        let selected = new FormData();
        selected.append("id", target.toString());
        selected.append("id", target.toString());
        return fetch(base_url + endpoint, {
          method: "POST",
          body: selected,
          headers: {'Authorization': auth_token}
        }).then(res => res.json()).then(res => res[0])
      })
      const data = await Promise.all(promises)
      setTitle(data.map((item, index) => index === data.length - 1 ?
        (myQueryData.type === "enslaved"? item.documented_name : item.principal_alias) :
        (myQueryData.type === "enslaved"? item.documented_name : item.principal_alias) + " & "))
      let tmp = {
        nodes: [],
        edges: [],
        addNode: (nodeId, label, type, color) => {
          let existNode = tmp.nodes.find(e => e.id === nodeId)
          if (existNode) {
            existNode.color = color
            existNode.label = label
            existNode.type = type
            return existNode
          } else {
            let newNode = {id: nodeId, label: label, color: color, type: type}
            tmp.nodes.push(newNode)
            return newNode
          }
        },
        link: (fromId, toId, label) => {
          let existLink = tmp.edges.find(edge => edge.id === fromId + "_" + toId || edge.id === toId+"_"+fromId)
          if (existLink) {
            return existLink
          } else {
            let newLink = {from: fromId, to: toId, label: label, id: fromId + "_" + toId}
            tmp.edges.push(newLink)
            return newLink
          }
        }
      };
      // setIsLoading(true)
      //enslavers
      if (myQueryData.type === "enslaver") {
        // console.log("data", data)
        data.forEach((item, index) => {
          //self
          const self = tmp.addNode(item.id, item.principal_alias, "enslaver", "#1ee893")
          self.font = {size: height * 0.03}
          // slaves
          item.alias.forEach((alias) => {
            //transaction
            alias.transactions.slice(0, 30).forEach((transaction) => {
              const transactionData = transaction.transaction
              if (transactionData.relation_type.relation_type === "transportation") {
                tmp.addNode(transactionData.voyage, `Voyage: ${transactionData.voyage}`, "voyage", "#f2f7a6")
                tmp.link(transactionData.voyage, item.id, transaction.role.role)
                //enslaved
                transactionData.enslaved_person.forEach(slave => {
                  tmp.addNode(slave.enslaved.id, slave.enslaved.documented_name, "enslaved", "#ffaca3")
                  tmp.link(slave.enslaved.id, transactionData.voyage, "")
                })
              } else if (transactionData.relation_type.relation_type === "transaction") {
                tmp.addNode(transactionData.id, `transaction: ${transactionData.id}`, "transaction", "#f2f7a6")
                tmp.link(transactionData.id, item.id, transaction.role.role)
                //enslaved
                transactionData.enslaved_person.forEach(slave => {
                  tmp.addNode(slave.enslaved.id, slave.enslaved.documented_name, "enslaved", "#ffaca3")
                  tmp.link(slave.enslaved.id, transactionData.id, "")
                })
              }
            })
          })
        })
        setGraph(tmp)
        setIsLoading(false)
        // console.log("tmp", tmp)
        return;
      }

      //slave
      data.forEach((item, index) => {
        //self
        const self = tmp.addNode(item.id, item.documented_name, "enslaved", "#ffaca3")
        self.font = {size: height * 0.03}
        //transaction
        item.transactions.forEach((transaction) => {
          const transactionData = transaction.transaction
          if (transactionData.relation_type.relation_type === "transportation") {
            tmp.addNode(transactionData.voyage.id, `Voyage: ${transactionData.voyage.id}`, "voyage", "#f2f7a6")
            tmp.link(item.id, transactionData.voyage.id, `from ${_.get(transactionData, ["voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "name"], "No Data")} 
        to ${_.get(transactionData, ["voyage", "voyage_itinerary", "imp_principal_port_slave_dis", "geo_location", "name"], "No Data")} 
        at ${_.get(transactionData, ["voyage", "voyage_dates", "imp_arrival_at_port_of_dis"], "No Data")}`)
            //peer
            transactionData.enslaved_person.forEach((peer) => {
              if(peer.id !== item.id) {
                tmp.addNode(peer.id, peer.enslaved.documented_name, "enslaved", "#ffaca3")
                tmp.link(transactionData.voyage.id, peer.id, "peer")
              }
            })
            //enslaver
            const enslavers = _.get(transactionData, ["enslavers"])
            if (enslavers) {
              enslavers.forEach((enslaver) => {
                // console.log("enslaver", enslaver.enslaver_alias.id)
                tmp.addNode(enslaver.enslaver_alias.id, enslaver.enslaver_alias.alias, "enslaver", "#1ee893")
                tmp.link(transactionData.voyage.id, enslaver.enslaver_alias.id, enslaver.role.role)
              })
            }
          } else if (transactionData.relation_type.relation_type === "transaction") {
            tmp.addNode(transactionData.id, `transaction: ${transactionData.id}`, "transaction", "#f2f7a6")
            tmp.link(item.id, transactionData.id, `sold in ${_.get(transactionData, ["place", "geo_location", "name"], "No Data")} 
          for ${_.get(transactionData, ["amount"], "No Data")}
          on ${_.get(transactionData, ["date"], "No Data")}`)
            //peer
            transactionData.enslaved_person.forEach((peer) => {
              if(peer.id !== item.id) {
                tmp.addNode(peer.id, peer.enslaved.documented_name, "enslaved", "#ffaca3")
                tmp.link(transactionData.id, peer.id, "peer")
              }
            })
            //enslaver
            const enslavers = _.get(transactionData, ["enslavers"])
            if (enslavers) {
              enslavers.forEach((enslaver) => {
                // console.log("enslaver", enslaver.enslaver_alias.id)
                tmp.addNode(enslaver.enslaver_alias.id, enslaver.enslaver_alias.alias, "enslaver", "#1ee893")
                tmp.link(transactionData.id, enslaver.enslaver_alias.id, enslaver.role.role)
              })
            }
          }
        })
      })
      setGraph(tmp)
      setIsLoading(false)
    }
    fetchData().catch(console.error);
  }, [myQueryData])

  const events = {
    doubleClick: function (event) {
      const {nodes: nodeId} = event;
      // console.log("nodeId" ,nodeId)
      const node = graph.nodes.find(e => e.id === nodeId[0])
      switch (node && node.type) {
        case "enslaved":
          setMyQueryData({
            ...myQueryData,
            type: "enslaved",
            enslaved: nodeId
          })
          break;
        case "enslaver":
          setMyQueryData({
            ...myQueryData,
            type: "enslaver",
            enslaver: nodeId
          })
          break;
      }
    },

    click: function (event) {
      const {nodes: nodeId} = event;
      const node = graph.nodes.find(e => e.id === nodeId[0])
      // console.log("click", node)
      if(node && node.type === "voyage"){
        setVoyageOpen(true)
        setvoyageId(nodeId[0])
      }
    }
  };

  const options = useMemo(()=>{
    return {
      physics: {
        enabled: true,
      },
      height: (0.7*height).toString(),
      width: (0.9*width).toString(),
    }
  }, [width, height])

  return (
    <div>
      <h1>Relation
        between: {title}</h1>
      {isLoading ?
        <CircularProgress/> :
        <Graph
          graph={graph}
          options={options}
          events={events}
        />}
        {voyageOpen && (<VoyageModal context={{ voyageOpen, setVoyageOpen, voyageId }} />)} 
    </div>
  )
}
