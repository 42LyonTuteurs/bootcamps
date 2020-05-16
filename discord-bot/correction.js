const utils = require('./utils.js');

module.exports = {
	correction(usersSouce) {
		var correcter = usersSouce.slice();
		var corrected = usersSouce.slice();
		var userNb = corrected.length;
		for (let i = 0; i < userNb; i++)
		{
			let random = utils.getRandomArbitrary(1, correcter.length - 1);
			while (correcter[random].username == corrected[i].username)
				random = utils.getRandomArbitrary(1, correcter.length - 1);
			console.log(corrected[i].username + " will be corrected by " + correcter[random].username);
			correcter.splice(random, 1);
		}
	}
}