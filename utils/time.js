
module.exports = {
	expired: function(time){
		let now = new Date().valueOf()
		console.log(now)
		console.log(time)
		if(parseInt(time) < parseInt(now)){ return true;}
		else { return false; }		  
	},
}