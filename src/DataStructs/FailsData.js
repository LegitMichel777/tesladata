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
        return ['Failed Component', 'Fail Name', 'Fail Code', 'Description'];
    }

    static get rootTypes() {
        return ['component_pkid', 'mode_pkid']; // this is kinda basic for now, add as things go on. built to be extendable
    }

    static get rootDescribe() {
        return ["Failed Component", "Fail Name"];
    }

    static get getIds() {
        return ['failedcomponent', 'failname', 'code', 'reason'];
    }

    static get types() {
        return ['string', 'string', 'string', 'string'];
    }

    getData() {
        return [this.failComponentName, this.failModeName, this.failCode, this.failDescription];
    }
}
