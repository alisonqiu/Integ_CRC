export default function hierFalse2True(props) {
    
    var hierTrue = {}

    function addToDict(array) {
        var temp;
        for (let i = 0; i<array.length; i++) {
            if (i === 0) {
                temp = hierTrue
                if (i === array.length-1 ) {
                    temp[array[i]] = null
                }
                else if ((array[i] in temp) === false) {
                    temp[array[i]] = {}
                }
                temp = hierTrue[array[i]]
                // console.log(hierTrue)
            }
            else if (i === array.length-1) {
                // console.log(array[i])
                if ((array[i] in temp) === false) {
                    temp[array[i]] = null
                }
                // console.log(hierTrue)
            }
            else {
                if ((array[i] in temp) === false) {
                    temp[array[i]] = {}  
                }
                temp = temp[array[i]]
                // console.log(temp)
            }
        }
        // console.log(hierTrue);
    }

    function buildHier(props) {
        props.forEach((oneLine) => { let parsedArray = []; parsedArray = oneLine.split('__'); addToDict(parsedArray)});
        // for (let i=0; i<props.length;i++) {
        //     let parsedArray = props[i].split('__')
        //     addToDict(parsedArray)
        // }

        return (hierTrue);
    }

    return buildHier(props)
}