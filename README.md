# Getting Started with Energy project

### install dependencies

`npm i`

### Run the project locally

`npm start`

### The configuration for S3 deployment is prepared. I left the dev credentials for testing purposes

### Frontend Requirements:

1. Create a React application using TypeScript.
2. Implement a form for uploading CSV files containing energy and fuel usage data to an S3 bucket.
3. Display a success or failure message after the file upload.
4. Display a log of recent upload history, showing the status of each upload (success or failure) along with the timestamp. (with the current solution we don't persist the failures in the DB. The success is realtime data from the S3. Sorting is added. Pagination is easy to add, the list is ready)
5. Error handling - limited types, size limitation, error handling
