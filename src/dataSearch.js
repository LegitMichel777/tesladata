export default function dataSearch(rawData, column, key) {
    if (rawData === []) {
        return [];
    }
    console.log(rawData[0]);
    let curPrototypeIds = rawData[0].constructor.getIds;
    let searchIndex = -1;
    for (let i=0;i<curPrototypeIds.length;i++) {
        if (curPrototypeIds[i] === column) {
            searchIndex = i;
        }
    }
    if (searchIndex === -1) {
        return [];
    }
    let searchResult=[];
    for (let i=0;i<rawData.length;i++) {
        const tryMatch = String(rawData[i].getData()[searchIndex]);
        if (key.length > tryMatch.length) {
            continue;
        }
        if (tryMatch.substring(0, key.length) === key) {
            searchResult.push({
                index: i,
                data: rawData[i],
            });
        }
    }
    return searchResult;
}
