// Map Pages table field IDs to names
const fs = require('fs');

const schema = JSON.parse(fs.readFileSync('airtable-schema-live.json', 'utf8'));

// Find Pages table
const pagesTable = schema.tables.find(t => t.name === 'Pages');

if (!pagesTable) {
  console.log('Pages table not found!');
  process.exit(1);
}

console.log('=== PAGES TABLE FIELD ID MAPPING ===\n');

// Create a map of field ID to field name
const fieldMap = {};
pagesTable.fields.forEach(field => {
  fieldMap[field.id] = field.name;
});

// List of field IDs we're interested in
const interestingFieldIds = [
  'fldwyohMQu0IWkrmi',  // appears in Unique Key
  'fldCliaruTvsxaIcf',  // appears in Unique Key and URL Slug
  'fldEvRR7f800Ws8Ge',  // appears in both
  'fldSKFK0GUnkvFBvD',  // appears in Unique Key
  'fldIRbXeaVUJAUUcv',  // appears in URL Slug IF condition
  'fldbenxwoIQmXKnvr',  // appears in Page URL
  'fldDJJIBM4NzzSSqU'   // appears in Page URL
];

interestingFieldIds.forEach(fieldId => {
  console.log(`${fieldId} = ${fieldMap[fieldId] || 'NOT FOUND'}`);
});

console.log('\n=== FORMULA FIELDS WITH HUMAN-READABLE NAMES ===\n');

// Unique Key
const uniqueKeyField = pagesTable.fields.find(f => f.name === 'Unique Key');
if (uniqueKeyField && uniqueKeyField.type === 'formula') {
  let formula = uniqueKeyField.options.formula;
  // Replace field IDs with names
  Object.entries(fieldMap).forEach(([id, name]) => {
    formula = formula.replace(new RegExp(`\\{${id}\\}`, 'g'), `{${name}}`);
  });
  console.log('Unique Key Formula:');
  console.log(formula);
  console.log();
}

// URL Slug
const urlSlugField = pagesTable.fields.find(f => f.name === 'URL Slug');
if (urlSlugField && urlSlugField.type === 'formula') {
  let formula = urlSlugField.options.formula;
  // Replace field IDs with names
  Object.entries(fieldMap).forEach(([id, name]) => {
    formula = formula.replace(new RegExp(`\\{${id}\\}`, 'g'), `{${name}}`);
  });
  console.log('URL Slug Formula:');
  console.log(formula);
  console.log();
}

// Page URL
const pageUrlField = pagesTable.fields.find(f => f.name === 'Page URL');
if (pageUrlField && pageUrlField.type === 'formula') {
  let formula = pageUrlField.options.formula;
  // Replace field IDs with names
  Object.entries(fieldMap).forEach(([id, name]) => {
    formula = formula.replace(new RegExp(`\\{${id}\\}`, 'g'), `{${name}}`);
  });
  console.log('Page URL Formula:');
  console.log(formula);
}
