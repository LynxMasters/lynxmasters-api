
module.exports = {
	expired: function(time){	
		return new Date(time).getTime() < new Date().getTime()	  
	},
}