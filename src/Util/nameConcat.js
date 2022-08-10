
export default function nameConcat(first, second) {
    if (first === "") {
        return second;
    }
    else {
        return first+"__"+second;
    }
}