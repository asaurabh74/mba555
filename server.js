"use strict";

const { APP_ID } = require('@angular/core');

var express     = require('express'),
    session     = require ('express-session'),
    bodyParser  = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    fs          = require('fs'), 
    OAuth = require('oauth').OAuth,
    app         = express(), 
    Jiralib     = require('./jiraclient'),
    JiraAdminlib = require('./jiraAdminClient'),
    customers   = JSON.parse(fs.readFileSync('data/customers.json', 'utf-8')),
    states      = JSON.parse(fs.readFileSync('data/states.json', 'utf-8')),
    inContainer = process.env.CONTAINER,
    inAzure = process.env.WEBSITE_RESOURCE_GROUP,
    useNginx = process.env.USE_NGINX,
    port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.session_secret, 
    expires: new Date(Date.now() + 30*60*1000),
    maxAge: 30*60*1000
}));

var privateKeyData = fs.readFileSync(process.env.consumer_private_key_file, "utf8");
var jiraAdminClient = new JiraAdminlib();
var consumer = 
  new OAuth(`${process.env.jira_host_base_url}/plugins/servlet/oauth/request-token`,
                  `${process.env.jira_host_base_url}/plugins/servlet/oauth/access-token`,
                  process.env.consumer_key,
				  process.env.consumer_secret,
                  "1.0",
                  `${process.env.application_url}/sessions/callback`,
                  "RSA-SHA1",
				  null,
				  privateKeyData);

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, X-XSRF-TOKEN, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

//The dist folder has our static resources (index.html, css, images)
if (!inContainer) {
    app.use(express.static(__dirname + '/dist')); 
    console.log(__dirname);
}

function auth(req, res, next) {
    var loggedIn;
    if (req.session
        && req.session.oauthAccessToken
        && req.session.oauthAccessTokenSecret) {
            loggedIn = true;
    } 
    if (!loggedIn) {
        return res.status(401).json({ message: 'User is not logged in' });
    }
    next();
}

function getJiraClient(req) {
    var opts = {
        consumer_key: process.env.consumer_key,
        private_key: privateKeyData,
        token: req.session.oauthAccessToken,
        token_secret: req.session.oauthAccessTokenSecret
       };
    return new Jiralib(opts, jiraAdminClient);
}

app.get('/api/admin/fields', auth, (req, res) => {
    res.json(jiraAdminClient.getCustomFieldNamesJSON());
});

app.get('/api/candidate/fields', auth, (req, res) => {
    var jiraClient = getJiraClient(req);
    res.json(jiraClient.getSelectedFieldNames());
});

app.get('/api/auth/currentUser', auth, (req, res) => {
    var jiraClient = getJiraClient(req);
    res.json(jiraClient.getLoggedInUser());
});

app.get('/api/customers/page/:skip/:top', auth, (req, res) => {
   
    var jiraClient = getJiraClient(req);

    const topVal = req.params.top,
    jql = req.query? req.query.query : "" || "",
    skipVal = req.params.skip,
    skip = (isNaN(skipVal)) ? 0 : +skipVal;  
    let top = (isNaN(topVal)) ? 10 : skip + (+topVal);

    jiraClient.getCandidates(jql, skip, top-skip).then(pagedCustomers=>{
        
        if (top > pagedCustomers.totalResults) {
            top = skip + (pagedCustomers.totalResults - skip);
        }
        console.log(`Skip: ${skip} Top: ${top}`);
        res.setHeader('X-InlineCount', pagedCustomers.totalResults);
        res.json(pagedCustomers.candidates);

    }).catch(error=>{
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    });
});

app.get('/api/customers', (req, res) => {
    res.json(customers);
});

app.get('/api/customers/:id', (req, res) => {
    let customerId = +req.params.id;
    let selectedCustomer = null;
    for (let customer of customers) {
        if (customer.id === customerId) {
           // found customer to create one to send
           selectedCustomer = {};
           selectedCustomer = customer;
           break;
        }
    }  
    res.json(selectedCustomer);
});

app.post('/api/customers', (req, res) => {
    let postedCustomer = req.body;
    let maxId = Math.max.apply(Math,customers.map((cust) => cust.id));
    postedCustomer.id = ++maxId;
    postedCustomer.gender = (postedCustomer.id % 2 === 0) ? 'female' : 'male';
    customers.push(postedCustomer);
    res.json(postedCustomer);
});

