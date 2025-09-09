# Запуск

npm run dev

npm start

----------------------------------------------------------------

# API

## login 
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@email.com",
    "password": "min 6 characters"
  }'

## register 
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@email.com",
    "password": "min 6 characters"
  }'

## getNotes 
curl -X GET http://localhost:5000/api/v1/notes \
  -H "Authorization: Bearer YOUR_TOKEN"

## createNote 
curl -X POST http://localhost:5000/api/v1/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "min 10 characters",
    "text": "min 20 characters"
  }'

## updateNote 
curl -X PUT http://localhost:5000/api/v1/notes/NOTE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "min 10 characters",
    "text": "min 20 characters"
  }'

## deleteNote 
curl -X DELETE http://localhost:5000/api/v1/notes/NOTE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
