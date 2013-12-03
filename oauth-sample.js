var ids = {
    twitter: {
	consumerKey: 'YOUR_CONSUMER_KEY',
	consumerSecret: 'YOUR_CONSUMER_SECRET',
	callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
    },
    facebook: {
	appID: 'YOUR_APP_ID',
	appSecret: 'YOUR_APP_SECRET',
	callbackURL: 'http://127.0.0.1:3000/auth/facebook/callback'
    }
}

module.exports = ids;

