# Airtable Scripting API - Official Reference

**Purpose:** Complete API reference from official Airtable documentation
**Source:** https://airtable.com/developers/scripting/api
**Last Updated:** 2025-10-11

---

## Table of Contents

1. [Base API](#base-api) ✅
2. [Table API](#table-api) ✅
3. [View API](#view-api) ✅
4. [Field API](#field-api) ✅
5. [Record API](#record-api) ✅
6. [RecordQueryResult API](#recordqueryresult-api) ✅
7. [Cell Values & Field Options](./00-cell-values-field-options.md) ✅ *(See separate document)*
8. [Session API](#session-api) ✅
9. [Collaborator API](#collaborator-api) ✅
10. [Input API](#input-api) ✅
11. [Output API](#output-api) ✅
12. [Fetch API](#fetch-api) ✅
13. [Secrets API](#secrets-api) ✅
14. [Quick Reference](#quick-reference)

---

## Base API

A Base provides an entry point to all of the data in a given base. There is only ever one base available—the base in which this script is installed. It can be accessed via the `base` global variable.

### Properties

#### `id`
**Type:** `string`

The unique ID of your base.

#### `name`
**Type:** `string`

The name of your base.

**Example:**
```javascript
console.log(`The name of my base is ${base.name}.`);
```

#### `activeCollaborators`
**Type:** `Array<Collaborator>`

The users who have access to this base.

**Example:**
```javascript
// Show a table of all the base collaborators:
console.log('# All collaborators:');
console.log(base.activeCollaborators);
```

#### `tables`
**Type:** `Array<Table>`

The tables in this base.

**Example:**
```javascript
console.log(`It contains ${base.tables.length} tables.`);

// Log every table's name and id from the base
for (let table of base.tables) {
    console.log(`Table '${table.name}' has id '${table.id}'.`);
}
```

---

### Methods

#### `getCollaborator(idOrNameOrEmail)`
**Type:** `function (idOrNameOrEmail: string) => Collaborator`

Get a user collaborator, that is shared either directly or indirectly via a user group, from the base according to their ID, name, or email.

**Parameters:**
- `idOrNameOrEmail` *(string)* - The id, name, or email address of the user collaborator you want to retrieve.

**Example:**
```javascript
// Get collaborator by id:
let collaborator1 = base.getCollaborator("usrNP1ySFJSOvgFtR");
console.log(collaborator1);

// Get collaborator by name:
let collaborator2 = base.getCollaborator("Casey Park");
console.log(collaborator2);

// Get collaborator by email:
let collaborator3 = base.getCollaborator("sandy.hagen@airtable.com");
console.log(collaborator3);
```

---

#### `getTable(idOrName)`
**Type:** `function (idOrName: string) => Table`

Get a table from the base according to its ID or name.

**Parameters:**
- `idOrName` *(string)* - The id or name of the table you want to retrieve.

**Example:**
```javascript
// Get table by id:
let table1 = base.getTable("tblpU54l0oR3rPNLF");
console.log(table1);

// Get table by name:
let table2 = base.getTable("Projects");
console.log(table2);
```

---

#### `createTableAsync(name, fields)`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `(name: string, fields: Array<{name: string, type: FieldType, options?: {[key: string]: unknown} | null, description?: string | null}>) => Promise<string>`

Creates a new table.

**Parameters:**
- `name` *(string)* - Name for the table. Must be case-insensitive unique
- `fields` *(Array)* - Array of fields to create in the table

**Field Types That Can Be Created:**
- `checkbox`, `singleSelect`, `multipleSelects`
- `singleCollaborator`, `multipleCollaborators`
- `number`, `percent`, `currency`, `duration`
- `singleLineText`, `email`, `url`, `multilineText`, `phoneNumber`, `richText`
- `barcode`, `multipleAttachments`
- `date`, `dateTime`
- `rating`, `multipleRecordLinks`

**Field Types That CANNOT Be Created:**
- `formula`, `createdTime`, `rollup`, `count`, `multipleLookupValues`
- `autoNumber`, `lastModifiedTime`, `button`
- `createdBy`, `lastModifiedBy`, `externalSyncSource`, `aiText`

**Example:**
```javascript
const tableId = await base.createTableAsync("Tasks", [
    {name: "Title", type: "singleLineText"}
]);
```

**Notes:**
- At least one field must be specified
- First field becomes the primary field
- A default grid view is created
- This action is asynchronous: use `await`

---

## Table API

Table represents each table in your base. You can use it to find all of the views, fields, and records it contains. Each base has at least one table.

Get tables using `base.getTable()`.

### Properties

#### `id`
**Type:** `string`

The ID of this table.

**Example:**
```javascript
let table = base.getTable("Tasks");
console.log(`Table id: ${table.id}`);
```

#### `name`
**Type:** `string`

The name of the table.

**Example:**
```javascript
// Show the names of every table in the base
for (let table of base.tables) {
    console.log(`Your base has a table called '${table.name}'.`);
}
```

#### `description`
**Type:** `string | null`

The description of this table, if it has one.

**Example:**
```javascript
// Show the description (if there is one) of every table in the base
for (let table of base.tables) {
    console.log(`## ${table.name} description:`);
    if (table.description) {
        console.log(table.description);
    } else {
        console.log('No description');
    }
}
```

#### `url`
**Type:** `string`

The URL for the table. You can visit this URL in the browser to be taken to the table in the Airtable UI.

**Example:**
```javascript
// Show a link to open every table in the base
for (let table of base.tables) {
    console.log(`[Click to open ${table.name}](${table.url})`);
}
```

#### `fields`
**Type:** `Array<Field>`

The fields in this table. The order is arbitrary, since fields are only ordered in the context of a specific view.

**Example:**
```javascript
// Show an interactive inspector for every field in "Projects"
let table = base.getTable("Projects");
for (let field of table.fields) {
    console.log(field);
}
```

#### `views`
**Type:** `Array<View>`

The views in this table.

**Example:**
```javascript
// Show an interactive inspector for every view in "Projects"
let table = base.getTable("Projects");
for (let view of table.views) {
    console.log(view);
}
```

---

### Methods

#### `getField(idOrName)`
**Type:** `function (idOrName: string) => Field`

Get a field in the table according to its id or name.

**Parameters:**
- `idOrName` *(string)* - The ID or name of the field you want to retrieve.

**Example:**
```javascript
// Get a field by id:
let field1 = base.getTable("Projects").getField("flda5C1tcbEU9PvqA");
console.log(field1);

// Get a field by name:
let field2 = base.getTable("People").getField("Role");
console.log(field2);
```

---

#### `getView(idOrName)`
**Type:** `function (idOrName: string) => View`

Get a view in the table according to its id or name.

**Parameters:**
- `idOrName` *(string)* - The ID or name of the view you want to retrieve.

**Example:**
```javascript
// Get a view by id:
let view1 = base.getTable("Tasks").getView("viwbSMf3hovmqmo27");
console.log(view1);

// Get a view by name:
let view2 = base.getTable("Projects").getView("By Category");
console.log(view2);
```

---

#### `createFieldAsync(name, type, options, description)`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `(name: string, type: FieldType, options?: {[key: string]: unknown} | null, description?: string | null) => Promise<string>`

Creates a new field.

**Parameters:**
- `name` *(string)* - Name for the field. Must be case-insensitive unique.
- `type` *(FieldType)* - Type for the field.
- `options` *(object, optional)* - Options for the field. Omit for fields without writable options.
- `description` *(string, optional)* - Description for the field.

**Example:**
```javascript
const table = base.getTable("Tasks");
const fieldId = await table.createFieldAsync("Notes", "multilineText");
```

---

#### `selectRecordsAsync(options)`
**Type:** `async function (options?: {...}) => Promise<RecordQueryResult>`

Select records from the table. This action is asynchronous: you must add `await` before each call to this method.

**Parameters:**
- `options` *(object, optional)* - Options for the query
  - `options.sorts` *(Array, optional)* - Array of sorts to control record order
    - `{field: Field | string, direction?: 'asc' | 'desc'}`
  - `options.fields` *(Array, optional)* - Fields to load (by Field, ID, or name)
    - **⚠️ Note:** Primary field is NOT included by default
  - `options.recordIds` *(Array, optional)* - IDs of specific records to return (max 100)

**Example:**
```javascript
// Query for every record in "People"
let table = base.getTable("People");
let query = await table.selectRecordsAsync({fields: []});
console.log(query);
```

**Example with sorting:**
```javascript
// Query for given fields from every record in "Tasks"
let table = base.getTable("Tasks");
let query = await table.selectRecordsAsync({
    fields: ["Priority", "Status"],
    sorts: [
        // Sort by "Priority" in ascending order...
        {field: "Priority"},
        // Then by "Status" in descending order
        {field: "Status", direction: "desc"},
    ]
});

// Print ID & "Priority" from each record:
for (let record of query.records) {
    console.log(`**${record.id}**`);
    console.log(record.getCellValueAsString("Priority"));
}
```

---

#### `selectRecordAsync(recordId, options)`
**Type:** `async function (recordId: string, options?: {...}) => Promise<Record | null>`

Select a single record from the table. Returns `null` if the specified record cannot be found.

**Parameters:**
- `recordId` *(string)* - The ID of the record to return.
- `options` *(object, optional)* - Options for the query
  - `options.fields` *(Array, optional)* - Fields to load

**Example:**
```javascript
let table = base.getTable("Tasks");
let record = await table.selectRecordAsync("recABC123", {
    fields: ["Name", "Status"]
});

if (record) {
    console.log(record.name);
}
```

---

#### `createRecordAsync(fields)`
**Type:** `async function (fields: {[fieldNameOrId: string]: unknown}) => Promise<string>`

Creates a new record with the specified cell values. Returns the ID of the created record.

**Parameters:**
- `fields` *(object)* - Object mapping field names or IDs to cell values

**Example:**
```javascript
// Create a record in the Tasks table
let table = base.getTable("Tasks");
let recordId = await table.createRecordAsync({
    "Description": "Hello world!",
});
console.log("Created a record!");
```

**Notes:**
- This action is asynchronous: use `await`
- See Cell Values & Field Options for cell value format

---

#### `createRecordsAsync(records)`
**Type:** `async function (records: Array<{fields: {[fieldNameOrId: string]: unknown}}>) => Promise<Array<string>>`

Creates multiple new records with the specified cell values. Returns array of created record IDs.

**Parameters:**
- `records` *(Array)* - Array of objects with `fields` property

**⚠️ Limit:** You may only create up to **50 records** in one call.

**Example:**
```javascript
// Create three records in the Tasks table
let table = base.getTable("Tasks");
let recordIds = await table.createRecordsAsync([
    {
        fields: {
            "Description": "Alice",
        },
    },
    {
        fields: {
            "Description": "Bob",
        },
    },
    // Empty fields object creates record with no cell values set
    {
        fields: {},
    },
]);
console.log("Created " + recordIds.length + " records!");
```

---

#### `updateRecordAsync(recordOrRecordId, fields)`
**Type:** `async function (recordOrRecordId: Record | string, fields: {[fieldNameOrId: string]: unknown}) => Promise<void>`

Updates cell values for a record.

**Parameters:**
- `recordOrRecordId` *(Record | string)* - The record to update
- `fields` *(object)* - Object mapping field names or IDs to updated cell values

**Example:**
```javascript
// Update a record in the Tasks table
let table = base.getTable("Tasks");
let query = await table.selectRecordsAsync({fields: []});

let recordId = query.records[0].id;

await table.updateRecordAsync(recordId, {
    "Description": "Hello again!",
});

console.log("Updated a record!");
```

---

#### `updateRecordsAsync(records)`
**Type:** `async function (records: Array<{id: string, fields: {[fieldNameOrId: string]: unknown}}>) => Promise<void>`

Updates cell values for multiple records.

**Parameters:**
- `records` *(Array)* - Array of objects with `id` and `fields` properties

**⚠️ Limit:** You may only update up to **50 records** in one call.

**Example:**
```javascript
// Update two records in the Tasks table
let table = base.getTable("Tasks");
let query = await table.selectRecordsAsync({fields: []});
let records = query.records;

await table.updateRecordsAsync([
    {
        id: records[0].id,
        fields: {
            "Description": "Update one",
        },
    },
    {
        id: records[1].id,
        fields: {
            "Description": "Update two",
        },
    },
]);

console.log("Updated 2 records!");
```

---

#### `deleteRecordAsync(recordOrRecordId)`
**Type:** `async function (recordOrRecordId: Record | string) => Promise<void>`

Delete a single record.

**Parameters:**
- `recordOrRecordId` *(Record | string)* - The record to be deleted

**Example:**
```javascript
// Delete a record in the Tasks table
let table = base.getTable("Tasks");
let query = await table.selectRecordsAsync({fields: []});

let recordId = query.records[0].id;

await table.deleteRecordAsync(recordId);

console.log("Deleted a record!");
```

---

#### `deleteRecordsAsync(recordsOrRecordIds)`
**Type:** `async function (recordsOrRecordIds: Array<Record | string>) => Promise<void>`

Delete multiple records.

**Parameters:**
- `recordsOrRecordIds` *(Array)* - The records to be deleted

**⚠️ Limit:** You may only delete up to **50 records** in one call.

**Example:**
```javascript
// Delete two records in the Tasks table
let table = base.getTable("Tasks");
let query = await table.selectRecordsAsync({fields: []});
let records = query.records;

await table.deleteRecordsAsync([
    records[0].id,
    records[1].id,
]);

console.log("Deleted two records!");
```

---

## View API

A view belonging to a table in your base. Each table has at least one view.

Get views using `table.getView()`.

### Properties

#### `id`
**Type:** `string`

The unique ID of this view.

**Example:**
```javascript
let table = base.getTable("Projects");
let view = table.getView("By Launch Date");
console.log(`View id: ${view.id}`);
```

#### `name`
**Type:** `string`

The name of the view.

**Example:**
```javascript
let table = base.getTable("People");
let view = table.getView("Grid View");
console.log(`View name: ${view.name}`);
```

#### `type`
**Type:** `'grid' | 'form' | 'calendar' | 'gallery' | 'kanban'`

The type of the view, such as Grid, Calendar, or Kanban.

**Example:**
```javascript
// Show the type of every view in "Tasks"
for (let view of base.getTable("Tasks").views) {
    console.log(`View "${view.name}" has type "${view.type}".`);
}
```

#### `url`
**Type:** `string`

The URL for the view. You can visit this URL in the browser to be taken to the view in the Airtable UI.

**Example:**
```javascript
// Show a link to open every view in "Projects"
for (let view of base.getTable("Projects").views) {
    console.log(`[Click to open ${view.name}](${view.url})`);
}
```

---

### Methods

#### `selectRecordsAsync(options)`
**Type:** `async function (options?: {...}) => Promise<RecordQueryResult>`

Select records from the view. If you don't specify sorts, the query result will use the order of records shown in the Airtable UI for this view.

**Parameters:**
- `options` *(object, optional)* - Same as Table.selectRecordsAsync()
  - `options.sorts` *(Array, optional)*
  - `options.fields` *(Array, optional)*
  - `options.recordIds` *(Array, optional)* - Max 100 records

**Example:**
```javascript
// Query for every record in "By Project"
let table = base.getTable("People");
let view = table.getView("By Project");
let query = await view.selectRecordsAsync({fields: table.fields});
console.log(query);
```

#### `selectRecordAsync(recordId, options)`
**Type:** `async function (recordId: string, options?: {...}) => Promise<Record | null>`

Select a single record from the view. Returns `null` if the specified record cannot be found.

**Parameters:**
- `recordId` *(string)* - The ID of the record to return
- `options` *(object, optional)*
  - `options.fields` *(Array, optional)*

---

## Field API

A field belonging to a table in your base. Each table has at least one field.

Get fields using `table.getField()`.

### Properties

#### `id`
**Type:** `string`

The unique ID of this field.

**Example:**
```javascript
let table = base.getTable("Projects");
let field = table.getField("Category");
console.log(`Field id: ${field.id}`);
```

#### `name`
**Type:** `string`

The name of the field.

**Example:**
```javascript
let table = base.getTable("People");
let field = table.getField("Role");
console.log(`Field name: ${field.name}`);
```

#### `description`
**Type:** `string | null`

The description of this field, if it has one.

**Example:**
```javascript
let table = base.getTable("People");
let field = table.getField("Role");
console.log(`Field description: ${field.description}`);
```

#### `type`
**Type:** `FieldType`

The type of the field. Possible values:
- `'singleLineText'`, `'email'`, `'url'`, `'multilineText'`, `'phoneNumber'`, `'richText'`
- `'number'`, `'percent'`, `'currency'`, `'duration'`
- `'singleSelect'`, `'multipleSelects'`
- `'singleCollaborator'`, `'multipleCollaborators'`
- `'multipleRecordLinks'`
- `'date'`, `'dateTime'`
- `'multipleAttachments'`
- `'checkbox'`, `'rating'`, `'barcode'`
- `'formula'`, `'rollup'`, `'count'`, `'multipleLookupValues'`
- `'createdTime'`, `'lastModifiedTime'`
- `'autoNumber'`
- `'externalSyncSource'`

**Example:**
```javascript
// Show the type of every field in "Tasks"
for (let field of base.getTable("Tasks").fields) {
    console.log(`Field "${field.name}" has type "${field.type}".`);
}
```

#### `options`
**Type:** `null | unknown`

The configuration options of the field. The structure depends on the field's type.

**Example:**
```javascript
// Show the options of every field in "Projects"
for (let field of base.getTable("Projects").fields) {
    console.log(`Field "${field.name}" (${field.type}) options:`);
    console.log(field.options);
}
```

#### `isComputed`
**Type:** `boolean`

`true` if this field is computed, `false` otherwise. A field is "computed" if its value is not set by user input (e.g. `autoNumber`, `formula`, etc.).

**Example:**
```javascript
// Show whether or not each field in "People" is computed
for (let field of base.getTable("People").fields) {
    if (field.isComputed) {
        console.log(`Field "${field.name}" is computed`);
    } else {
        console.log(`Field "${field.name}" is not computed`);
    }
}
```

---

### Methods

#### `updateDescriptionAsync(description)`
**Type:** `(description: string | null) => Promise<void>`

Updates the description for this field.

**Parameters:**
- `description` *(string | null)* - New description for the field. Pass `''` or `null` to remove.

**Example:**
```javascript
let table = base.getTable("Projects");
let field = table.getField("Category");
await field.updateDescriptionAsync('New description');
```

#### `updateOptionsAsync(options)`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `(options: {[key: string]: unknown}) => Promise<void>`

Updates the options for this field.

**Parameters:**
- `options` *(object)* - New options for the field

**Example:**
```javascript
const table = base.getTable("Tasks");
const selectField = table.getField("Priority");
await selectField.updateOptionsAsync({
    choices: [...field.options.choices, {name: "Urgent"}],
});
```

#### `updateNameAsync(name)`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `(name: string) => Promise<void>`

Updates the name for this field.

**Parameters:**
- `name` *(string)* - New name for the field

**Example:**
```javascript
let table = base.getTable("Projects");
let field = table.getField("Category");
await field.updateNameAsync('New name');
```

---

## Record API

A record belonging to a table in your base.

Get records in a table using `table.selectRecordsAsync()` or in a view using `view.selectRecordsAsync()` and using the resulting RecordQueryResult.

### Properties

#### `id`
**Type:** `string`

The unique ID of this record.

**Example:**
```javascript
let table = base.getTable("Tasks");
let queryResult = await table.selectRecordsAsync({fields: []});
let record = queryResult.records[0];
console.log(record.id);
```

#### `name`
**Type:** `string`

The primary cell value as a string, or 'Unnamed record' if primary cell value is empty.

---

### Methods

#### `getCellValue(fieldOrIdOrName)`
**Type:** `function (fieldOrIdOrName: Field | string) => unknown`

Gets a specific cell value in this record. See [Cell Values & Field Options](#cell-values--field-options) for the cell value format for each field type.

**Parameters:**
- `fieldOrFieldIdOrFieldName` *(Field | string)* - The field (or ID or name) whose cell value you want to retrieve.

**Example:**
```javascript
let table = base.getTable("Tasks");
let queryResult = await table.selectRecordsAsync({fields: ["Description"]});
let record = queryResult.records[0];
console.log(record.getCellValue("Description"));
```

#### `getCellValueAsString(fieldOrIdOrName)`
**Type:** `function (fieldOrIdOrName: Field | string) => string`

Gets a specific cell value in this record, formatted as a string.

**Parameters:**
- `fieldOrFieldIdOrFieldName` *(Field | string)* - The field (or ID or name) whose cell value you want to retrieve.

**Example:**
```javascript
let table = base.getTable("Tasks");
let queryResult = await table.selectRecordsAsync({fields: ["Priority"]});
let record = queryResult.records[0];
console.log(record.getCellValueAsString("Priority"));
```

---

## RecordQueryResult API

A RecordQueryResult represents a set of records. It's a little bit like a one-off Airtable view: it contains a bunch of records, those records can be sorted according to your specification, and just like a view, you can either have all the fields in a table available, or you can just ask for the fields that are relevant to you.

You can use `table.selectRecordsAsync()` to query records in a table and `view.selectRecordsAsync()` to query records in a view.

**Example - Query from table:**
```javascript
// query for all the records in a table
let table = base.getTable("Tasks");
let queryResult = await table.selectRecordsAsync({
    fields: ["Description", "Priority"],
    sorts: [
       // sort by "Description" in ascending order
       {field: "Description"},
       // then by "Priority" in descending order.
       {field: "Priority", direction: "desc"},
    ]
});

// print ID & "Description" from each record:
for (let record of queryResult.records) {
    console.log(`**${record.id}**`);
    console.log(record.getCellValueAsString("Description"));
}
```

**Example - Query from view:**
```javascript
// query for all the records in a view
let table = base.getTable("Tasks");
let view = table.getView("Todo");
let queryResult = await view.selectRecordsAsync({fields: ["Description"]});

// print ID & "Description" from each record:
for (let record of queryResult.records) {
    console.log(`**${record.id}**`);
    console.log(record.getCellValueAsString("Description"));
}
```

---

### Properties

#### `recordIds`
**Type:** `Array<string>`

The record IDs in this RecordQueryResult.

#### `records`
**Type:** `Array<Record>`

The records in this RecordQueryResult. These are instances of the Record class.

**Example:**
```javascript
let table = base.getTable("Tasks");
let queryResult = await table.selectRecordsAsync({fields: ["Description"]});
let record = queryResult.records[0];
console.log(record.getCellValue("Description"));
```

---

### Methods

#### `getRecord(recordId)`
**Type:** `function (recordId: string) => Record`

Get a specific record in the query result, or throw if that record doesn't exist or was filtered out.

**Parameters:**
- `recordId` *(string)* - The ID of the record you want to retrieve.

**Example:**
```javascript
let table = base.getTable("Tasks");
let queryResult = await table.selectRecordsAsync({fields: ["Description"]});
let record = queryResult.getRecord(queryResult.recordIds[0]);
console.log(record.getCellValue("Description"));
```

---

## Session API

The Session API represents the current session and provides access to the current user.

Access via the `session` global variable.

### Properties

#### `currentUser`
**Type:** `Collaborator | null`

The current logged-in user, or `null` if running in an automation (since automations don't have an associated user).

**Example:**
```javascript
if (session.currentUser) {
    console.log(`Current user: ${session.currentUser.name}`);
    console.log(`Email: ${session.currentUser.email}`);
} else {
    console.log('No current user (running in automation)');
}
```

**Note:** In scripting extensions, `session.currentUser` will be the user running the script. In automations, it will be `null`.

---

## Collaborator API

A Collaborator represents a user who has access to the base.

Get collaborators using `base.getCollaborator()` or `base.activeCollaborators`.

### Properties

#### `id`
**Type:** `string`

The unique ID of this collaborator.

**Example:**
```javascript
let collaborator = base.getCollaborator("usrNP1ySFJSOvgFtR");
console.log(`Collaborator id: ${collaborator.id}`);
```

#### `name`
**Type:** `string`

The name of the collaborator.

**Example:**
```javascript
for (let collaborator of base.activeCollaborators) {
    console.log(`Collaborator name: ${collaborator.name}`);
}
```

#### `email`
**Type:** `string | null`

The email address of the collaborator, or `null` if the email is not available.

**Example:**
```javascript
let collaborator = base.getCollaborator("Sandy Hagen");
if (collaborator.email) {
    console.log(`Email: ${collaborator.email}`);
}
```

#### `profilePicUrl`
**Type:** `string`

The URL of the collaborator's profile picture.

**Example:**
```javascript
let collaborator = session.currentUser;
if (collaborator) {
    console.log(`Profile picture: ${collaborator.profilePicUrl}`);
}
```

---

## Input API

The Input API allows scripts to prompt users for input. In scripting extensions, prompts are shown in a dialog. In automation scripts, input must be configured via `input.config()`.

Access via the `input` global variable.

### Methods

#### `textAsync(prompt, initialValue)`
**Type:** `async function (prompt: string, initialValue?: string) => Promise<string>`

Prompts the user to enter text.

**Parameters:**
- `prompt` *(string)* - The prompt text to display
- `initialValue` *(string, optional)* - Default text value

**Example:**
```javascript
let name = await input.textAsync('Enter your name:');
console.log(`Hello ${name}!`);
```

**Example with initial value:**
```javascript
let description = await input.textAsync(
    'Enter description:',
    'Default description'
);
```

---

#### `buttonsAsync(prompt, buttons)`
**Type:** `async function (prompt: string, buttons: Array<string | {label: string, value?: string, variant?: 'default' | 'primary' | 'danger'}>>) => Promise<string>`

Prompts the user to click one of multiple buttons.

**Parameters:**
- `prompt` *(string)* - The prompt text to display
- `buttons` *(Array)* - Array of button labels (strings) or button configuration objects

**Button Configuration Object:**
- `label` *(string)* - Button text
- `value` *(string, optional)* - Return value (defaults to label)
- `variant` *(string, optional)* - Button style: `'default'`, `'primary'`, or `'danger'`

**Returns:** The value of the clicked button (or label if no value specified).

**Example:**
```javascript
let choice = await input.buttonsAsync('Choose an option:', ['Yes', 'No', 'Cancel']);
console.log(`You chose: ${choice}`);
```

**Example with button objects:**
```javascript
let action = await input.buttonsAsync('What would you like to do?', [
    {label: 'Create', value: 'create', variant: 'primary'},
    {label: 'Delete', value: 'delete', variant: 'danger'},
    {label: 'Cancel', value: 'cancel', variant: 'default'}
]);
console.log(`Action: ${action}`);
```

---

#### `tableAsync(prompt, table)`
**Type:** `async function (prompt: string, table?: Table) => Promise<Table>`

Prompts the user to pick a table.

**Parameters:**
- `prompt` *(string)* - The prompt text to display
- `table` *(Table, optional)* - Default table selection

**Returns:** The selected Table object.

**Example:**
```javascript
let table = await input.tableAsync('Select a table:');
console.log(`You selected: ${table.name}`);
```

---

#### `viewAsync(prompt, table, view)`
**Type:** `async function (prompt: string, table: Table, view?: View) => Promise<View>`

Prompts the user to pick a view from a table.

**Parameters:**
- `prompt` *(string)* - The prompt text to display
- `table` *(Table)* - The table whose views to show
- `view` *(View, optional)* - Default view selection

**Returns:** The selected View object.

**Example:**
```javascript
let table = base.getTable("Tasks");
let view = await input.viewAsync('Select a view:', table);
console.log(`You selected: ${view.name}`);
```

---

#### `fieldAsync(prompt, table, field)`
**Type:** `async function (prompt: string, table: Table, field?: Field) => Promise<Field>`

Prompts the user to pick a field from a table.

**Parameters:**
- `prompt` *(string)* - The prompt text to display
- `table` *(Table)* - The table whose fields to show
- `field` *(Field, optional)* - Default field selection

**Returns:** The selected Field object.

**Example:**
```javascript
let table = base.getTable("Tasks");
let field = await input.fieldAsync('Select a field:', table);
console.log(`You selected: ${field.name}`);
```

---

#### `recordAsync(prompt, table, recordId)`
**Type:** `async function (prompt: string, table: Table, recordId?: string) => Promise<Record>`

Prompts the user to pick a record from a table.

**Parameters:**
- `prompt` *(string)* - The prompt text to display
- `table` *(Table)* - The table whose records to show
- `recordId` *(string, optional)* - Default record ID selection

**Returns:** The selected Record object.

**Example:**
```javascript
let table = base.getTable("Tasks");
let record = await input.recordAsync('Select a record:', table);
console.log(`You selected: ${record.name}`);
```

---

#### `fileAsync(prompt)`
**Type:** `async function (prompt: string) => Promise<File>`

**⚠️ Scripting Extension only** *(Not available in automation scripts)*

Prompts the user to pick a file from their computer.

**Parameters:**
- `prompt` *(string)* - The prompt text to display

**Returns:** A File object with `name` *(string)* and `parseCsv()` method.

**Example:**
```javascript
let file = await input.fileAsync('Select a CSV file:');
console.log(`File name: ${file.name}`);

// Parse CSV file
let csvData = await file.parseCsv();
console.log(csvData);
```

---

#### `config(options)`
**⚠️ Automation scripts only** *(Not available in scripting extensions)*

**Type:** `function (options?: {title?: string, description?: string, items?: Array<InputConfigItem>}) => void`

Configures inputs for an automation script. This must be called at the top level of your script (not inside a function) and only in automation scripts.

**Parameters:**
- `options` *(object, optional)*
  - `title` *(string, optional)* - Title shown in automation configuration UI
  - `description` *(string, optional)* - Description shown in automation configuration UI
  - `items` *(Array, optional)* - Array of input configuration items

**Input Configuration Item:**
```typescript
{
    key: string;           // Unique key to access this input value
    label: string;         // Label shown in UI
    description?: string;  // Optional description
    type: 'text' | 'number' | 'date' | ...;  // Input type
    required?: boolean;    // Whether input is required (default: false)
}
```

**Example:**
```javascript
input.config({
    title: 'Task Creator',
    description: 'Creates a new task with the specified details',
    items: [
        {
            key: 'taskName',
            label: 'Task name',
            type: 'text',
            required: true
        },
        {
            key: 'dueDate',
            label: 'Due date',
            type: 'date'
        },
        {
            key: 'assignee',
            label: 'Assignee',
            type: 'collaborator'
        }
    ]
});

// Access configured values
let taskName = input.config().taskName;
let dueDate = input.config().dueDate;
let assignee = input.config().assignee;

// Create record with input values
let table = base.getTable("Tasks");
await table.createRecordAsync({
    "Name": taskName,
    "Due Date": dueDate,
    "Assignee": assignee ? {id: assignee.id} : null
});
```

**Note:** After calling `input.config()`, you can access the input values via `input.config()` followed by the key name.

---

## Output API

The Output API allows scripts to display information to users. In scripting extensions, output is displayed on-screen. In automation scripts, output data becomes available to subsequent automation steps.

Access via the `output` global variable.

### Methods

#### `text(source)`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `async function (source: unknown) => Promise<void>`

Displays the given text on-screen. Non-string types are converted to strings.

**Parameters:**
- `source` *(unknown)* - The text to display on-screen

**Example:**
```javascript
output.text('Hello, world!');
```

**Output:**
```
Hello, world!
```

---

#### `markdown(source)`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `async function (source: string) => Promise<void>`

Displays the given Markdown on-screen.

**Parameters:**
- `source` *(string)* - The Markdown to display on-screen

**Example:**
```javascript
output.markdown('Hello, *world*!');
```

**Output:**
```
Hello, world!
```

**Example with template:**
```javascript
output.markdown(`
**Base name**

The name of the current base is '${base.name}'.
`);
```

**Output:**
```
Base name

The name of the current base is 'Projects'.
```

---

#### `table(data)`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `async function (data: unknown) => Promise<void>`

Outputs arrays or objects as tables. It mirrors the `console.table` API.

**Parameters:**
- `data` *(unknown)* - The array or object to display on-screen

**Example with array:**
```javascript
output.table(['hello', 'world']);
```

**Output:**
```
Values
0    hello
1    world
```

**Example with objects:**
```javascript
output.table([
    {name: 'Guthrie', age: 5, type: 'cat'},
    {name: 'Amber', age: 4, type: 'dog'},
]);
```

**Output:**
```
name       age    type
Guthrie    5      cat
Amber      4      dog
```

---

#### `inspect(object)`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `async function (object: unknown) => Promise<void>`

Takes any data from your program and outputs an interactive inspector for exploring it. This is useful for debugging your script as you write it.

**Parameters:**
- `object` *(unknown)* - The object to inspect

**Example:**
```javascript
let table = base.getTable("Tasks");
output.inspect(table);
```

---

#### `clear()`
**⚠️ Scripting Extension only** *(Not available in automation scripts)*

**Type:** `async function () => Promise<void>`

Clears all previous output.

**Example:**
```javascript
output.text('This will be cleared');
await output.clear();
output.text('Only this will be visible');
```

---

#### `set(key, value)`
**⚠️ Automations only** *(Not available in scripting extensions)*

**Type:** `function (key: string, value: unknown) => void`

Sets a property in the object output by the script. Data that you output will be available to subsequent automation steps within the template expression UI. If a value was already set for the given key, it will be overwritten with the new value.

**Parameters:**
- `key` *(string)* - The key to set in the output object
- `value` *(unknown)* - The value to set for the given key (must be JSON-serializable)

**Example:**
```javascript
output.set('recordId', 'rec123abc');
output.set('status', 'completed');
output.set('count', 42);
```

**Note:** Access output in subsequent automation steps by clicking the blue '+' icon or typing '{' and selecting the output key.

---

## Fetch API

Your script can make network requests to external services using the Fetch API.

### `fetch(url, init)`

**Type:** `async function (url: string | Request, init?: object) => Promise<Response>`

Makes HTTP requests to external APIs. This is an asynchronous function: you must add `await` before each call.

**Parameters:**
- `url` *(string | Request)* - The URL to fetch
- `init` *(object, optional)* - Request options (method, headers, body, etc.)

**Complete documentation:** Available on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

### Browser Fetch (Scripting Extensions)

**⚠️ Scripting Extension only**

The scripting extension uses the browser-native implementation of `fetch`.

**Example - GET request to JSON API:**
```javascript
let response = await fetch('https://api.github.com/orgs/Airtable');
console.log(await response.json());
```

**Example - POST request:**
```javascript
let response = await fetch('https://www.example.com/sendMessage', {
    method: 'POST',
    body: 'Hi there'
});
console.log(await response.text());
```

**Example - POST request to JSON API:**
```javascript
let response = await fetch('https://www.example.com/sendJSONMessage', {
    method: 'POST',
    body: JSON.stringify({message: 'Hi there'}),
    headers: {
        'Content-Type': 'application/json',
    },
});
console.log(await response.json());
```

---

### Automations Fetch

**⚠️ Automations only**

Scripting actions in automations can use `fetch`, but since it doesn't run in the browser, there are important differences:

**Differences from browser fetch:**
- The `referrer` and `referrerPolicy` options are not respected (no `Referer` header)
- The `follow` redirect mode is not supported (only `error` and `manual`)
- Streaming responses and requests are not supported (APIs exist but buffer under the hood)
- Caching is not supported (cache modes always behave like `reload`)
- Cookies are not supported (credentials options always behave like `omit`)
- Different request modes are not fully supported (closest is `same-origin`)
- Subresource integrity is not validated (integrity metadata is ignored)
- FormData API is not supported
- **Response payload has a 4.5 MB size limit**

---

### `remoteFetchAsync(url, init)`

**⚠️ Scripting Extension only**

**Type:** `async function (url: string | Request, init?: object) => Promise<RemoteResponse>`

If using `fetch` normally doesn't work, you can try replacing it with `remoteFetchAsync`. This makes the request from Airtable's servers instead of your browser, which is useful if the API has CORS restrictions (these don't apply outside of the browser).

**Parameters:**
- `url` *(string | Request)* - The URL to fetch
- `init` *(object, optional)* - Request options

**Example:**
```javascript
let response = await remoteFetchAsync('https://api.example.com/data', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer token123'
    }
});
console.log(await response.json());
```

---

## Secrets API

The Secrets API allows you to securely access user-defined secret values (like API keys and passwords) in automation scripts.

### `input.secret(key)`

**⚠️ Automations only** *(Not available in scripting extensions)*

**Type:** `function (key: string) => string`

Retrieves a secret value by its key. Secrets are passed to the automation script and accessed using this function.

**Parameters:**
- `key` *(string)* - The secret key to retrieve

**Example:**
```javascript
// Retrieve a secret
const apiKey = input.secret('API_KEY');
const dbPassword = input.secret('DATABASE_PASSWORD');

// Use the secret in an API call
let response = await fetch('https://api.example.com/data', {
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
});
```

---

### Configuring Secrets

To use secrets in your automation:

1. Click **'Add existing secret'** within the **'Secrets'** section
2. Specify which secrets to access
3. Editable secret names will be shown in the UI
4. Reference the secrets in your script using `input.secret()`

---

### Important Security Notes

**Purpose:** The `input.secret` function securely stores sensitive data like API keys and passwords, allowing you to access them in scripts without hardcoding.

**⚠️ Security Warnings:**
- Referencing secrets in your script will **lock editing** to only users who can access those secrets
- Handle secret values with care to maintain security and confidentiality
- Secrets are **limitedly redacted** from console functions like `console.log` to prevent accidental exposure
- **Never log or output secret values** to avoid exposure
- **Never pass secrets to untrusted external APIs**

**Example - Secure Usage:**
```javascript
// ✅ GOOD: Use secret without logging it
const apiKey = input.secret('API_KEY');
let response = await fetch('https://api.example.com/data', {
    headers: {'Authorization': `Bearer ${apiKey}`}
});

// ❌ BAD: Don't log secrets
// console.log(apiKey); // Don't do this!

// ✅ GOOD: Log operation success without exposing secret
console.log('API request completed successfully');
```

---

## Quick Reference

### Most Common Operations

```javascript
// Get table
let table = base.getTable("Table Name");

// Select all records
let query = await table.selectRecordsAsync({
    fields: ["Field1", "Field2"]
});

// Select single record
let record = await table.selectRecordAsync(recordId, {
    fields: ["Field1", "Field2"]
});

// Get cell value
let value = record.getCellValue("Field Name");

// Update record
await table.updateRecordAsync(recordId, {
    "Field Name": "New Value"
});

// Create record
let newId = await table.createRecordAsync({
    "Field Name": "Value"
});

// Delete record
await table.deleteRecordAsync(recordId);
```

### Important Limits

- **50 records max** per batch operation (create, update, delete)
- **100 records max** when using `recordIds` parameter in queries
- **120 seconds** script timeout (automations)
- **12 seconds** API timeout per call
- **6MB** output data limit

---

## See Also

- [Cell Values & Field Options Reference](./00-cell-values-field-options.md) - Complete field type reference
- [Fundamentals Guide](./01-airtable-scripting-fundamentals.md)
- [Common Patterns](./02-airtable-scripting-patterns.md)
- [Best Practices](./03-airtable-scripting-best-practices.md)
- [Official Airtable Docs](https://airtable.com/developers/scripting/api)

---

**Status:** Complete Reference ✅

**All Sections Documented:**
- Base API ✅
- Table API ✅
- View API ✅
- Field API ✅
- Record API ✅
- RecordQueryResult API ✅
- Cell Values & Field Options ✅ (separate document)
- Session API ✅
- Collaborator API ✅
- Input API ✅
- Output API ✅
- Fetch API ✅
- Secrets API ✅

This reference now includes all primary Airtable Scripting APIs with complete documentation, examples, and important notes for both scripting extensions and automation scripts.

**Last Updated:** 2025-10-11
