const moment = require('moment')

module.exports = {
	expired: function(time){
		let now = moment()
		let expiryDate = moment(time)
		return (moment(now).isAfter(expiryDate))
	},
}