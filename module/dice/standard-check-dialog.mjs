import { SYSTEM } from "../config/system.mjs";

/**
 * Prompt the user to perform a Standard Check.
 * @extends {Dialog}
 */
export default class ActionDialog extends Dialog {
  /**
   * A StandardCheck dice instance which organizes the data for this dialog
   * @type {StandardCheck}
   */
  roll = this.options.roll;

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 500,
      height: 300,
      classes: ["wilderfeast", "roll"],
      template: `systems/${SYSTEM.id}/templates/dice/standard-check-dialog.hbs`,
      submitOnChange: true,
      closeOnSubmit: false,
    });
  }

  /** @override */
  async getData(options = {}) {
    const data = this.roll.data;
    const context = await super.getData(options);
    data.skills = SYSTEM.SKILLS;
    data.styles = SYSTEM.STYLES;
    const actingChar = game.actors.get(data.actorId);
    context.rollMode = this.options.rollMode || game.settings.get("core", "rollMode");
    console.log("data : ", data);
    console.log("context : ", context);
    return foundry.utils.mergeObject(context, data);
  }

  /** @override */
  activateListeners(html) {
    html.find('select[class="changefield"]').change(this._onChangeAction.bind(this));
    html.find('input[class="changefield"]').change(this._onChangeAction.bind(this));
    super.activateListeners(html);
  }

  /**
   * Handle execution of one of the dialog roll actions
   * @private
   */
  _onChangeAction(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const newValue = event.currentTarget.value;
    const actionMap = {
      "style-change": () => ({ style: newValue }),
      "skill-change": () => ({ skill: newValue }),
      "rollMode-change": () => ({ rollMode: newValue }),
    };

    if (actionMap[action]) {
      this.roll.initialize(actionMap[action]());
      this.render(false, { height: "auto" });
    }
  }

  /*  Factory Methods                             */

  /** @inheritdoc */
  static async prompt(config = {}) {
    config.callback = this.prototype._onSubmit;
    config.options.jQuery = false;
    config.rejectClose = false;
    return super.prompt(config);
  }

  /**
   * Return dialog submission data as a form data object
   * @param {HTMLElement} html    The rendered dialog HTML
   * @returns {StandardCheck}     The processed StandardCheck instance
   * @private
   */
  _onSubmit(html) {
    const form = html.querySelector("form");
    const fd = new foundry.applications.ux.FormDataExtended(form);
    this.roll.initialize(fd.object);
    return this.roll;
  }
}
