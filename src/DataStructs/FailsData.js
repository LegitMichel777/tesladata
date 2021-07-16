export default class FailsData {
    constructor(dbid, failComponentId, failComponentName, failModeId, failModeName, failCode) {
        this.dbid = dbid;
        this.failComponentId = failComponentId;
        this.failComponentName = failComponentName;
        this.failModeId = failModeId;
        this.failModeName = failModeName;
        this.failCode = failCode;

        this.describe = ['Code', 'Failed Component', 'Reason'];
        this.getIds = ['code', 'failedcomponent', 'reason'];
    }

    getData() {
        return [this.failCode, this.failComponentName, this.failModeName];
    }
}
