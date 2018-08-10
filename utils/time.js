
module.exports = {

	expired: function(time){
		let now = new Date()
		if(parseInt(time) > parseInt(now)){ return true}
		else{ return false}		  
	},
}