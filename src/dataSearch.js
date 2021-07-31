export default function dataSearch(rawData, column, key) {
    if (rawData.length===0) {
        return [];
    }
    let curPrototypeIds = rawData[0].constructor.getIds;
    let searchIndex = -1;
    for (let i=0;i<curPrototypeIds.length;i++) {
        if (curPrototypeIds[i] === column) {
            searchIndex = i;
        }
    }
    if (searchIndex === -1) {
        console.log(`Search error: Couldn't find search column ${column}`);
        return [];
    }
    let searchResult=[];
    for (let i=0;i<rawData.length;i++) {
        const tryMatch = String(rawData[i].getData()[searchIndex]);
        if (tryMatch.indexOf(key) !== -1) {
            searchResult.push({
                index: i,
                data: rawData[i],
            });
        }
    }
    return searchResult;
}
