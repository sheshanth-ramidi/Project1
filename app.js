const express = require('express');
const app = express();
 
app.get('/', (req, res) => {
  res.send('Hello from Jenkins → ECR → EKS CI/CD Pipeline');
});
 
app.listen(3000);
