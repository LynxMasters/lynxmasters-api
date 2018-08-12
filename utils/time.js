
module.exports = {
	expired: function(time){	
		console.log(new Date(time).getTime() +"<"+ new Date().getTime())
		return new Date(time).getTime() < new Date().getTime()	  
	},
}