const execute = require('./cmd')
const {port} = require('../CI.json')

function reloadSymfony(){
	var str = execute("symfony server:stop")
	var list = execute("symfony server:list")
	if(/[0-9]/.test(list)){
		str = execute("symfony server:stop")
		list = execute("symfony server:list")
	}
	startSymfony(false)
}
function startSymfony(force = false){
	var str = execute("symfony server:start -d")
	if(str.search('web server is already running')>0){
		console.info("Server is Already Running")
		if(force){
			console.info("we try to force reload")
			reloadSymfony()
		}
	}else if(str.search("WARNING")){
		console.error(str)
	}else{
		console.info("Server is Running")
	}
}
function stopSymfony(){
	var str = execute("symfony server:stop")
}
function getURL(){
	var str = execute("symfony open:local")
	return str.split(": ")[1]
}
/**
 * php bin/console make:migration
 * 
 */
 const {postgres} = require("../CI.json")
function isRunning(){
	var list = execute("symfony server:list")
	return list.search(port)
}
const {exec} = require("child_process")
function StartPostgres(){
	exec(`postgres -D "${postgres}"`)
}
module.exports = {
	start:startSymfony,
	stop:stopSymfony,
	reload:reloadSymfony,
	url:getURL,
	isRunning,
	StartPostgres
}