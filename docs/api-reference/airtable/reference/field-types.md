# Airtable Cell Values & Field Options Reference

**Purpose:** Complete reference for cell value formats and field options for all Airtable field types
**Source:** https://airtable.com/developers/scripting/api
**Last Updated:** 2025-10-11

---

## Overview

This document describes the cell value format (for reading and writing) and field options (for field configuration) for each Airtable field type.

When you read or write cell values using `record.getCellValue()` or `table.updateRecordAsync()`, the data format varies by field type. This reference shows you exactly what format to expect for each field type.

---

## Table of Contents

- [Text Fields](#text-fields)
  - [singleLineText](#singlelinetext)
  - [email](#email)
  - [url](#url)
  - [multilineText](#multilinetext)
  - [phoneNumber](#phonenumber)
  - [richText](#richtext)
- [Number Fields](#number-fields)
  - [number](#number)
  - [percent](#percent)
  - [currency](#currency)
  - [duration](#duration)
- [Select Fields](#select-fields)
  - [singleSelect](#singleselect)
  - [multipleSelects](#multipleselects)
- [Collaborator Fields](#collaborator-fields)
  - [singleCollaborator](#singlecollaborator)
  - [multipleCollaborators](#multiplecollaborators)
- [Linked Records](#linked-records)
  - [multipleRecordLinks](#multiplerecordlinks)
- [Date/Time Fields](#datetime-fields)
  - [date](#date)
  - [dateTime](#datetime)
- [Attachment Fields](#attachment-fields)
  - [multipleAttachments](#multipleattachments)
- [Other Input Fields](#other-input-fields)
  - [checkbox](#checkbox)
  - [rating](#rating)
  - [barcode](#barcode)
- [Computed Fields](#computed-fields)
  - [formula](#formula)
  - [rollup](#rollup)
  - [count](#count)
  - [multipleLookupValues](#multiplelookupvalues)
  - [autoNumber](#autonumber)
  - [createdTime](#createdtime)
  - [createdBy](#createdby)
  - [lastModifiedTime](#lastmodifiedtime)
  - [lastModifiedBy](#lastmodifiedby)
  - [externalSyncSource](#externalsyncsource)
  - [aiText](#aitext)
  - [button](#button)

---

## Text Fields

### singleLineText

A single line of text.

**Cell Format:**
```typescript
string
```

**Field Options:**
n/a

---

### email

A valid email address (e.g. `andrew@example.com`).

**Cell Format:**
```typescript
string
```

**Field Options:**
n/a

---

### url

A valid URL (e.g. `airtable.com` or `https://airtable.com/universe`).

**Cell Format:**
```typescript
string
```

**Field Options:**
n/a

---

### multilineText

A long text field that can span multiple lines. May contain "mention tokens", e.g. `<airtable:mention id="menE1i9oBaGX3DseR">@Alex</airtable:mention>`

**Cell Format:**
```typescript
string
```

**Field Options:**
n/a

---

### phoneNumber

A telephone number (e.g. `(415) 555-9876`).

**Cell Format:**
```typescript
string
```

**Field Options:**
n/a

---

### richText

A long text field with rich formatting enabled.

Returned string is formatted with markdown syntax for Airtable rich text formatting. Use this formatting when updating cell values.

**Cell Format:**
```typescript
string
```

**Field Options:**
n/a

---

## Number Fields

### number

A number.

The `precision` option indicates the number of digits shown to the right of the decimal point for this field.

**Cell Format:**
```typescript
number
```

**Field Options:**
```typescript
{
    precision: number, // from 0 to 8 inclusive
}
```

---

### percent

A percentage.

When reading from and writing to a "Percent" field, the cell value is a decimal. For example, `0` is 0%, `0.5` is 50%, and `1` is 100%.

**Cell Format:**
```typescript
number
```

**Field Options:**
```typescript
{
    precision: number, // from 0 to 8 inclusive
}
```

---

### currency

An amount of a currency.

**Cell Format:**
```typescript
number
```

**Field Options:**
```typescript
{
    precision: number, // from 0 to 7 inclusive
    symbol: string,
}
```

---

### duration

A duration of time in seconds.

The `durationFormat` string follows the moment.js structure documented [here](https://momentjs.com/docs/#/displaying/format/).

**Cell Format:**
```typescript
number // duration in seconds
```

**Field Options:**
```typescript
{
    durationFormat: 'h:mm' | 'h:mm:ss' | 'h:mm:ss.S' | 'h:mm:ss.SS' | 'h:mm:ss.SSS'
}
```

---

## Select Fields

### singleSelect

Single select allows you to select a single option from predefined options in a dropdown.

**Cell Read Format:**
```typescript
{
    id: string,
    name: string,
    color?: string,
}
```

**Cell Write Format:**
```typescript
{ id: string } | { name: string }
```

**Field Options Read Format:**
```typescript
{
    choices: Array<{
        id: string,
        name: string,
        color?: string,
    }>,
}
```

**Field Options Write Format:**
```typescript
{
    choices: Array<
        // New choice format
        | {name: string, color?: string}
        // Pre-existing choices use read format specified above
        | {id: string, name: string, color?: string}
    >
}
```

The default behavior of calling `updateOptionsAsync` on a "singleSelect" field allows choices to be added or updated, but not deleted. Therefore, you should pass all pre-existing choices in `choices` (similar to updating a "multipleSelects" field type cell value). You can do this by spreading the current choices:

**Example:**
```javascript
const selectField = table.getField('My select field');
await selectField.updateOptionsAsync({
    choices: [
        ...selectField.options.choices,
        {name: 'My new choice'},
    ],
});
```

If you want to allow choices to be deleted, you can pass an object with `enableSelectFieldChoiceDeletion: true` as the second argument. By passing this argument, any existing choices which are not passed again via `choices` will be deleted, and any cells which referenced a now-deleted choice will be cleared.

**Example:**
```javascript
const selectField = table.getField('My select field');
await selectField.updateOptionsAsync(
    {
        choices: selectField.options.choices.filter((choice) => choice.name !== 'Choice to delete'),
    },
    {enableSelectFieldChoiceDeletion: true},
);
```

---

### multipleSelects

Multiple select allows you to select one or more predefined options from a dropdown.

**⚠️ Important:** Similar to `multipleAttachments` and `multipleCollaborators`, this array-type field will override the current cell value when being updated. Be sure to spread the current cell value if you want to keep the currently selected choices.

**Cell Read Format:**
```typescript
Array<{
    id: string,
    name: string,
    color?: string,
}>
```
The currently selected choices.

**Cell Write Format:**
```typescript
Array<{id: string} | {name: string}>
```

**Field Options Read Format:**
```typescript
{
    choices: Array<{
        id: string,
        name: string,
        color?: string,
    }>,
}
```

**Field Options Write Format:**
```typescript
{
    choices: Array<
        // New choice format
        | {name: string, color?: string}
        // Pre-existing choices use read format specified above
        | {id: string, name: string, color?: string}
    >
}
```

The default behavior of calling `updateOptionsAsync` on a "multipleSelects" field allows choices to be added or updated, but not deleted. Therefore, you should pass all pre-existing choices in `choices`. You can do this by spreading the current choices:

**Example:**
```javascript
const multipleSelectField = table.getField('My multiple select field');
await multipleSelectField.updateOptionsAsync({
    choices: [
        ...multipleSelectField.options.choices,
        {name: 'My new choice'},
    ],
});
```

If you want to allow choices to be deleted, you can pass an object with `enableSelectFieldChoiceDeletion: true` as the second argument:

**Example:**
```javascript
const multipleSelectField = table.getField('My multiple select field');
await multipleSelectField.updateOptionsAsync(
    {
        choices: multipleSelectField.options.choices.filter((choice) => choice.name !== 'Choice to delete'),
    },
    {enableSelectFieldChoiceDeletion: true},
);
```

---

## Collaborator Fields

### singleCollaborator

A collaborator field lets you add collaborators to your records. Collaborators can optionally be notified when they're added. A single collaborator field has been configured to only reference one user collaborator.

See [Collaborator API](./00-official-api-reference.md#collaborator-api).

**Cell Read Format:**
```typescript
{
    id: string,
    email: string,
    name?: string,
    profilePicUrl?: string,
}
```
The currently selected user collaborator.

**Cell Write Format:**
```typescript
{
    id: string,
}
```

**Field Options Read Format:**
```typescript
{
    choices: Array<{
        id: string,
        email: string,
        name?: string,
        profilePicUrl?: string,
    }>,
}
```

**Field Options Write Format:**
Options are not required when creating a "singleCollaborator" field, and updating options is not supported.

---

### multipleCollaborators

A collaborator field lets you add collaborators to your records. Collaborators can optionally be notified when they're added. A multiple collaborator field has been configured to reference any number of user or user group collaborators.

**⚠️ Important:** Similar to `multipleAttachments` and `multipleSelects`, this array-type field will override the current cell value when being updated. Be sure to spread the current cell value if you want to keep the currently selected collaborators.

See [Collaborator API](./00-official-api-reference.md#collaborator-api).

**Cell Read Format:**
```typescript
Array<{
    id: string,
    email: string,
    name?: string,
    profilePicUrl?: string,
}>
```

The currently selected user or user group collaborators. The `email` property is either the email address of the user collaborator or an RFC 2822 mailbox-list (comma-separated list of emails) that can be used to contact all members of the user group collaborator.

**Cell Write Format:**
```typescript
Array<{ id: string }>
```

**Field Options Read Format:**
```typescript
{
    choices: Array<{
        id: string,
        email: string,
        name?: string,
        profilePicUrl?: string,
    }>,
}
```

**Field Options Write Format:**
Options are not required when creating a "multipleCollaborators" field, and updating options is not supported.

---

## Linked Records

### multipleRecordLinks

Link to another record.

**⚠️ Important:** When updating an existing linked record cell value, the specified array will overwrite the current cell value. If you want to add a new linked record without deleting the current linked records, you can spread the current cell value like so:

**Example:**
```javascript
let newForeignRecordIdToLink = 'recXXXXXXXXXXXXXX';
myTable.updateRecordAsync(myRecord, {
    'myLinkedRecordField': [
        ...myRecord.getCellValue('myLinkedRecordField'),
        { id: newForeignRecordIdToLink }
    ]
})
```

Similarly, you can clear the current cell value by passing an empty array, or remove specific linked records by passing a filtered array of the current cell value.

**Cell Read Format:**
```typescript
Array<{
    id: string,
    name: string,
}>
```

The currently linked record IDs and their primary cell values from the linked table in string format.

**Cell Write Format:**
```typescript
Array<{ id: string }>
```

**Field Options Read Format:**
```typescript
{
    // The ID of the table this field links to
    linkedTableId: string,
    // The ID of the field in the linked table that links back to this one
    inverseLinkFieldId?: string,
    // The ID of the view in the linked table to use when showing
    // a list of records to select from
    viewIdForRecordSelection?: string,
    // Whether linked records are rendered in the reverse order from the cell value in the
    // Airtable UI (i.e. most recent first)
    // You generally do not need to rely on this option.
    isReversed: boolean,
    // Whether this field prefers to only have a single linked record. While this preference
    // is enforced in the Airtable UI, it is possible for a field that prefers single linked
    // records to have multiple record links (for example, via copy-and-paste or programmatic
    // updates).
    prefersSingleRecordLink: boolean,
}
```

**Field Options Write Format:**
```typescript
{
    // The ID of the table this field links to
    linkedTableId: TableId,
    // The ID of the view in the linked table to use when showing
    // a list of records to select from
    viewIdForRecordSelection?: ViewId,
    // Note: prefersSingleRecordLink cannot be specified via programmatic field creation
    // and will be false for fields created within an app
}
```

**Note:** Creating "multipleRecordLinks" fields is supported but updating options for existing "multipleRecordLinks" fields is not supported.

---

## Date/Time Fields

### date

A date.

When reading from and writing to a date field, the cell value will always be an ISO 8601 formatted date.

The date format string follows the [moment.js structure](https://momentjs.com/docs/#/displaying/format/).

**Cell Read Format:**
```typescript
string // ISO 8601 date
```

**Cell Write Format:**
```typescript
Date | string
```

**Field Options Read Format:**
```typescript
{
    dateFormat:
        | {name: 'local', format: 'l'}
        | {name: 'friendly', format: 'LL'}
        | {name: 'us', format: 'M/D/YYYY'}
        | {name: 'european', format: 'D/M/YYYY'}
        | {name: 'iso', format: 'YYYY-MM-DD'}
}
```

**Field Options Write Format:**
```typescript
{
    dateFormat:
        // Format is optional, but must match name if provided.
        | {name: 'local', format?: 'l'}
        | {name: 'friendly', format?: 'LL'}
        | {name: 'us', format?: 'M/D/YYYY'}
        | {name: 'european', format?: 'D/M/YYYY'}
        | {name: 'iso', format?: 'YYYY-MM-DD'}
}
```

---

### dateTime

A date field configured to also include a time.

When reading from and writing to a date time field, the cell value will always be an ISO 8601 formatted date time.

The date and time format strings follow the [moment.js structure](https://momentjs.com/docs/#/displaying/format/).

For a `dateTime` field configured with a non-UTC or client time zone like `America/Los_Angeles`, ambiguous string inputs like `"2020-09-05T07:00:00"` and `"2020-09-08"` will be interpreted according to the `timeZone` of the field, and non-ambiguous string inputs with zone offset like `"2020-09-05T07:00:00.000Z"` and `"2020-09-08T00:00:00-07:00"` will be interpreted as the underlying timestamp.

**Cell Read Format:**
```typescript
string // ISO 8601 datetime
```

**Cell Write Format:**
```typescript
Date | string
```

**Field Options Read Format:**
```typescript
{
    dateFormat:
        | {name: 'local', format: 'l'}
        | {name: 'friendly', format: 'LL'}
        | {name: 'us', format: 'M/D/YYYY'}
        | {name: 'european', format: 'D/M/YYYY'}
        | {name: 'iso', format: 'YYYY-MM-DD'},
    timeFormat:
        | {name: '12hour', format: 'h:mma'}
        | {name: '24hour', format: 'HH:mm'},
    timeZone: 'utc' | 'client' | 'Africa/Abidjan' | 'Africa/Accra' | ... // (see full timezone list below)
}
```

**Field Options Write Format:**
```typescript
{
    dateFormat:
        // Format is optional, but must match name if provided.
        | {name: 'local', format?: 'l'}
        | {name: 'friendly', format?: 'LL'}
        | {name: 'us', format?: 'M/D/YYYY'}
        | {name: 'european', format?: 'D/M/YYYY'}
        | {name: 'iso', format?: 'YYYY-MM-DD'},
    timeFormat:
        // Format is optional, but must match name if provided.
        | {name: '12hour', format?: 'h:mma'}
        | {name: '24hour', format?: 'HH:mm'},
    timeZone: 'utc' | 'client' | 'Africa/Abidjan' | 'Africa/Accra' | ... // (see full timezone list below)
}
```

**Supported Time Zones:** `'utc'`, `'client'`, plus all IANA time zone identifiers (e.g., `'America/New_York'`, `'Europe/London'`, `'Asia/Tokyo'`, etc.)

---

## Attachment Fields

### multipleAttachments

Attachments allow you to add images, documents, or other files which can then be viewed or downloaded.

**⚠️ Important:** When updating an existing attachment cell value, the specified array will overwrite the current cell value. If you want to add a new attachment without deleting the current attachments, you can spread the current cell value like so:

**Example:**
```javascript
let newAttachmentUrl = 'example.com/cute-cats.jpeg';
myTable.updateRecordAsync(myRecord, {
  'myAttachmentField': [
      ...myRecord.getCellValue('myAttachmentField'),
      { url: newAttachmentUrl }
  ]
})
```

Similarly, you can clear the current cell value by passing an empty array, or remove specific attachments by passing a filtered array of the current cell value.

**Note:** When you pass an existing attachment, you must pass the full attachment object. New attachments only require the `url` property. You can optionally pass the `filename` property to give it a readable name.

**⚠️ Attachment URLs returned will expire 2 hours after being returned from our API.** If you want to persist the attachments, we recommend downloading them instead of saving the URL. See [this support article](https://support.airtable.com/docs/attachment-urls) for more information.

**Cell Read Format:**
```typescript
Array<{
    // unique attachment id
    id: string,
    // url, e.g. "https://v5.airtableusercontent.com/foo"
    // Note: Attachment URLs expire 2 hours after being returned from our API.
    url: string,
    // filename, e.g. "foo.jpg"
    filename: string,
    // file size, in bytes
    size?: number,
    // content type, e.g. "image/jpeg"
    type?: string,
    // thumbnails if available
    thumbnails?: {
        small?: {
            url: string,
            width: number,
            height: number,
        },
        large?: {
            url: string,
            width: number,
            height: number,
        },
        full?: {
            url: string,
            width: number,
            height: number,
        },
    },
}>
```

**Cell Write Format:**
```typescript
Array<{
    url: string,
    filename?: string,
}>
```

**Field Options Read Format:**
```typescript
{
    // Whether attachments are rendered in the reverse order from the cell value in the
    // Airtable UI (i.e. most recent first)
    // You generally do not need to rely on this option.
    isReversed: boolean,
}
```

**Field Options Write Format:**
Options are not required when creating a "multipleAttachments" field, and updating options is not supported.

---

## Other Input Fields

### checkbox

A checkbox.

This field is `true` when checked and `null` when unchecked.

**Cell Read Format:**
```typescript
true | null
```

You can write to the cell with `false`, but the read value will still be `null` (unchecked).

**Cell Write Format:**
```typescript
boolean | null
```

**Field Options:**
```typescript
{
    // an icon name
    icon: 'check' | 'star' | 'heart' | 'thumbsUp' | 'flag' | 'dot',
    // the color of the checkbox
    color: 'yellowBright' | 'orangeBright' | 'redBright' | 'pinkBright' | 'purpleBright' | 'blueBright' | 'cyanBright' | 'tealBright' | 'greenBright' | 'grayBright',
}
```

**Note:** Bases on a free or plus plan are limited to using the `'check'` icon and `'greenBright'` color.

---

### rating

A rating (e.g. stars out of 5).

**Cell Format:**
```typescript
number
```

**Field Options:**
```typescript
{
    // the icon name used to display the rating
    icon: 'star' | 'heart' | 'thumbsUp' | 'flag' | 'dot',
    // the maximum value for the rating, from 1 to 10 inclusive
    max: number,
    // the color of selected icons
    color: 'yellowBright' | 'orangeBright' | 'redBright' | 'pinkBright' | 'purpleBright' | 'blueBright' | 'cyanBright' | 'tealBright' | 'greenBright' | 'grayBright',
}
```

**Note:** Bases on a free or plus plan are limited to using the `'star'` icon and `'yellowBright'` color.

---

### barcode

Use the Airtable iOS or Android app to scan barcodes.

**Cell Format:**
```typescript
{
    // the text value of the barcode
    text: string,
    // the type of barcode
    type?: string,
}
```

**Field Options:**
n/a

---

## Computed Fields

### formula

Compute a value in each record based on other fields in the same record.

**Cell Read Format:**
Check `options.result` to know the resulting field type.

```typescript
any
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    // false if the formula contains an error
    isValid: boolean,
    // the other fields in the record that are used in the formula
    referencedFieldIds: Array<string>,
    // the resulting field type and options returned by the formula
    result: {
        // the field type of the formula result
        type: string,
        // that type's options
        options?: any,
    },
}
```

**Field Options Write Format:**
Creating or updating "formula" fields is not allowed.

---

### rollup

A rollup allows you to summarize data from records that are linked to this table.

**Cell Read Format:**
Check `options.result` to know the resulting field type.

```typescript
any
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    // false if the formula contains an error
    isValid: boolean,
    // the linked record field in this table that this field is summarizing
    recordLinkFieldId: string,
    // the field id in the linked table that this field is summarizing
    fieldIdInLinkedTable: string,
    // the other fields in the record that are used in the formula
    referencedFieldIds: Array<string>,
    // the resulting field type and options returned by the formula
    result: {
        // the field type of the formula result
        type: string,
        // that type's options
        options?: any,
    },
}
```

**Field Options Write Format:**
Creating or updating "rollup" fields is not allowed.

---

### count

Count the number of linked records.

**Cell Read Format:**
```typescript
number
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    // is the field currently valid (e.g. false if the linked record
    // field has been changed to a different field type)
    isValid: boolean,
    // the linked record field in this table that we're counting
    recordLinkFieldId: string,
}
```

**Field Options Write Format:**
Creating or updating "count" fields is not allowed.

---

### multipleLookupValues

Lookup a field on linked records.

**Cell Read Format:**
Check `options.result` to know the resulting field type.

```typescript
Array<any>
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    // The field in the linked table that this field is looking up
    fieldIdInLinkedTable: string,
    // is the field currently valid (e.g. false if the linked record field has been deleted)
    isValid: boolean,
    // The linked record field in the current table
    recordLinkFieldId: string,
    result: {
        // The type of the field in the linked table
        type: string,
        // For field options, refer to the section for the relevant field type
        options?: object,
    },
}
```

**Field Options Write Format:**
Creating or updating "multipleLookupValues" fields is not allowed.

---

### autoNumber

Automatically incremented unique counter for each record.

**Cell Read Format:**
```typescript
number
```

**Cell Write Format:**
This field is read-only.

**Field Options:**
n/a

---

### createdTime

The time the record was created in UTC.

When reading from a "Created time" field, the cell value will always be an ISO 8601 formatted date time.

**Cell Read Format:**
```typescript
string // ISO 8601 datetime
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    result: {
        type: 'date' | 'dateTime',
        options: DateOrDateTimeFieldOptions,
    },
}
```

See [date](#date) and [dateTime](#datetime) for detailed field options.

**Field Options Write Format:**
Creating or updating "createdTime" fields is not supported.

---

### createdBy

The collaborator who created the record.

**Cell Read Format:**
```typescript
{
    id: string,
    email: string,
    name?: string,
    profilePicUrl?: string,
}
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    choices: Array<{
        id: string,
        email: string,
        name?: string,
        profilePicUrl?: string,
    }>,
}
```

**Field Options Write Format:**
Creating or updating "createdBy" fields is not allowed.

---

### lastModifiedTime

Shows the date and time that a record was most recently modified in any editable field or just in specific editable fields.

When reading from a "Last modified time" field, the cell value will always be an ISO 8601 formatted date time.

**Cell Read Format:**
```typescript
string // ISO 8601 datetime
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    // false if the formula contains an error
    isValid: boolean,
    // the fields to check the last modified time of
    referencedFieldIds: Array<string>,
    // the cell value result type
    result: {
        type: 'date' | 'dateTime',
        options: DateOrDateTimeFieldOptions,
    },
}
```

See [date](#date) and [dateTime](#datetime) for detailed field options.

**Field Options Write Format:**
Creating or updating "lastModifiedTime" fields is not supported.

---

### lastModifiedBy

Shows the collaborator who most recently modified any editable field or just in specific editable fields.

**Cell Read Format:**
```typescript
{
    id: string,
    email: string,
    name?: string,
    profilePicUrl?: string,
}
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    referencedFieldIds: Array<string>,
    choices: Array<{
        id: string,
        email: string,
        name?: string,
        profilePicUrl?: string,
    }>,
}
```

**Field Options Write Format:**
Creating or updating "lastModifiedBy" fields is not allowed.

---

### externalSyncSource

Shows the name of the source that a record is synced from. This field is only available on synced tables.

**Cell Read Format:**
```typescript
{
    id: string,
    name: string,
    color?: string,
}
```

The name of the source the record is synced from.

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    choices: Array<{
        id: string,
        name: string,
        color?: string,
    }>,
}
```

Every choice represents a sync source, and choices are added or removed automatically as sync sources are added or removed. Choice names and colors are user-configurable.

**Field Options Write Format:**
Creating or updating "externalSyncSource" fields is not supported.

---

### aiText

Long text (with AI output enabled).

AI generated text can depend on other cells in the same record and can be in a loading state.

**Cell Read Format:**
```typescript
{
    state: 'empty' | 'loading' | 'generated' | 'error',
    value: string,
    isStale: boolean,
    // Only populated if state is 'error'
    errorType?: string,
}
```

**Cell Write Format:**
This field is read-only.

**Field Options Read Format:**
```typescript
{
    prompt?: Array<string | {field: {fieldId: string}}>,
    referencedFieldIds?: Array<string>,
}
```

**Field Options Write Format:**
Creating or updating "aiText" fields is not allowed.

---

### button

A button that can be clicked from the Airtable UI to open a URL or open an extension.

You cannot currently programmatically interact with a button field from a script, but you can use your scripting extension with the "Run script" button field action. The first `input.recordAsync` call in your script will be skipped, and the button's record returned.

You can use the Record picker example as a starting point for a button field script.

**Cell Read Format:**
```typescript
{
    // The label of the button
    label: string,
    // URL the button opens, or URL of the extension that the button opens.
    // Null when the URL formula has become invalid.
    url: string | null,
}
```

**Cell Write Format:**
This field is read-only.

**Field Options:**
n/a

---

## Quick Reference

### Array-Type Fields (Override Behavior)

These field types **override** the current cell value when updated. To preserve existing values, spread the current cell value:

- `multipleSelects`
- `multipleCollaborators`
- `multipleRecordLinks`
- `multipleAttachments`

**Example:**
```javascript
// Add to existing values (don't replace)
await table.updateRecordAsync(record, {
    'Tags': [
        ...record.getCellValue('Tags'),
        {name: 'New Tag'}
    ]
});
```

### Read-Only Fields

These field types cannot be written to programmatically:

- `formula`
- `rollup`
- `count`
- `multipleLookupValues`
- `autoNumber`
- `createdTime`
- `createdBy`
- `lastModifiedTime`
- `lastModifiedBy`
- `externalSyncSource`
- `aiText`
- `button`

---

## See Also

- [Official API Reference](./00-official-api-reference.md)
- [Fundamentals Guide](./01-airtable-scripting-fundamentals.md)
- [Common Patterns](./02-airtable-scripting-patterns.md)
- [Best Practices](./03-airtable-scripting-best-practices.md)
- [Official Airtable Docs](https://airtable.com/developers/scripting/api)

---

**Last Updated:** 2025-10-11
