export default class WilderfeastTechnique extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.cost = new fields.StringField({ required: true, initial: "" });
    schema.description = new fields.HTMLField({ required: true, initial: "" });

    return schema;
  }
}
