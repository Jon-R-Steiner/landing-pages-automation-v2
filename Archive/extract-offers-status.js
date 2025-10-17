// Extract Offers table Status field details
const fs = require('fs');

const schema = JSON.parse(fs.readFileSync('airtable-schema-live.json', 'utf8'));

// Find Offers table
const offersTable = schema.tables.find(t => t.name === 'Offers');

if (!offersTable) {
  console.log('Offers table not found!');
  process.exit(1);
}

// Find Status field
const statusField = offersTable.fields.find(f => f.name === 'Status');

if (!statusField) {
  console.log('Status field not found in Offers table!');
  process.exit(1);
}

console.log('=== OFFERS TABLE: STATUS FIELD ===\n');
console.log(`Field Name: ${statusField.name}`);
console.log(`Field Type: ${statusField.type}`);
console.log(`Field ID: ${statusField.id}`);

if (statusField.type === 'formula') {
  console.log(`\nFormula: ${statusField.options.formula}`);
  console.log(`\nResult Type: ${statusField.options.result.type}`);
}

console.log('\n=== ALL OFFERS TABLE FIELDS ===\n');
offersTable.fields.forEach((field, idx) => {
  console.log(`${idx + 1}. ${field.name} (${field.type})`);
});
