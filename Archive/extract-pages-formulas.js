// Extract Pages table formula fields
const fs = require('fs');

const schema = JSON.parse(fs.readFileSync('airtable-schema-live.json', 'utf8'));

// Find Pages table
const pagesTable = schema.tables.find(t => t.name === 'Pages');

if (!pagesTable) {
  console.log('Pages table not found!');
  process.exit(1);
}

console.log('=== PAGES TABLE FORMULA FIELDS ===\n');

// Find specific important fields
const importantFields = ['Unique Key', 'URL Slug', 'Page URL'];

importantFields.forEach(fieldName => {
  const field = pagesTable.fields.find(f => f.name === fieldName);

  if (field) {
    console.log(`Field Name: ${field.name}`);
    console.log(`Field Type: ${field.type}`);
    if (field.type === 'formula') {
      console.log(`Formula: ${field.options.formula}`);
      console.log(`Result Type: ${field.options.result.type}`);
    }
    console.log('---\n');
  } else {
    console.log(`Field "${fieldName}" not found in Pages table`);
    console.log('---\n');
  }
});

// Show all formula fields
console.log('\n=== ALL FORMULA FIELDS IN PAGES ===\n');
const formulaFields = pagesTable.fields.filter(f => f.type === 'formula');
formulaFields.forEach(field => {
  console.log(`- ${field.name}`);
});
