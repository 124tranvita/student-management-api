## Sign in

curl -X 'POST' \
 'https://4100.nezumi.asia/api/v1/auth/signin-admin' \
 -H 'accept: application/json' \
 -H 'Content-Type: application/json' \
 -d '{
"email": "user@example.com",
"password": "12345678"
}' | jq

## Get mentor

curl -X 'GET' \
 'https://4100.nezumi.asia/api/v1/mentor?id=64afb7a81badf4f5d21b38b3&role=0&page=1&limit=10&queryString=' \
 -H 'accept: _/_' \
 -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGFmYjdhODFiYWRmNGY1ZDIxYjM4YjMiLCJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJyb2xlcyI6ImFkbWluIiwiaWF0IjoxNzIyOTI2OTM5LCJleHAiOjE3MjM1MzE3Mzl9.eQp1_Mk01QQPmp9juOV1wivPQ_GwXe6-S2EX2OjzMXE' \ | jq
