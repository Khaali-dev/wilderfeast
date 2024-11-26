import WilderfeastItemSheet from "./item.mjs";

export default class PartSheet extends WilderfeastItemSheet {
  /**
   * Le type d'Item qu'affiche cette Sheet
   * @type {string}
   */
  static itemType = "part";
  
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      height: 600,
      width: 400,
      classes: [SYSTEM.id, "sheet", "item", this.itemType],
      template: `systems/${SYSTEM.id}/templates/sheets/${this.itemType}.hbs`
    });
  }

  /** @override */
  async getData(options) {
    const context = await super.getData(options);
    context.descriptionHTML = await TextEditor.enrichHTML(this.item.system.description, { async: false });
    return context;
  }
}