export default class WilderfeastMonster extends foundry.abstract.TypeDataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      const requiredInteger = { required: true, nullable: false, integer: true };
      const schema = {};
  
      // Styles
      const styleField = (label) =>
        new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0}),
          max: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1, max: 5}),
          label: new fields.StringField({ initial: label }),
        });
  
      schema.styles = new fields.SchemaField(
        Object.values(SYSTEM.STYLES).reduce((obj, style) => {
          obj[style.id] = styleField(style.label);
          return obj;
        }, {})
      );
  
      // Skills
      const skillField = (label) =>
        new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 }),
          label: new fields.StringField({ initial: label }),
        });
  
      schema.skills = new fields.SchemaField(
        Object.values(SYSTEM.SKILLS).reduce((obj, skill) => {
          obj[skill.id] = skillField(skill.label);
          return obj;
        }, {})
      );
      
        // Stamina
        (schema.stamina = new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 20 }),
          max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
        }));
  
      // Equipment :
  
      schema.behavior = new fields.HTMLField({ required: true, blank: true });
      schema.quickref = new fields.HTMLField({ required: true, blank: true });
      schema.description = new fields.HTMLField({ required: true, blank: true });
  
      return schema;
    }
  }