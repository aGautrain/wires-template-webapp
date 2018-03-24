const colors = require('colors');

let showAuthentications = function(ids) {
	
	console.log('\n\t{\n');
	
	Object.keys(ids).forEach(function(k){
		if(k === "host" || k === "user" || k === "password"){
			console.log(('\t\t"'.red) + (k.red) + ('"'.red) + (': ') + (ids[k]));
		}
		
	});
	
	console.log('\n\t}\n');
};

module.exports = {
	showAuthentications
};