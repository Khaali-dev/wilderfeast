export default class WilderfeastActorSheet extends foundry.appv1.sheets.ActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    const options = super.defaultOptions;
    return Object.assign(options, {
      classes: [SYSTEM.id, "sheet", "actor", this.actorType],
      template: `systems/${SYSTEM.id}/templates/sheets/${this.actorType}.hbs`,
      resizable: true,
      scrollY: [],
      width: 850,
      height: 800,
      tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "competences" }],
    });
  }

  /** @override */
  async getData(options) {
    const context = {};
    context.editable = true;
    context.actor = this.document;
    context.system = this.document.system;


    context.descriptionHTML = await TextEditor.enrichHTML(this.actor.system.description, { async: false });
    context.equipementHTML = await TextEditor.enrichHTML(this.actor.system.equipement, { async: false });
    context.unlocked = this.actor.isUnlocked;
    context.locked = !this.actor.isUnlocked;
    return context;
  }

  /* Context menu standard*/
  _getStdContextOptions() {
    return [
      {
        name: game.i18n.localize("WILDERFEAST.TOOLTIP.show"),
        icon: `<i class="fa-regular fa-image-portrait"></i>`,
        condition: (li) => {
          return li.data("group") === "portrait";
        },
        callback: (li) => {
          return this.actor.showPortrait();
        },
      },
      {
        name: `Jet d'Iniative`,
        icon: `<i class="fa-solid fa-hourglass-start"></i>`,
        condition: (li) => {
          return li.data("group") === "init";
        },
        callback: (li) => {
          return this.actor.rollInit();
        },
      },
      {
        name: game.i18n.localize("WILDERFEAST.DIALOG.flavor"),
        icon: `<i class="fa-solid fa-dice-d6"></i>`,
        condition: (li) => {
          return ["skills", "styles"].includes(li.data("group"));
        },
        callback: async (li) => {
          const sname = li.data("sname");
          const group = li.data("group");
          let data = {
            askDialog: true
          };
          if (group === "skills") {
            data.skill = sname;
          } else if (group === "styles") {
            data.style = sname;
          }
          return this.actor.rollAction(data);
        },
      },
      {
        name: game.i18n.localize("WILDERFEAST.TOOLTIP.set_max"),
        icon: `<i class="fa-solid fa-gauge-max"></i>`,
        condition: (li) => {
          return ["durability", "stamina"].includes(li.data("group"));
        },
        callback: async (li) => {
          const group = li.data("group");
          return this.actor.setToMax(group);
        },
      },
    ];
  }
  /**
   * Retourne les context options des embedded items
   * @returns {object[]}
   * @private
   */
  _getItemEntryContextOptions() {
    return [
      {
        name: game.i18n.localize("WILDERFEAST.TOOLTIP.open"),
        icon: `<i class="fa-regular fa-cogs"></i>`,
        condition: true,
        callback: (li) => {
          const itemId = li.data("itemId");
          this._ouvrirItem(itemId);
        },
      },
      {
        name: game.i18n.localize("WILDERFEAST.TOOLTIP.remove"),
        icon: `<i class="fa-solid fa-trash"></i>`,
        condition: true,
        callback: (li) => {
          const itemId = li.data("itemId");
          this._supprimerItem(itemId);
        },
      },
    ];
  }
  
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // edit parts durability
    html.find(".inline-edit").change(this._onEmbeddedItemEdit.bind(this));

    // Lock/Unlock characyter sheet
    html.find(".change-lock").click(this._onSheetChangelock.bind(this));

    // Activate context menu
    this._contextMenu(html);
  }

  /** @inheritdoc */
  _contextMenu(html) {
    foundry.applications.ux.ContextMenu.create(this, html, ".item-contextmenu", this._getItemEntryContextOptions());
    foundry.applications.ux.ContextMenu.create(this, html, ".std-contextmenu", this._getStdContextOptions());
  }

  /**
   * Manage the lock/unlock button on the sheet
   *
   * @name _onSheetChangelock
   * @param {*} event
   */
  async _onSheetChangelock(event) {
    event.preventDefault();

    let flagData = await this.actor.getFlag(game.system.id, "SheetUnlocked");
    if (flagData) await this.actor.unsetFlag(game.system.id, "SheetUnlocked");
    else await this.actor.setFlag(game.system.id, "SheetUnlocked", "SheetUnlocked");
    this.actor.sheet.render(true);
  }

  /**
   * Event handlers
   * @param {Event} event - The click event.
   */

  _ouvrirItem(itemId) {
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  async _supprimerItem(itemId) {
    let item = this.actor.items.get(itemId);
    if (item === null) {
      return;
    }
    let flagData = await this.actor.getFlag(game.system.id, itemId);
    if (flagData) await this.actor.unsetFlag(game.system.id, itemId);
    await this.actor.deleteEmbeddedDocuments("Item", [item.id], { render: true });
  }
  
  _onEmbeddedItemEdit(event) {
    event.preventDefault();
    const itemId = $(event.currentTarget).parents(".item").data("itemId");
    let item = this.actor.items.get(itemId);

    const element = event.currentTarget;
    let field = element.dataset.field;
    console.log()
    let newValue;
    if (element.type === "checkbox") newValue = element.checked;
    else if (element.type === "number") newValue = element.valueAsNumber;
    else newValue = element.value;
    return item.update({ [field]: newValue });
  }

}
