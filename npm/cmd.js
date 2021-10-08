const {execSync,exec} = require("child_process")

function execute(cmd){
	try{
		var v = execSync(cmd)
		if(v) v = v.toString()
		return v
	}catch{
		return null
		//return exec(cmd)
	}
}
module.exports = execute