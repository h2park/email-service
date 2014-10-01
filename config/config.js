var emailConfig = {
  mailgun : {
    apiKey : process.env.MAILGUN_API_KEY
  },
  meshblu : {
    server : process.env.MESHBLU_SERVER || 'https://meshblu.octoblu.com',
    port : process.env.MESHBLU_PORT || '443'
  }
};

module.exports = emailConfig;
