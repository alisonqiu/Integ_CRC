import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";


export default function AreaSelect(props) {
  const map = useMap();

  useEffect(()=>{
    if(props.selectMode){
      map.selectArea.setControlKey();
    }
    else{
      map.selectArea.setControlKey(17);
    }
  },[props.selectMode]);

  useEffect(() => {
    if (!map.selectArea) return;

    map.selectArea.enable();

    let drawbox = L.rectangle(props.latlong, { color: "blue", weight: 5, fillOpacity:0.0 })
    map.on("areaselected", (e) => {
      //console.log(e.bounds.toBBoxString()); // lon, lat, lon, lat
      //console.log(e.bounds);
      let box=e.bounds.toBBoxString().split(",");
      props.onChangelongitude1(parseFloat(box[0]));
      props.onChangelongitude2(parseFloat(box[2]));
      props.onChangelatitude1(parseFloat(box[1]));
      props.onChangelatitude2(parseFloat(box[3]));
      drawbox.remove();
      drawbox.setBounds(e.bounds);
      props.setlatlong(e.bounds);
      drawbox.addTo(map);
      props.SetselectMode(false);
    });

    // You can restrict selection area like this:
    const bounds = map.getBounds().pad(-0.25); // save current map bounds as restriction area
    // check restricted area on start and move
    map.selectArea.setValidate((layerPoint) => {
      return bounds.contains(this._map.layerPointToLatLng(layerPoint));
    });

    // now switch it off
    map.selectArea.setValidate();
    
  }, [map, props]);

  return null;
}

