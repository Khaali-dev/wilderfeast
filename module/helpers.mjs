import { SYSTEM } from "./config/system.mjs";

export const registerHandlebarsHelpers = function () {
  Handlebars.registerHelper("getSystemProperty", function (actor, group, nom_id, prop) {
    return actor.system[group][nom_id][prop];
  });
  Handlebars.registerHelper("getLabel", function (group, nom_id) {
    return SYSTEM[group][nom_id].label;
  });
};
