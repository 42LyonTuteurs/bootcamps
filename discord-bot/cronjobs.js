module.exports = {
	cron.schedule("42 8 18 * * ", function() {
		client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day00.pdf"]});
	}),
	cron.schedule("42 8 19 * * ", function() {
		client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day01.pdf"]});
	}),
	cron.schedule("42 8 20 * * ", function() {
		client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day02.pdf"]});
	}),
	cron.schedule("42 8 21 * * ", function() {
	client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day03.pdf"]});
});

cron.schedule("42 8 22 * * ", function() {
	client.channels.cache.get(config.testChannelId).send("here is the first subject", {files: ["./day04.pdf"]});
});