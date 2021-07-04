import ComponentIcon from "./icons/component.svg";
import FailureIcon from "./icons/failures.svg";
import ModeIcon from "./icons/modes.svg";
import SearchIcon from "./icons/magnifying.svg";
import PlusIcon from "./icons/plus.svg";
import ArrowUp from "./icons/arrowup.svg";
import ArrowDown from "./icons/arrowdown.svg";

export function getDisplayName(menuItem) {
    switch (menuItem) {
        case "components":
            return "Components";
        case "failures":
            return "Failures";
        case "modes":
            return "Modes";
    }
}

export function getIcon(name) {
    switch (name) {
        case "components":
            return ComponentIcon;
        case "failures":
            return FailureIcon;
        case "modes":
            return ModeIcon;
        case "search":
            return SearchIcon;
        case "plus":
            return PlusIcon;
        case "UpArrow":
            return ArrowUp;
        case "DownArrow":
            return ArrowDown;
    }
}