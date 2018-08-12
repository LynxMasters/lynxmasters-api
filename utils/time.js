
module.exports = {
	expired: function(time){	
		console.log(new Date(time).getTime() +"<"+ new Date().getTime())
		if(new Date(time).getTime() < new Date().getTime()){ return true;}
		else { return false; }		  
	},
}