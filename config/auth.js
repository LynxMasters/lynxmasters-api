// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'twitchAuth' : {
        'clientID'        : 'b83413k7rg3fstv11tx5v7elta4t6l', // your App ID
        'clientSecret'    : 'yj9xcmqdneuaz8kjwqsv6er1p0kxeq', // your App Secret
        'callbackURL'     : 'http://localhost:8081/auth/twitch/callback'

    },

    'twitterAuth' : {
        'consumerKey'        : 'm9y0YNJfgwJafm5qKeMhu7xgC',
        'consumerSecret'     : 'unSRzTB4KchtD1lb23zMn9xcWvErukoTtdjradDHp6YvGiND3g',
        'callbackURL'        : 'http://localhost:8081/auth/twitter/callback'
    },

    'redditAuth' : {
        'clientID'         : 'h9NwYUZGn65RJw',
        'clientSecret'     : 'vOGJ1itvyfWHE_ZxiA5kYKGWl-Q',
        'callbackURL'      : 'http://localhost:8081/auth/reddit/callback'
    }

};
