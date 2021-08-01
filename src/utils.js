import ComponentIcon from './icons/components.svg';
import FailureIcon from './icons/failures.svg';
import ModeIcon from './icons/modes.svg';
import SearchIcon from './icons/magnifying.svg';
import PlusIcon from './icons/plus.svg';
import ArrowUp from './icons/arrowup.svg';
import ArrowDown from './icons/arrowdown.svg';
import Delete from './icons/delete.svg';
import Edit from './icons/edit.svg';
import Checkmark from './icons/checkmark.svg';
import Xmark from './icons/xmark.svg';
import LeftArrow from './icons/arrowleft.svg';
import RightArrow from './icons/arrowright.svg';

import ComponentIconDark from './icons/components-dark.svg';
import FailureIconDark from './icons/failures-dark.svg';
import ModeIconDark from './icons/modes-dark.svg';
import SearchIconDark from './icons/magnifying-dark.svg';
import PlusIconDark from './icons/plus-dark.svg';
import ArrowUpDark from './icons/arrowup-dark.svg';
import ArrowDownDark from './icons/arrowdown-dark.svg';
import DeleteDark from './icons/delete-dark.svg';
import EditDark from './icons/edit-dark.svg';
import CheckmarkDark from './icons/checkmark-dark.svg';
import XmarkDark from './icons/xmark-dark.svg';
import LeftArrowDark from './icons/arrowleft-dark.svg';
import RightArrowDark from './icons/arrowright-dark.svg';

export function getDisplayName(menuItem) {
    switch (menuItem) {
    case 'components':
        return 'Components';
    case 'failures':
        return 'Mapping';
    case 'modes':
        return 'Fail Modes';
    default:
        console.log(`Get display name called on unrecognized menu item ${menuItem}`);
    }
    return undefined;
}

export function getSingularDisplayName(menuItem) {
    switch (menuItem) {
    case 'components':
        return 'Component';
    case 'failures':
        return 'Mapping';
    case 'modes':
        return 'Fail Mode';
    default:
        console.log(`Get singular display name called on unrecognized menu item ${menuItem}`);
    }
    return undefined;
}

export function getIcon(name) {
    const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    switch (name) {
    case 'components':
        if (isDarkTheme) {
            return ComponentIconDark;
        }
        return ComponentIcon;
    case 'failures':
        if (isDarkTheme) {
            return FailureIconDark;
        }
        return FailureIcon;
    case 'modes':
        if (isDarkTheme) {
            return ModeIconDark;
        }
        return ModeIcon;
    case 'search':
        if (isDarkTheme) {
            return SearchIconDark;
        }
        return SearchIcon;
    case 'plus':
        if (isDarkTheme) {
            return PlusIconDark;
        }
        return PlusIcon;
    case 'UpArrow':
        if (isDarkTheme) {
            return ArrowUpDark;
        }
        return ArrowUp;
    case 'DownArrow':
        if (isDarkTheme) {
            return ArrowDownDark;
        }
        return ArrowDown;
    case 'delete':
        if (isDarkTheme) {
            return DeleteDark;
        }
        return Delete;
    case 'edit':
        if (isDarkTheme) {
            return EditDark;
        }
        return Edit;
    case 'checkmark':
        if (isDarkTheme) {
            return CheckmarkDark;
        }
        return Checkmark;
    case 'xmark':
        if (isDarkTheme) {
            return XmarkDark;
        }
        return Xmark;
    case 'LeftArrow':
        if (isDarkTheme) {
            return LeftArrowDark;
        }
        return LeftArrow;
    case 'RightArrow':
        if (isDarkTheme) {
            return RightArrowDark;
        }
        return RightArrow;
    case '':
        return undefined;
    default:
        console.log(`Requested icon ${name} not found.`);
    }
    return undefined;
}
