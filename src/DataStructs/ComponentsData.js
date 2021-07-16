export default class ComponentsData {
    constructor(dbid, productname, id, manufacturer, contact, failrate) {
        this.dbid = dbid;
        this.productname = productname;
        this.id = id;
        this.manufacturer = manufacturer;
        this.contact = contact;
        this.failrate = failrate;

        this.describe = ['Product Name', 'ID', 'Manufacturer', 'Contact', 'Fail Rate'];
        this.getIds = ['productname', 'id', 'manufacturer', 'contact', 'failrate'];
    }

    getData() {
        return [this.productname, this.id, this.manufacturer, this.contact, this.failrate];
    }
}
