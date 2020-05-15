const utils = require('./utils.js');

module.exports = {
	correction(usersSouce) {
		var users = usersSouce.slice();
		var userNb = users.length;
		var firstCorrecteur;
		for (let i = 0; i < userNb - 1; i++)
		{
			// for (let i = 0; i < users.length ; i++)
			// 	console.log("User " + i + " name : " + users[i].username);
			let random = utils.getRandomArbitrary(1, users.length - 1);
			var user = users[random];
			console.log(users[0].username + "\t\twill be corrected by\t\t"+ user.username);
			var tmp = users[0];
			if (i == 0)
				firstCorrecteur = user;
			users.splice(0, 1);
			users.splice(users.findIndex(u => u.username == user.username), 1);
			users.push(tmp);
		}
	}
}