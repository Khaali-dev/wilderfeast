import WilderfeastActorSheet from "./actor.mjs";

/**
 * Represents a character sheet for a player character (PJ).
 * Extends the wilderfeastActorSheet class.
 */
export default class WilderSheet extends WilderfeastActorSheet {
  /**
   * The type of actor that this sheet displays.
   * @type {string}
   */
  static actorType = "wilder";

  /** @override */
  async getData(options) {
    const context = await super.getData(options);
    context.techniques = this.actor.items.filter((item) => item.type == "technique");
    context.traits = this.actor.items.filter((item) => item.type == "trait");
    for (let element of context.techniques) {
      element.system.descriptionhtml = await TextEditor.enrichHTML(element.system.description, { async: false });
    }
    for (let element of context.traits) {
      element.system.descriptionhtml = await TextEditor.enrichHTML(element.system.description, { async: false });
    }
    return context;
  }
}
