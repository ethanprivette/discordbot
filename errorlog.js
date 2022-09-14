function log(msg) {
		console.log(msg);
		client.on('ready', client => {
        const channel = client.channels.fetch('1017927935488966697');
            channel.then(channel=>channel.send(msg))
		};
 }

function error(msg, errormsg) {
		console.error(msg, errormsg);
		client.on('ready', client => {
			const channel = client.channels.fetch('1017927935488966697');
				channel.then(channel=>channel.send(msg, errormsg))
		};
   }

module.exports = { error, log };
