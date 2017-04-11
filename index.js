const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const FCM = require('fcm-node');
const serverKey = require('./key.json');
const GitHubApi = require("github");

const github = new GitHubApi({
	protocol: "https",
	host: "api.github.com", // should be api.github.com for GitHub
	headers: {
		"user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
	},
	timeout: 5000
});

const fcm = new FCM(serverKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const tokens = [];

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/token', (req, res) => {

	const message = {
		to: req.body.token,

		notification: {
			title: 'Thanks!',
			body: 'Thanks for subscribing to push notifications!',
			icon: './images/512.png'
		}
	}

	fcm.send(message, (err, response) => {
		if (err) {
			console.log("Something has gone wrong!")
		} else {
			console.log("Successfully sent with response: ", response)
		}
	});

});

app.post('/issues', (req, res) => {
	console.log(req.body.token);

	const job = schedule.scheduleJob({ hour: 14, minute: 30 }, () => {
		github.issues.getForRepo({
			owner: req.body.owner,
			repo: req.body.repo
		}, function (err, res) {
			if (err) {
				console.log(err.toJSON());
			} else {
				console.log(res.data.length);
			}
		});

		const message = {
			to: req.body.token,

			notification: {
				title: 'Issues',
				body: `${res.data.length} issues on ${req.body.repo}`,
				icon: './images/512.png'
			}
		}

		fcm.send(message, (err, response) => {
			if (err) {
				console.log("Something has gone wrong!")
			} else {
				console.log("Successfully sent with response: ", response)
			}
		});
	});
});

app.listen(8080, () => {
	console.log('Example app listening on port 8080!');
});