export default class ModesData {
    constructor(dbid, failname, code, description) {
        this.dbid = dbid;
        this.failname = failname;
        this.code = code;
        this.description = description;
    }

    static get describe() {
        return ['Fail Name', 'Fail Code', 'Description'];
    }

    static get getIds() {
        return ['name', 'code', 'description'];
    }

    static get types() {
        return ['string', 'string', 'string'];
    }

    static get constraints() {
        return [{ canBeEmpty: false }, { canBeEmpty: false }, { canBeEmpty: false }];
    }

    getData() {
        return [this.failname, this.code, this.description];
    }
}
