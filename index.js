const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const FCM = require('fcm-node');
const serverKey = require('./key.json');

const fcm = new FCM(serverKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const tokens = [];

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/token', (req, res) => {
	console.log(req.body);
	tokens.push(req.body.token);

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

app.listen(8080, () => {
	console.log('Example app listening on port 8080!');
});