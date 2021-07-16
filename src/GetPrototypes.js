import FailsData from './DataStructs/FailsData';
import ComponentsData from './DataStructs/ComponentsData';
import ModesData from './DataStructs/ModesData';

export default function getPrototype(curState) {
    switch (curState) {
    case 'components':
        return new ComponentsData('', '', '', '', '', '');
    case 'failures':
        return new FailsData('', '', '', '', '', '');
    case 'modes':
        return new ModesData('', '', '', '');
    default:
        console.log(`Unknown state for prototype ${curState}`);
    }
    return undefined;
}
