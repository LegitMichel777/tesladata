export default function rootTypeToState(rootType) {
    switch (rootType) {
    case 'component_pkid':
        return "components";
    case "mode_pkid":
        return "modes";
    default:
        console.log(`State name fetch on unrecognized root type ${rootType}`);
    }
    return null;
}
