export default class ModesData {
    constructor(dbid, failname, code, id) {
        this.dbid = dbid;
        this.failname = failname;
        this.code = code;
        this.id = id;

        this.describe = ['Fail Name', 'Fail Code', 'ID'];
        this.getIds = ['name', 'code', 'id'];
    }

    getData() {
        return [this.failname, this.code, this.id];
    }
}
