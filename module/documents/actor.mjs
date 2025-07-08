import StandardCheck from "../dice/standard-check.mjs";
export default class WilderfeastActor extends Actor {
  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    // Player character configuration
    if (this.type === "wilder") {
      const prototypeToken = {
        vision: true,
        actorLink: true,
        disposition: 1, // Friendly
      };
      //      this.updateSource({ prototypeToken });
      this.updateSource({
        "prototypeToken.vision": true,
        "prototypeToken.actorLink": true,
        "prototypeToken.disposition": 1, // Friendly
      });
    }
  }
  async _onCreate(data, options, user) {
    // Player character configuration

    return await super._onCreate(data, options, user);
  }

  /** @override */
  async prepareBaseData() {
    await super.prepareBaseData();
  }

  get isUnlocked() {
    if (this.getFlag(game.system.id, "SheetUnlocked")) return true;
    return false;
  }

  get sheetlight() {
    if (this.getFlag(game.system.id, "sheetlight")) return true;
    return false;
  }

  /**
   * Action roll
   * @param {string} skill
   * @param {string} style
   * @returns {Promise<StandardCheck>} - A promise that resolves to the rolled check.
   */
  async rollAction(compData) {
    //{group1: group, field1:field, askDialog:true});
    // Prepare check data
    compData.actorId = this.id;
    compData.actorData = this.system;
    compData.doRoll = true;

    // Create the check roll
    let sc = new StandardCheck(compData);
    if (compData.askDialog) {
      // Prompt the user with a roll dialog
      const flavor = compData.flavor ?? game.i18n.format("WILDERFEAST.DIALOG.flavor");
      const title = compData.title ?? game.i18n.format("WILDERFEAST.DIALOG.flavor");
      const response = await sc.dialog({ title, flavor });
      if (response === null) return null;
    }

    // Execute the roll to chat
    await sc.toMessage();
    return sc;
  }

  /*Show portrait */
  async showPortrait(options = {}) {
    let htmlTemplate = `
    <h3>Portrait</h3>`;
    new Dialog({
      title: "Portrait",
      content: htmlTemplate,
      buttons: {
        validate: {
          label: game.i18n.format("WILDERFEAST.DIALOG.portrait", { actorName: this.name }),
          callback: () => {
            let print = new ImagePopout(this.img, {
              title: this.name,
              shareable: true,
              uuid: this.uuid,
            }).render(true);
            print.shareImage();
          },
        },
        close: {
          label: game.i18n.format("WILDERFEAST.DIALOG.cancel"),
        },
      },
    }).render(true);
  }

  /**
   * set to max
   * @param {string} style STYLE to maximize
   */
  async setStyleToMax(style) {
    return await this.update({ [`system.styles.${style}.valeur`]: this.system.styles[style].max });
  }

  /**
   * set to max
   * @param {string} data
   */
  async setToMax(data) {
    if (this.system[data]) {
      const maxValue = this.system[data].max;
      return await this.update({ [`system.${data}.value`]: maxValue });
    }
  }

  async chatMessage(introText, finalText, retracte, flags) {
    const data = {
      data: {
        actorId: this.id,
        actingCharImg: this.img,
        actingCharName: this.name,
        doRoll: false,
        finalText: finalText,
        introText: introText,
        retracte: retracte,
      },
    };
    // Create the chat content
    let content = await foundry.applications.handlebars.renderTemplate("systems/wilderfeast/templates/dice/standard-check-roll.hbs", data);

    // Create the chat data
    const chatData = foundry.utils.duplicate(data);
    chatData.user = game.user.id;
    chatData.content = content;
    chatData.flags = flags;

    /* -------------------------------------------- */
    // Visibilité des jet des PNJs
    if (this.type === "pnj" && game.user.isGM) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
    }

    return await ChatMessage.create(chatData);
  }
}
