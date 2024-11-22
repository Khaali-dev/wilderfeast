export default class WilderfeastItemSheet extends ItemSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      width: 400,
      height: 500,
      classes: [SYSTEM.id, "sheet", "item", this.itemType],
      template: `systems/${SYSTEM.id}/templates/sheets/${this.itemType}.hbs`,
      resizable: false,
      tabs: [],
      scrollY: []
    });
  }

  /** @override */
  async getData(options) {
    const context = {};

    const isEditable = this.isEditable;
    context.cssClass = isEditable ? "editable" : "locked";
    context.editable = isEditable;

    context.item = this.document;
    context.system = this.document.system;

    return context;
  }
}
