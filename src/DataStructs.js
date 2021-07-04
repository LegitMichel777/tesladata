export class componentsData {
    constructor(dbid, productname, id, manufacturer, contact, failrate) {
        this.dbid = dbid;
        this.productname = productname;
        this.id = id;
        this.manufacturer = manufacturer;
        this.contact = contact;
        this.failrate = failrate;
    }
    describe() {
        return ["Product Name", "ID", "Manufacturer", "Contact", "Fail Rate"];
    }
    getIds() {
        return ["productname", "id", "manufacturer", "contact", "failrate"];
    }
    getData() {
        return [this.productname, this.id, this.manufacturer, this.contact, this.failrate];
    }
}

export class failsData {
    constructor(dbid, failComponentId, failComponentName, failModeId, failModeName, failCode) {
        this.dbid=dbid;
        this.failComponentId=failComponentId;
        this.failComponentName=failComponentName;
        this.failModeId=failModeId;
        this.failModeName=failModeName;
        this.failCode=failCode;
    }

    describe() {
        return ["Code", "Failed Component", "Reason"];
    }
    getIds() {
        return ["code", "failedcomponent", "reason"];
    }
    getData() {
        return [this.failCode, this.failComponentName, this.failModeName];
    }
}

export class modesData {
    constructor(dbid, failname, code, id) {
        this.dbid=dbid;
        this.failname=failname;
        this.code=code;
        this.id=id;
    }
    describe() {
        return ["Name", "Code", "ID"];
    }
    getIds() {
        return ['name','code','id'];
    }
    getData() {
        return [this.failname, this.code, this.id];
    }
}