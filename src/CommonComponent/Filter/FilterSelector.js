import { Button, Grid, Menu } from '@mui/material';
import { TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ArrowRightAlt';
import ChevronRightIcon from '@mui/icons-material/ArrowRightAlt';
import * as React from 'react';
import { MenuItem } from '@mui/material';
import { NestedMenuItem } from '../../Util/NestedMenuItem'

function Cascading(props) {

    const { key, filter_obj, set_filter_obj, variables_tree, options_flat } = props.state
    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    function isChildren(key) {
        if (key) return true
        else return false
    }

    function isLast(node) {
        return node === null
    }

    function containsOnly(node) {
        if (Object.keys(node).length === 1)
            return true;
        return false;
    }

    const handleOptionClick = (key) => {
        handleClose();

        if (key in filter_obj) {
            alert("The variable has been selected.")
        }
        else {
            set_filter_obj({ ...filter_obj, [key]: [] })
        }

    }

    const renderTree = (nodes) => {
        return (
            Object.keys(nodes).map((key) =>
                isChildren(key)
                    ? isLast(nodes[key])
                        ? <MenuItem value={key} key={key} onClick={() => { handleOptionClick(key) }}>
                            {options_flat[key].flatlabel}
                        </MenuItem>
                        : containsOnly(nodes[key])
                            ? renderTree(nodes[key])
                            : <NestedMenuItem
                                key={key}
                                label={options_flat[key].flatlabel}
                                parentMenuOpen={open}
                                onClick={handleClose}
                            >
                                {renderTree(nodes[key])}
                            </NestedMenuItem>
                    : null
            )
        )
    };


    return (
        <Grid item>
            {Object.keys(variables_tree[key]).length > 1 ?
                <TreeView
                    aria-label="option menu"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    <Button
                        variant="text"
                        onClick={handleClick}
                        style={{ maxWidth: '280px', maxHeight: '30px', color: "#fff" }}
                    >
                        {options_flat[key].flatlabel}
                    </Button>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        {renderTree(variables_tree[key])}
                    </Menu>
                </TreeView>
                : 
                <Button
                    variant="text"
                    onClick={() => handleOptionClick(key)}
                    style={{ maxWidth: '280px', maxHeight: '30px', color: "#fff" }}
                >
                    {options_flat[key].flatlabel}
                </Button>
            }
        </Grid>
    );
}

export default Cascading;
