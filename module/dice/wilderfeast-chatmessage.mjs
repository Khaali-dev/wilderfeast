import { SYSTEM } from "../config/system.mjs";

export default class WilderfeastChatMessage extends ChatMessage {
  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async renderHTML(...args) {
    const html = await super.renderHTML();
    this._enrichChatCard(html);

    return html;
  }
  /**
   * Add click events for skill points
   * @param {HTMLElement} html  The chat card markup.
   * @protected
   */
  _enrichChatCard(html) {
    html.querySelectorAll(".addtodice").forEach((el) => el.addEventListener("click", this._onClickAddSkill.bind(this)));
    html.querySelectorAll(".resetbutton").forEach((el) => el.addEventListener("click", this._onClickResetSkill.bind(this)));
  }

  /* -------------------------------------------- */

  /**
   * Add a skill point to a dice result.
   * @param {PointerEvent} event  The triggering event.
   * @protected
   */
  async _onClickAddSkill(event) {
    event.stopPropagation();
    const target = event.currentTarget;
    let skillvalue = this.rolls[0].data.skillvalue;
    let skillvalueUsed = this.rolls[0].data.skillvalueUsed;
    if (skillvalue > skillvalueUsed) {
      let newRoll = foundry.utils.deepClone(this.rolls[0]);
      newRoll.data.skillvalueUsed = skillvalueUsed + 1;

      if (target.dataset.diceNb === "action") {
        newRoll.data.actionDiceResult = newRoll.data.actionDiceResult + 1;
      } else {
        let oldVal = newRoll.data.styleDiceResult[parseInt(target.dataset.diceNb)];
        newRoll.data.styleDiceResult[parseInt(target.dataset.diceNb)] = oldVal + 1;
      }
      newRoll.data.success = newRoll.success;
      await this.update({ rolls: [newRoll] });
    }
  }
  /**
   * Reset skill point distribution.
   * @param {PointerEvent} event  The triggering event.
   * @protected
   */
  async _onClickResetSkill(event) {
    event.stopPropagation();
    const target = event.currentTarget;
    let newRoll = foundry.utils.deepClone(this.rolls[0]);
    await newRoll.setDiceResults();
    await this.update({ rolls: [newRoll] });
  }
}
