// Script to compare live Airtable schema with documented schema
const fs = require('fs');

// Read the live schema
const liveSchema = JSON.parse(fs.readFileSync('airtable-schema-live.json', 'utf8'));

console.log('=== LIVE AIRTABLE TABLES ===\n');

// Extract table information
liveSchema.tables.forEach((table, index) => {
  console.log(`${index + 1}. ${table.name} (${table.fields.length} fields)`);
});

console.log(`\nTotal Tables: ${liveSchema.tables.length}`);

// List tables with field counts
console.log('\n=== DETAILED TABLE INFO ===\n');
liveSchema.tables.forEach(table => {
  console.log(`\n## ${table.name}`);
  console.log(`Fields (${table.fields.length} total):`);

  table.fields.forEach((field, idx) => {
    console.log(`  ${idx + 1}. ${field.name} (${field.type})`);
  });
});
