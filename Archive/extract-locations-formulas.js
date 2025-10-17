// Extract Locations table formula fields
const fs = require('fs');

const schema = JSON.parse(fs.readFileSync('airtable-schema-live.json', 'utf8'));

// Find Locations table
const locationsTable = schema.tables.find(t => t.name === 'Locations');

if (!locationsTable) {
  console.log('Locations table not found!');
  process.exit(1);
}

console.log('=== LOCATIONS TABLE FORMULA FIELDS ===\n');

// Find all formula fields
const formulaFields = locationsTable.fields.filter(f => f.type === 'formula');

formulaFields.forEach(field => {
  console.log(`Field Name: ${field.name}`);
  console.log(`Field Type: ${field.type}`);
  console.log(`Formula: ${field.options.formula}`);
  console.log(`Result Type: ${field.options.result.type}`);
  console.log('---');
});
