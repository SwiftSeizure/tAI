#!/bin/sh
curl -X POST \
'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB1-XC70H4aiJ3uw74YkZhJU2--Uk7-lmM' \
-H 'Content-Type: application/json' \
-d '{
"email": "testteacher1997@gmail.com",
"password": "tteach97$",
"returnSecureToken": true
}'