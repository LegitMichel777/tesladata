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
        return ['Fail Code', 'Fail Name', 'Failed Component', 'Reason'];
    }

    static get overrideRootDescribe() {
        return ['component_pkid', 'mode_pkid'];
    }

    static get getIds() {
        return ['code', 'failname', 'failedcomponent', 'reason'];
    }

    static get types() {
        return ['string', 'string', 'string', 'string'];
    }

    static get constraints() {
        return [{ canBeEmpty: false }, { canBeEmpty: false }, { canBeEmpty: false }, { canBeEmpty: false }];
    }

    getData() {
        return [this.failCode, this.failModeName, this.failComponentName, this.failDescription];
    }
}
