export default function cleanseInput(x) {
    if (x.length === 0) {
        return x;
    }
    let rturn = x;
    if (rturn[0] === ' ') {
        rturn = rturn.substring(1);
    }
    if (rturn.length === 0) {
        return rturn;
    }
    if (rturn[rturn.length - 1] === ' ') {
        rturn = rturn.substring(0, rturn.length - 1);
    }
    return rturn;
}
