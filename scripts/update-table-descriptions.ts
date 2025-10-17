/**
 * Update table field descriptions via Airtable Meta API
 *
 * Usage: npx tsx scripts/update-table-descriptions.ts [TableName] [descriptionsJsonPath]
 * Example: npx tsx scripts/update-table-descriptions.ts Pages ./descriptions.json
 */

// Load environment variables from .env.local (override system variables)
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local'), override: true });

import https from 'https';
import fs from 'fs/promises';

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appATvatPtaoJ8MmS';
const API_KEY = process.env.AIRTABLE_API_KEY;

// Get arguments from command line
const TABLE_NAME = process.argv[2];
const DESCRIPTIONS_PATH = process.argv[3];

if (!API_KEY) {
  console.error('AIRTABLE_API_KEY environment variable required');
  process.exit(1);
}

if (!TABLE_NAME) {
  console.error('Error: Table name required');
  console.error('Usage: npx tsx scripts/update-table-descriptions.ts [TableName] [descriptionsJsonPath]');
  console.error('Example: npx tsx scripts/update-table-descriptions.ts Pages ./descriptions.json');
  process.exit(1);
}

if (!DESCRIPTIONS_PATH) {
  console.error('Error: Descriptions JSON file path required');
  console.error('Usage: npx tsx scripts/update-table-descriptions.ts [TableName] [descriptionsJsonPath]');
  console.error('Example: npx tsx scripts/update-table-descriptions.ts Pages ./descriptions.json');
  process.exit(1);
}

// Main execution
(async () => {
  try {
    // Step 1: Load field descriptions from JSON file
    console.log(`Step 1: Loading field descriptions from ${DESCRIPTIONS_PATH}...\n`);

    const descriptionsContent = await fs.readFile(DESCRIPTIONS_PATH, 'utf-8');
    const fieldDescriptions: Record<string, string> = JSON.parse(descriptionsContent);

    console.log(`Loaded ${Object.keys(fieldDescriptions).length} field descriptions\n`);

    // Step 2: Fetch table schema to get Table ID
    console.log(`Step 2: Fetching ${TABLE_NAME} table schema...\n`);

    const tableSchema = await new Promise<any>((resolve, reject) => {
      const getOptions = {
        hostname: 'api.airtable.com',
        path: `/v0/meta/bases/${BASE_ID}/tables`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      };

      const getReq = https.request(getOptions, (getRes) => {
        let getData = '';

        getRes.on('data', (chunk) => {
          getData += chunk;
        });

        getRes.on('end', () => {
          try {
            const getResponse = JSON.parse(getData);

            if (getRes.statusCode !== 200) {
              reject(new Error(`API Error: ${JSON.stringify(getResponse)}`));
              return;
            }

            const table = getResponse.tables.find((t: any) => t.name === TABLE_NAME);

            if (!table) {
              console.error(`Table "${TABLE_NAME}" not found`);
              console.error('\nAvailable tables:');
              getResponse.tables.forEach((t: any) => {
                console.error(`  - ${t.name}`);
              });
              reject(new Error('Table not found'));
              return;
            }

            resolve(table);
          } catch (error) {
            reject(error);
          }
        });
      });

      getReq.on('error', (error) => {
        reject(error);
      });

      getReq.end();
    });

    console.log(`Found table: ${tableSchema.name} (ID: ${tableSchema.id})`);
    console.log(`Table has ${tableSchema.fields.length} fields\n`);

    // Step 3: Filter fields that need updating
    const fieldsToUpdate = tableSchema.fields.filter((field: any) =>
      fieldDescriptions[field.id]
    );

    if (fieldsToUpdate.length === 0) {
      console.log('No fields to update (no matching field IDs in descriptions file)');
      process.exit(0);
    }

    console.log(`Step 3: Updating ${fieldsToUpdate.length} field descriptions...\n`);

    let successCount = 0;
    let errorCount = 0;

    // Update each field individually using field-specific endpoint
    async function updateField(field: any, index: number): Promise<void> {
      return new Promise<void>((resolve) => {
        const description = fieldDescriptions[field.id];
        const requestBody = { description };
        const bodyString = JSON.stringify(requestBody);

        const patchOptions = {
          hostname: 'api.airtable.com',
          path: `/v0/meta/bases/${BASE_ID}/tables/${tableSchema.id}/fields/${field.id}`,
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(bodyString),
          },
        };

        const patchReq = https.request(patchOptions, (patchRes) => {
          let patchData = '';

          patchRes.on('data', (chunk) => {
            patchData += chunk;
          });

          patchRes.on('end', () => {
            if (patchRes.statusCode === 200) {
              successCount++;
              console.log(`  ✅ ${index + 1}/${fieldsToUpdate.length}: ${field.name}`);
              resolve();
            } else {
              errorCount++;
              console.error(`  ❌ ${index + 1}/${fieldsToUpdate.length}: ${field.name} - ${patchRes.statusCode}`);
              console.error(`     Response: ${patchData}`);
              resolve(); // Continue with other fields
            }
          });
        });

        patchReq.on('error', (error) => {
          errorCount++;
          console.error(`  ❌ ${index + 1}/${fieldsToUpdate.length}: ${field.name} - ${error.message}`);
          resolve(); // Continue with other fields
        });

        patchReq.write(bodyString);
        patchReq.end();
      });
    }

    // Update fields sequentially to avoid rate limiting
    for (let i = 0; i < fieldsToUpdate.length; i++) {
      await updateField(fieldsToUpdate[i], i);
      // Small delay to avoid rate limiting
      if (i < fieldsToUpdate.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\n✅ Complete! ${successCount} successful, ${errorCount} errors.`);

  } catch (error) {
    console.error('Fatal error:', (error as Error).message);
    process.exit(1);
  }
})();
