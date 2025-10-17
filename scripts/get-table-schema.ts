/**
 * Fetch table schema from Airtable Meta API
 *
 * Usage: npx tsx scripts/get-table-schema.ts [TableName]
 * Example: npx tsx scripts/get-table-schema.ts Pages
 */

// Load environment variables from .env.local (override system variables)
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local'), override: true });

import https from 'https';

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appATvatPtaoJ8MmS';
const API_KEY = process.env.AIRTABLE_API_KEY;

// Get table name from command-line argument
const TABLE_NAME = process.argv[2];

if (!API_KEY) {
  console.error('AIRTABLE_API_KEY environment variable required');
  process.exit(1);
}

if (!TABLE_NAME) {
  console.error('Error: Table name required');
  console.error('Usage: npx tsx scripts/get-table-schema.ts [TableName]');
  console.error('Example: npx tsx scripts/get-table-schema.ts Pages');
  process.exit(1);
}

const options = {
  hostname: 'api.airtable.com',
  path: `/v0/meta/bases/${BASE_ID}/tables`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (res.statusCode !== 200) {
        console.error('API Error:', response);
        process.exit(1);
      }

      const table = response.tables.find((t: any) => t.name === TABLE_NAME);

      if (!table) {
        console.error(`Table "${TABLE_NAME}" not found`);
        console.error('\nAvailable tables:');
        response.tables.forEach((t: any) => {
          console.error(`  - ${t.name}`);
        });
        process.exit(1);
      }

      console.log(`=== ${TABLE_NAME.toUpperCase()} TABLE SCHEMA ===\n`);
      console.log('Table ID:', table.id);
      console.log('Table Name:', table.name);
      console.log('Primary Field:', table.primaryFieldId);
      console.log('\nFIELDS:\n');

      table.fields.forEach((field: any) => {
        console.log(`Field: ${field.name}`);
        console.log(`  ID: ${field.id}`);
        console.log(`  Type: ${field.type}`);

        if (field.description) {
          console.log(`  Description: ${field.description}`);
        }

        if (field.options && Object.keys(field.options).length > 0) {
          console.log(`  Options:`, JSON.stringify(field.options, null, 4));
        }

        console.log('');
      });
    } catch (error) {
      console.error('Error parsing response:', (error as Error).message);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
  process.exit(1);
});

req.end();
