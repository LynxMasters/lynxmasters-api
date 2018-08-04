// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

     'reddit' : {
        'clientID'         : 'h9NwYUZGn65RJw',
        'clientSecret'     : 'vOGJ1itvyfWHE_ZxiA5kYKGWl-Q',
        'callbackURL'      : 'http://localhost:8081/auth/reddit/callback',
        'authorizeURL': 'https://www.reddit.com/api/v1/authorize?client_id=h9NwYUZGn65RJw&response_type=code&redirect_uri=http://localhost:8081/auth/reddit/callback&duration=permanent&scope=identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,save,submit,subscribe,vote&state=sfdfasdffdsfdfdfasfdffdasfdffadffsafsf'
    },

    'twitch' : {
        'clientID'        : 'b83413k7rg3fstv11tx5v7elta4t6l', // your App ID
        'clientSecret'    : 'yj9xcmqdneuaz8kjwqsv6er1p0kxeq', // your App Secret
        'callbackURL'     : 'http://localhost:8081/auth/twitch/callback',
        'authorizeURL': 'https://id.twitch.tv/oauth2/authorize?client_id=b83413k7rg3fstv11tx5v7elta4t6l&redirect_uri=http://localhost:8081/auth/twitch/callback&response_type=code&scope=user_read+user_subscriptions+user_follows_edit&state=dfsdafsdfsdafafdsdfdaf'
    },
        
    'twitter' : {
        'consumerKey'        : 'm9y0YNJfgwJafm5qKeMhu7xgC',
        'consumerSecret'     : 'unSRzTB4KchtD1lb23zMn9xcWvErukoTtdjradDHp6YvGiND3g',
        'callbackURL'        : 'http://localhost:8081/auth/twitter/callback'
    },

};