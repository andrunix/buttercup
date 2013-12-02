
/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var config = require('./oauth');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var User = require('./models/User.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('buttercups'));
app.use(express.session());

// Order is important!
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', 
	{
	    successReturnToOrRedirect: '/account', 
	    failureRedirect: '/' 
	})
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook',
	{
	    successReturnToOrRedirect: '/account',
	    failureRedirect: '/'
	})
);

passport.use(new FacebookStrategy({
    clientID: config.facebook.appID,
    clientSecret: config.facebook.appSecret,
    callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
	process.nextTick(function() {
	    return done(null, profile);
	});
    }
));

passport.use(new LocalStrategy(function(username, password, done) {
    // lookup the user in MongoDB
    User.findOne({ username: username }, function(err, user) {
	if (err) return done(err);
	if (!user) {
	    return done(null, false, { message: 'Incorrect username.' });
	}
	// of course we need to encrypt that password
	if (user.password !== password) {
	    return done(null, false, { message: 'Incorrect password.' });
	}
	return done(null, user);
    });
}));

passport.use(new TwitterStrategy({
	    consumerKey: config.twitter.consumerKey,
	    consumerSecret: config.twitter.consumerSecret,
	    callbackURL: config.twitter.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
	    process.nextTick(function() {
		return done(null, profile);
	    });
	}
));

// routes
app.get('/', routes.index);

app.get('/account', ensureLoggedIn('/'), 
	function(req, res) {
	    res.render('account', { user: req.user.username });
	});

app.post('/login', 
	 passport.authenticate('local', { successRedirect: '/account', 
					  failureRedirect: '/' })
);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
	
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


