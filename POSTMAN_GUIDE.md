# Postman Setup Guide

## How to Import and Use the Postman Collection

### Step 1: Import the Collection

1. **Open Postman** (Download from https://www.postman.com/ if you don't have it)

2. **Import the Collection**
   - Click "Import" button (top left)
   - Select "File" tab
   - Choose: `AI_Appointment_Scheduler.postman_collection.json`
   - Click "Import"

### Step 2: Test the Requests

**The collection includes 12 sample requests:**

1. **Health Check** - Verify server is running
2. **Simple Appointment** - Tomorrow at 10am
3. **Cardiology** - Specific date (January 20th)
4. **Neurologist** - Relative date (next Friday)
5. **Dermatology** - 24-hour format (14:30)
6. **Orthopedics** - Relative (in 5 days)
7. **General** - Using "noon"
8. **Cardiologist** - Specialist name instead of department
9. **Complex Request** - Future date with details
10. **Edge Case** - Missing department
11. **Image Upload** - OCR test
12. **Case Insensitive** - ALL CAPS test

### Step 3: Run Individual Requests

1. Click on any request (e.g., "1. Simple Appointment - Tomorrow")
2. Click **"Send"** button
3. View the response in the bottom panel

**Example Response:**

```json
{
  "step1_ocr": {
    "raw_text": "Book a dentist appointment tomorrow at 10am",
    "confidence": 1
  },
  "step2_extraction": {
    "entities": {
      "parsedDate": "2026-01-17T04:30:00.000Z",
      "date_phrase": "tomorrow",
      "department": "dentist",
      "time_phrase": "10am"
    },
    "confidence": 0.95
  },
  "step3_normalization": {
    "normalized": {
      "date": "2026-01-17",
      "time": "10:00",
      "tz": "Asia/Kolkata"
    },
    "confidence": 0.95
  },
  "appointment": {
    "department": "Dentist",
    "date": "2026-01-17",
    "time": "10:00",
    "tz": "Asia/Kolkata"
  },
  "status": "ok"
}
```

### Step 4: Run All Tests

1. Click on the collection name
2. Click "Run" button
3. Select all requests
4. Click "Run AI Appointment Scheduler API"
5. See all results in sequence

### Step 5: Test Image Upload

For request #11 (Image Upload):

1. Click "11. Image Upload (OCR)"
2. Go to "Body" tab
3. Click on "Select Files" next to "image"
4. Choose an image with appointment text
5. Click "Send"

**Sample Image Text:**

```
Book dentist appointment
January 20th at 3pm
```

### Tips for Testing

#### Modify Requests

- Click on any request
- Edit the JSON body
- Try different:
  - Departments: dentist, cardiology, neurology, dermatology, orthopedics
  - Dates: tomorrow, next Monday, in 5 days, January 20th
  - Times: 3pm, 14:30, noon, midnight

#### Save Responses

- Click "Save Response" next to any result
- Use for documentation or demos

#### Export Results

- Run collection
- Click "Export Results"
- Save as JSON or HTML

### Common Test Scenarios

**✅ Success Cases:**

```json
{ "text": "Book dentist tomorrow at 10am" }
{ "text": "Schedule cardiology on Friday at 3pm" }
{ "text": "Book neurologist next Monday at 2:30pm" }
```

**⚠️ Needs Clarification Cases:**

```json
{ "text": "Book appointment tomorrow" }         // Missing department
{ "text": "Book dentist appointment" }         // Missing date
{ "text": "Schedule for next week" }           // Missing department & time
```

### Expected Response Statuses

- **"ok"** - Successfully parsed all information
- **"needs_clarification"** - Missing required info (department or date)
- **"error"** - Invalid input or server error

### Screenshot for Documentation

When running the collection:

1. Click "Run Collection"
2. Let all requests complete
3. Take screenshot showing:
   - List of requests
   - Pass/fail status
   - Response times

This makes great documentation for your submission!

---

## Quick Reference

**Endpoint:** `POST http://localhost:3000/api/v1/parse`

**Headers:**

```
Content-Type: application/json
```

**Body (Text):**

```json
{
  "text": "Book appointment here"
}
```

**Body (Image):**

- Form-data
- Key: "image"
- Type: File

---

## For Video Recording

1. Open Postman
2. Show the collection with 12 requests
3. Run 2-3 examples:
   - Simple case (dentist tomorrow)
   - Complex case (cardiologist on specific date)
   - Edge case (missing department)
4. Show the responses
5. Highlight the timezone conversion

This demonstrates your API is fully working!
