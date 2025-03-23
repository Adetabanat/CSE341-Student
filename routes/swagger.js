const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    oauth2RedirectUrl: "https://cse341-student.onrender.com/api-docs/oauth2-redirect.html",
    oauth: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      appName: "Student Records API"
    }
  }
}));

module.exports = router;
