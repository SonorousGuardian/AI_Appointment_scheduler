# API Usage & Sample Requests

## Base URL

**Local:** `http://localhost:3000`  
**Public (ngrok):** `https://your-ngrok-url.ngrok-free.dev`

## 📸 Postman Examples

![Dentist Appointment](screenshots/postman-dentist.png)
_Example: Booking a dentist appointment_

![ENT Specialist](screenshots/postman-ent.png)
_Example: Booking an ENT specialist_

![General Checkup](screenshots/postman-general.png)
_Example: Booking a general checkup_

---

## Endpoints

### 1. Health Check

**GET** `/health`

**curl:**

```bash
curl http://localhost:3000/health
```

**Response:**

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### 2. Parse Appointment (Text)

**POST** `/api/v1/parse`

#### Sample Requests:

**Example 1: Dentist Tomorrow**

```bash
curl -X POST http://localhost:3000/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Book dentist appointment tomorrow at 10am"}'
```

**Example 2: Card iologist Specific Date**

```bash
curl -X POST http://localhost:3000/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Book a cardiologist on Friday at 3pm"}'
```

**Example 3: ENT Specialist**

```bash
curl -X POST http://localhost:3000/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Book ENT specialist tomorrow at 9am"}'
```

**Example 4: Ophthalmologist**

```bash
curl -X POST http://localhost:3000/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"See eye doctor next Monday at 2:30pm"}'
```

**Example 5: General Practitioner**

```bash
curl -X POST http://localhost:3000/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Book GP on January 20th at 11am"}'
```

**Success Response:**

```json
{
  "step1_ocr": {
    "raw_text": "Book dentist appointment tomorrow at 10am",
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
    "department": "Dentistry",
    "date": "2026-01-17",
    "time": "10:00",
    "tz": "Asia/Kolkata"
  },
  "status": "ok"
}
```

---

### 3. Parse Appointment (Image/OCR)

**POST** `/api/v1/parse`

**curl:**

```bash
curl -X POST http://localhost:30 00/api/v1/parse \
  -F "image=@/path/to/your/image.jpg"
```

**Note:** Upload an image containing appointment text

---

## Postman Collection

### Request 1: Health Check

```
Method: GET
URL: {{baseUrl}}/health
```

### Request 2: Parse Text Appointment

```
Method: POST
URL: {{baseUrl}}/api/v1/parse
Headers: Content-Type: application/json
Body (raw JSON):
{
  "text": "Book dentist appointment tomorrow at 10am"
}
```

### Request 3: Parse Image

```
Method: POST
URL: {{baseUrl}}/api/v1/parse
Body: form-data
  Key: image
  Type: File
  Value: [Select your image file]
```

### Variables

```
baseUrl: http://localhost:3000
```

---

## Edge Cases

### Missing Department

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Book appointment tomorrow at 3pm"}'
```

**Response:**

```json
{
  "status": "needs_clarification",
  "message": "Ambiguous date/time or department"
}
```

### Missing Date/Time

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Book dentist appointment"}'
```

**Response:**

```json
{
  "status": "needs_clarification",
  "message": "Ambiguous date/time or department"
}
```

---

## Rate Limiting

- **Limit:** 30 requests per minute per IP
- **Exceeded Response:**

```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later.",
  "errorCode": "RATE_LIMIT_EXCEEDED"
}
```

---

## Supported Departments

| Input                         | Normalized Output |
| ----------------------------- | ----------------- |
| dentist, dental               | Dentistry         |
| cardiologist, cardiology      | Cardiology        |
| neurologist, neurology        | Neurology         |
| ENT, ent specialist           | Otolaryngology    |
| eye doctor, ophthalmologist   | Ophthalmology     |
| GP, general practitioner      | General Practice  |
| pediatrician, child doctor    | Pediatrics        |
| psychiatrist                  | Psychiatry        |
| oncologist, cancer specialist | Oncology          |
| ...and 60+ more               |                   |

---

## Testing the Public Demo

If using ngrok:

Replace `http://localhost:3000` with your ngrok URL:

```bash
curl -X POST https://your-url.ngrok-free.dev/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Book dentist tomorrow at 10am"}'
```

---

## Quick Test Script

Save as `test-api.sh`:

```bash
#!/bin/bash
BASE_URL="http://localhost:3000"

# Test 1: Health Check
echo "Testing Health Check..."
curl $BASE_URL/health
echo -e "\n"

# Test 2: Parse Appointment
echo "Testing Parse Appointment..."
curl -X POST $BASE_URL/api/v1/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"Book dentist tomorrow at 10am"}'
echo -e "\n"
```

Run: `bash test-api.sh`
