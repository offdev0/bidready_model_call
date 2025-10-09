# model_api

## Setup

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the server:
   ```powershell
   npm start
   ```

## API Usage

POST `/api/detect`

- Body: `{ "image": "<base64 string>" }`
- Returns: Roboflow API response

## Folder Structure

- `index.js` - Express server entry
- `routes/` - API route definitions
- `controllers/` - Route handlers
- `services/` - Third-party API logic

Replace `<base64 string>` with your image encoded in base64.
