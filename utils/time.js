
module.exports = {
	expired: function(time){
		let now = new Date()
		now.setSeconds(-30)
		console.log(now)	
		console.log(time)
		return (time < now)
	}
}