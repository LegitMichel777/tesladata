export default class FailsData {
    constructor(dbid, failComponentId, failComponentName, failModeId, failModeName, failCode, failDescription) {
        this.dbid = dbid;
        this.failComponentId = failComponentId;
        this.failComponentName = failComponentName;
        this.failModeId = failModeId;
        this.failModeName = failModeName;
        this.failCode = failCode;
        this.failDescription = failDescription;
    }

    static get describe() {
        return ['Fail Code', 'Fail Name', 'Failed Component', 'Description'];
    }

    static get rootTypes() {
        return ['component_pkid', 'mode_pkid']; // this is kinda basic for now, add as things go on. built to be extendable
    }

    static get rootDescribe() {
        return ["Failed Product", "Fail Name"];
    }

    static get getIds() {
        return ['code', 'failname', 'failedcomponent', 'reason'];
    }

    static get types() {
        return ['string', 'string', 'string', 'string'];
    }

    getData() {
        return [this.failCode, this.failModeName, this.failComponentName, this.failDescription];
    }
}
