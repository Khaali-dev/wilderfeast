import { SYSTEM } from "./module/config/system.mjs";
import { registerHandlebarsHelpers } from "./module/helpers.mjs";

globalThis.SYSTEM = SYSTEM;

// Import modules
import * as applications from "./module/applications/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as models from "./module/data/_module.mjs";

Hooks.once("init", async function () {
  console.log(`wilderfeast - system init...`);
  game.system.CONST = SYSTEM;

  CONFIG.Actor.documentClass = documents.WilderfeastActor;
  CONFIG.Actor.dataModels = {
    wilder: models.WilderfeastWilder,
    monster: models.WilderfeastMonster,
  };
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(SYSTEM.id, applications.WilderSheet, { types: ["wilder"], makeDefault: true });
  Actors.registerSheet(SYSTEM.id, applications.MonsterSheet, { types: ["monster"], makeDefault: true });

  // Configuration document Item
  CONFIG.Item.documentClass = documents.WilderfeastItem;
  CONFIG.Item.dataModels = {
    part: models.WilderfeastPart,
    technique: models.WilderfeastTechnique,
    trait: models.WilderfeastTrait,
  };

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(SYSTEM.id, applications.PartSheet, { types: ["part"], makeDefault: true });
  Items.registerSheet(SYSTEM.id, applications.TechniqueSheet, { types: ["technique"], makeDefault: true });
  Items.registerSheet(SYSTEM.id, applications.TraitSheet, { types: ["trait"], makeDefault: true });

  CONFIG.ChatMessage.documentClass = dice.WilderfeastChatMessage;

  // Dice system configuration
  CONFIG.Dice.rolls.push(dice.StandardCheck);

  loadTemplates([
    `systems/${SYSTEM.id}/templates/sheets/partials/actor-description.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/wilder-header.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/actor-skills.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/wilder-tool.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/monster-header.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/partials/monster-parts.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/wilder.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/monster.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/trait.hbs`,
    `systems/${SYSTEM.id}/templates/sheets/technique.hbs`,
  ]);

  //configuration Handlebars
  registerHandlebarsHelpers();

});

Hooks.once("ready", async function () {
  console.log("wilderfeast - system init done");
});

Hooks.once("i18nInit", function () {
  preLocalizeConfig();
});

function preLocalizeConfig() {
  const localizeConfigObject = (obj, keys) => {
    for (let o of Object.values(obj)) {
      for (let k of keys) {
        o[k] = game.i18n.localize(o[k]);
      }
    }
  };

  localizeConfigObject(SYSTEM.SKILLS, ["label"]);
  localizeConfigObject(SYSTEM.STYLES, ["label"]);
}
