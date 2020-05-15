const configFile = require ('./config.json');
const config = configFile.botConfig;
const fs = require('fs');
const dateFormat = require('dateformat');

module.exports = {
	isAdmin(user) {
    return (config.admin.includes(user.username))
  },
  getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },
  alreadySubscribed(user) {
    // 
  },
  logs(string, user)
  {
    var date = dateFormat();
    let output;
    if (user)
      output = date + " | " + user.username + " | UserId : " + user.id + " :\n" + string + "\n";
    else
      output = date + " :\n" + string + "\n";
    fs.appendFile('app.log', output, (err) => {
      if (err) throw err;
    })
  }
}