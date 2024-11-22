import { SYSTEM } from "../config/system.mjs";
import StandardCheckDialog from "./standard-check-dialog.mjs";

/**
 * @typedef {DiceCheckBonuses} StandardCheckData
 * @property {string} actorId                         L'ID de l'acteur a l'origine du jet
 * @property {Object} actorData                       Le contenu de system de l'acteur
 */

/**
 * The standard (qualite)d6 dice pool check used by the system.
 *
 * @param {string|StandardCheckData} formula  This parameter is ignored
 * @param {StandardCheckData} [data]          An object of roll data, containing the following optional fields
 */
export default class StandardCheck extends Roll {
  constructor(formula, data) {
    if (typeof formula === "object") {
      data = formula;
      formula = "";
    }
    super(formula, data);
  }

  /**
   * Define the default data attributes for this type of Roll
   * @type {object}
   */
  static defaultData = {
    actionDiceResult: 0,
    actionDice: "fas fa-dice-d8",
    actorId: null,
    actorData: null,
    goWild: false,
    actingCharImg: null,
    actingCharName: null,
    doRoll: true,
    introText: "",
    finalText: "",
    isWilder: true,
    lasttextsuccess: null,
    lasttext: "",
    showlasttext: false,
    style: "mighty",
    styleLabel: "",
    stylevalue: 0,
    styleDiceNb: 0,
    styleDiceResult: [],
    skill: "assurance",
    skillLabel: "",
    skillvalue: 0,
    skillvalueUsed: 0,
    success: 0,
    advantage: "neutral",
    advantagelb: "WILDERFEAST.DIALOG.neutral",
    choices_adv: { advantage: "WILDERFEAST.DIALOG.advantage", neutral: "WILDERFEAST.DIALOG.neutral", disadvantage: "WILDERFEAST.DIALOG.disadvantage" },
    groupName_adv: "advantage",
  };

  /**
   * Which Dialog subclass should display a prompt for this Roll type?
   * @type {StandardCheckDialog}
   */
  static dialogClass = StandardCheckDialog;

  /**
   * The HTML template path used to render dice checks of this type
   * @type {string}
   */
  static htmlTemplate = "systems/wilderfeast/templates/dice/standard-check-roll.hbs";

  /* -------------------------------------------- */
  /*  Roll Configuration                          */
  /* -------------------------------------------- */

  /** @override */
  _prepareData(data = {}) {
    const current = this.data || foundry.utils.deepClone(this.constructor.defaultData);
    for (let [k, v] of Object.entries(data)) {
      if (v === undefined) delete data[k];
    }
    data = foundry.utils.mergeObject(current, data, { insertKeys: false });
    StandardCheck.#configureData(data);
    return data;
  }

  /**
   * Configure the provided data used to customize this type of Roll
   * @param {object} data     The initially provided data object
   * @returns {object}        The configured data object
   */
  static async #configureData(data) {
    const actingChar = game.actors.get(data.actorId);

    if (data.skill.length) {
      data.skillvalue = actingChar.system.skills[data.skill].value;
      data.skillLabel = "WILDERFEAST.SKILLS." + data.skill + ".label";
    } else {
      data.skillvalue = 0;
    }
    if (data.style.length) {
      data.stylevalue = actingChar.system.styles[data.style].value;
      data.styleLabel = "WILDERFEAST.STYLES." + data.style + ".label";
    } else data.stylevalue = 0;
    data.actingCharImg = actingChar.img;
    data.actingCharName = actingChar.name;
    data.isWilder = actingChar.type === "wilder";
    data.introText = game.i18n.format(`WILDERFEAST.CHATMESSAGE.StdActionIntro`, {
      skill: data.skillLabel,
      style: data.styleLabel,
    });
  }
  /** @override */
  static parse(_, data) {
    // Construct the formula
    data.styleDiceNb = data.goWild ? data.stylevalue - 1 : data.stylevalue;
    const actionDie = data.goWild || !data.isWilder ? "1d20[red]" : "1d8[green]";
    let formula = actionDie + "+" + data.styleDiceNb + "d6[white]";
    data.diceformula = formula;
    return super.parse(formula, data);
  }

  async render(chatOptions = {}) {
    if (chatOptions.isPrivate) return "";
    return renderTemplate(this.constructor.htmlTemplate, this._getChatCardData());
  }

  /**
   * Prepare the data object used to render the StandardCheck object to an HTML template
   * @returns {object}      A prepared context object that is used to render the HTML template
   * @private
   */
  _getChatCardData() {
    const cardData = {
      css: [SYSTEM.id, "standard-check"],
      data: this.data,
      isGM: game.user.isGM,
      formula: this.formula,
      total: this.total,
      rolleddice: this._total,
      skillvalueLeft: this.data.skillvalue - this.data.skillvalueUsed,
    };

    cardData.cssClass = cardData.css.join(" ");
    return cardData;
  }

  /**
   * Used to re-initialize the pool with different data
   * @param {object} data
   */
  initialize(data) {
    this.data = this._prepareData(data);
    this.terms = this.constructor.parse("", this.data);
  }

  /**
   * Present a Dialog instance for this pool
   * @param {string} title      The title of the roll request
   * @param {string} flavor     Any flavor text attached to the roll
   * @param {string} rollMode   The requested roll mode
   * @returns {Promise<StandardCheck|null>}   The resolved check, or null if the dialog was closed
   */
  async dialog({ title, flavor, rollMode } = {}) {
    console.log("dialog : ", this);
    const options = { title, flavor, rollMode, roll: this };
    return this.constructor.dialogClass.prompt({ title, options });
  }

  /** @inheritdoc */
  toJSON() {
    const data = super.toJSON();
    data.data = foundry.utils.deepClone(this.data);
    return data;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async toMessage(messageData, options = {}) {
    const actingChar = game.actors.get(this.data.actorId);

    // par defaut la visibilité est indiquée par le chat
    options.rollMode = game.settings.get("core", "rollMode");
    /* -------------------------------------------- */
    // Visibilité des jet des PNJs
    if (actingChar.type === "monster" && game.user.isGM) {
      options.rollMode = "gmroll";
    }
    return super.toMessage(messageData, options);
  }

  /** @override */
  async evaluate(allowInteractive) {
    await super.evaluate(allowInteractive);
    await this.setDiceResults();
    if (this.data.goWild) this.data.actionDice = "fas fa-dice-d20";
    this.data.advantagelb = "WILDERFEAST.DIALOG." + this.data.advantage;

    return this;
  }

  //** Set or reset the dice values showed in the chat with the values actually rolled**/
  async setDiceResults() {
    this.data.actionDiceResult = this.dice[0].results[0].result;
    this.data.styleDiceResult = [];
    const iterator = this.dice.keys();
    for (let res of this.dice[1].results) {
      this.data.styleDiceResult.push(res.result);
    }
    this.data.skillvalueUsed = 0;
    this.data.success = this.success;
  }

  get success() {
    let success = 0;
    let difficulty = 4;
    if (this.data.advantage === "advantage") difficulty = 3;
    else if (this.data.advantage === "disadvantage") difficulty = 5;
    for (let res of this.data.styleDiceResult) {
      if (res > difficulty) success += 1;
    }
    return success;
  }
}
