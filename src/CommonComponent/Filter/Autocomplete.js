import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const header = { "Authorization": process.env.REACT_APP_AUTHTOKEN }
const base_url = process.env.REACT_APP_BASEURL;

export default function Auto(props) {

    const { filter_obj, set_filter_obj, key, pageType } = props.state;

    const [value, setValue] = React.useState([]);
    const [textInput, setTestInput] = React.useState("");
    const [autocompleteOptions, setautocompleteOptions] = React.useState([]);

    const endpoint = (() => {
        switch (pageType) {
            case "enslaved":
                return "past/enslaved/"
            case "enslaver":
                return "past/enslavers/"
            default:
                return "voyage/"
        }
    })()
    console.log("🚀 ~ file: Autocomplete.js ~ line 26 ~ endpoint ~ endpoint", endpoint)

    console.log("Page Type:", pageType)

    React.useEffect(() => {
        const fetchData = async (key, textInput) => {           // not sure how to put in key (originally labels)
            var formdata = new FormData();
            formdata.append(key, textInput);


            var requestOptions = {
                method: 'POST',
                headers: header,
                body: formdata,
                redirect: 'follow'
            };


            fetch(base_url + endpoint + "autocomplete", requestOptions)
                .then(response => response.json())
                .then(result => {
                    var newOptions = result['results'][0]
                    setautocompleteOptions(newOptions)
                })
        }

        fetchData(key, textInput).catch(console.error)
    }, [filter_obj, textInput])


    return (
        <Autocomplete
            disablePortal
            autoHighlight
            multiple
            options={autocompleteOptions}
            value={filter_obj[key] ? filter_obj[key] : autocompleteOptions[0]}
            // isOptionEqualToValue={() => true}
            onChange={(event, newValue) => {

                set_filter_obj(filter_obj => ({                     
                    ...filter_obj,
                    [key]: newValue
                }))
                // setPage(0)
            }}

            renderInput={(params) => {

                setTestInput(params.inputProps.value)
                return <TextField {...params} label="field" />

            }}
        />
    );
}