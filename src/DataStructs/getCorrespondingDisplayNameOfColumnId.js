export default function getCorrespondingDisplayNameOfColumnId(curPrototype, id) {
    for (let i=0;i<curPrototype.constructor.getIds.length;i++) {
        if (curPrototype.constructor.getIds[i] === id) {
            return curPrototype.constructor.describe[i];
        }
    }
    console.log(`Cannot find id ${id} in prototype ${curPrototype}.`);
    return null;
}
