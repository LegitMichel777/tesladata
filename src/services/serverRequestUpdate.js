import axios from 'axios';
import * as globals from '../globals';

export default async function serverRequestAdd(toAdd, object) {
    let objectUrlPiece;
    switch (object) {
    case 'components':
        objectUrlPiece = 'components';
        break;
    case 'failures':
        objectUrlPiece = 'mapping';
        break;
    case 'modes':
        objectUrlPiece = 'fail_mode';
        break;
    default:
        console.log(`Server update request called on unrecognized state ${object}`);
    }
    return axios.post(`${globals.rootURL}/${objectUrlPiece}/update`, toAdd);
}