app.put('/api/customers/:id', (req, res) => {
    let putCustomer = req.body;
    let id = +req.params.id;
    let status = false;

    //Ensure state name is in sync with state abbreviation 
    const filteredStates = states.filter((state) => state.abbreviation === putCustomer.state.abbreviation);
    if (filteredStates && filteredStates.length) {
        putCustomer.state.name = filteredStates[0].name;
        console.log('Updated putCustomer state to ' + putCustomer.state.name);
    }

    for (let i=0,len=customers.length;i<len;i++) {
        if (customers[i].id === id) {
            customers[i] = putCustomer;
            status = true;
            break;
        }
    }
    res.json({ status: status });
});

app.delete('/api/customers/:id', function(req, res) {
    let customerId = +req.params.id;
    for (let i=0,len=customers.length;i<len;i++) {
        if (customers[i].id === customerId) {
           customers.splice(i,1);
           break;
        }
    }  
    res.json({ status: true });
});

app.get('/api/orders/:id', function(req, res) {
    let customerId = +req.params.id;
    for (let cust of customers) {
        if (cust.customerId === customerId) {
            return res.json(cust);
        }
    }
    res.json([]);
});

app.get('/api/states', (req, res) => {
    res.json(states);
});


app.get('/api/auth/isLoggedIn', (req, res) => {
    var loggedIn = false;
    if (req.session
        && req.session.oauthAccessToken
        && req.session.oauthAccessTokenSecret) {
            loggedIn = true;
    } 
    res.json(loggedIn);
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json(true);
});

app.get('/api/auth/login', (req, res) => {
    // var userLogin = req.body;
    // //Add "real" auth here. Simulating it by returning a simple boolean.
    consumer.getOAuthRequestToken(
		function(error, oauthToken, oauthTokenSecret, results) {
    		if (error) {
				console.log(error.data);
      			res.send('Error getting OAuth access token');
			}
    		else {
                req.session.oauthRequestToken = oauthToken;
                req.session.oauthRequestTokenSecret = oauthTokenSecret;
                res.redirect(`${process.env.jira_host_base_url}/plugins/servlet/oauth/authorize?oauth_token=${req.session.oauthRequestToken}`);
			}
		}
    )
});



app.get('/sessions/callback', function(request, response){
	consumer.getOAuthAccessToken (
			request.session.oauthRequestToken, 
			request.session.oauthRequestTokenSecret, 
			request.query.oauth_verifier,
			function(error, oauthAccessToken, oauthAccessTokenSecret, results){			
				if (error) { 
					console.log(error.data);
					response.send("error getting access token");		
				}
    			else {
      				request.session.oauthAccessToken = oauthAccessToken;
                    request.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
                    response.sendFile(__dirname + '/dist/index.html');
      				// consumer.get(`${process.env.jira_host_base_url}/rest/api/latest/issue/JRADEV-8110.json`, 
					// 	request.session.oauthAccessToken, 
					// 	request.session.oauthAccessTokenSecret, 
					// 	"application/json",
					// 	function(error, data, resp){
					// 		console.log(data);
        			// 		data = JSON.parse(data);
        			// 		response.send("I am looking at: "+data["key"]);
					// 	}
					// );
				}
			}
		)
	});

//if (!inContainer && !useNginx) {
    // redirect all others to the index (HTML5 history)

    app.all('/*', function(req, res) {
       // res.sendFile(__dirname + `/dist${req.url}`);
       var pattern = new RegExp('(.css|.html|.js|.ico|.jpg|.jpeg|.png)+$', 'gi');
        if (pattern.test(req.url)) {
          console.log ("url =", )
          res.sendFile(__dirname + `/dist${req.url}`);
        } else {
          res.sendFile(__dirname + '/dist/index.html');
        }
    });
//}

app.listen(port);

console.log('Express listening on port ' + port);

//Open browser
if (!inContainer && !inAzure) {
    var opn = require('opn');

    opn('http://localhost:' + port).then(() => {
        console.log('Browser closed.');
    });
}


