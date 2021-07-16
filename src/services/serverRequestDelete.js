import axios from 'axios';

export default async function serverRequestDelete(deletePkids, object) {
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
        console.log(`Server delete request called on unrecognized state ${object}`);
        return;
    }
    await axios.post(`http://127.0.0.1:5000/${objectUrlPiece}/delete`, {
        pkids_to_delete: deletePkids,
    });
}
