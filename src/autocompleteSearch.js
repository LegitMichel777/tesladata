import dataSearch from './dataSearch';

export default function autocompleteSearch(state, key) {
    let columnName;
    let rawData;
    switch (state) {
    case 'components':
        columnName='productname';
        rawData = this.rawComponentsData;
        break;
    case 'modes':
        columnName='name';
        rawData = this.rawModesData;
        break;
    default:
        console.log(`Fetching default search column name for unknown state ${state}`);
        return [];
    }
    let searchResults = dataSearch(rawData, columnName, key);
    switch (state) {
    case 'components':
        searchResults.sort((a, b) => {
            if (a.data.productname > b.data.productname) {
                return 1;
            }
            if (a.data.productname < b.data.productname) {
                return -1;
            }
            if (a.data.manufacturer > b.data.manufacturer) {
                return 1;
            }
            return -1;
        });
        break;
    case 'modes':
        searchResults.sort((a, b) => {
            if (a.data.failname > b.data.failname) {
                return 1;
            }
            if (a.data.failname < b.data.failname) {
                return -1;
            }
            if (a.data.code > b.data.code) {
                return 1;
            }
            return -1;
        });
        break;
    default:
    }
    return searchResults;
}
