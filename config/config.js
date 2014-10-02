var emailConfig = {
  mailgun : {
    apiKey : process.env.MAILGUN_API_KEY
  },
  meshblu : {
    server : process.env.MESHBLU_SERVER || 'meshblu.octoblu.com',
    port : process.env.MESHBLU_PORT || '80'
  }
};

module.exports = emailConfig;
