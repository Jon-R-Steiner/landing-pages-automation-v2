// Analyze Unique Key formula in detail
const fs = require('fs');

const schema = JSON.parse(fs.readFileSync('airtable-schema-live.json', 'utf8'));
const pages = schema.tables.find(t => t.name === 'Pages');
const uk = pages.fields.find(f => f.name === 'Unique Key');

console.log('=== UNIQUE KEY FORMULA ANALYSIS ===\n');
console.log('Raw formula:');
console.log(uk.options.formula);
console.log('\n');

// Try to parse the formula parts
const formula = uk.options.formula;
console.log('Formula length:', formula.length);
console.log('\n');

// Look for SUBSTITUTE function call
const substrStartIdx = formula.indexOf('SUBSTITUTE(');
if (substrStartIdx !== -1) {
  console.log('SUBSTITUTE found at index:', substrStartIdx);
  // Find the matching closing paren
  let depth = 0;
  let startIdx = substrStartIdx + 'SUBSTITUTE('.length;
  let endIdx = -1;

  for (let i = startIdx; i < formula.length; i++) {
    if (formula[i] === '(') depth++;
    if (formula[i] === ')') {
      if (depth === 0) {
        endIdx = i;
        break;
      }
      depth--;
    }
  }

  if (endIdx !== -1) {
    const substituteParams = formula.substring(startIdx, endIdx);
    console.log('\nSUBSTITUTE parameters:');
    console.log(substituteParams);
    console.log('\n');

    // Try to split by commas (but not commas inside braces)
    let params = [];
    let currentParam = '';
    let braceDepth = 0;
    let inString = false;
    let stringChar = null;

    for (let i = 0; i < substituteParams.length; i++) {
      const char = substituteParams[i];

      if ((char === '"' || char === "'") && (i === 0 || substituteParams[i-1] !== '\\')) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
      }

      if (!inString) {
        if (char === '{') braceDepth++;
        if (char === '}') braceDepth--;

        if (char === ',' && braceDepth === 0) {
          params.push(currentParam.trim());
          currentParam = '';
          continue;
        }
      }

      currentParam += char;
    }

    if (currentParam) {
      params.push(currentParam.trim());
    }

    console.log('Parsed SUBSTITUTE parameters:');
    params.forEach((param, idx) => {
      console.log(`  Param ${idx + 1}: ${param}`);
    });
  }
}
