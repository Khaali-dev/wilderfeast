export default class WilderfeastPart extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    // durability
    schema.durability = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 15 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 15 }),
    });
    schema.description = new fields.HTMLField({ required: true, blank: true });

    return schema;
  }
}
