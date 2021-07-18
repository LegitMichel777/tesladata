export default class ComponentsData {
    constructor(dbid, productname, manufacturer, contact, failrate) {
        this.dbid = dbid;
        this.productname = productname;
        this.manufacturer = manufacturer;
        this.contact = contact;
        this.failrate = failrate;
    }

    static get describe() {
        return ['Product Name', 'Manufacturer', 'Contact', 'Fail Rate'];
    }

    static get getIds() {
        return ['productname', 'manufacturer', 'contact', 'failrate'];
    }

    static get types() {
        return ['string', 'string', 'string', 'number'];
    }

    static get constraints() {
        return [{ canBeEmpty: false }, { canBeEmpty: false }, { canBeEmpty: false }, {
            moreThan: 0,
            lessThanOrEqualTo: 100,
            canBeEmpty: false,
        }];
    }

    getData() {
        return [this.productname, this.manufacturer, this.contact, this.failrate];
    }
}
