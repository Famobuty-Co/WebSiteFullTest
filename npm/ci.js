const symfony = require('./symfony')
const config = require("../CI.json")
const selenium = require("./selenium")
const logger = require('./logger')
class Config{
	constructor(config){
		if(config.url){

		}else{
			this.host = config.host||"127.0.0.1"
			this.port = config.port||"8000"
			this.protocol = config.protocol || "http"
		}
		this.pages = config.pages||[]
	}
	generateURL(){
		return this.url||`${this.protocol}://${this.host}:${this.port}`
	}
}
class ConfigPage{
	constructor(obj,config){
		this.url = config.generateURL()+"/"+(obj.url || "")
		this.method = (obj.method || "GET").toUpperCase()
		this.forms = obj.forms
	}
	generateForm(){
		var obj = {}
		var resp = Object.keys(this.forms[1])
		resp.forEach(x=>{
			obj[x] = this.forms[~~(this.forms.length*Math.random())]
		})
		return obj
	}
}
async function testForm(browser,config){
	var form = await browser.querySelector('form');
	
}
function testError(browser,config){
	return new Promise(async (resolve,reject)=>{
		var exception = await browser.querySelector('.exception-message');
		if(exception){
			var exception_message = await exception.getText()
			reject(exception_message)
		}else{
			resolve()
		}
	})
}
function testPage(page){
	return new Promise(resolve=>{
		try{
			var fail = false
			const err = (error)=>{logger.error(error);fail = true}
			selenium.open(page.url).then(
				(async browser=>{
					testError(browser,page).then(x=>{
						
					}).catch(err).finally(x=>{
						browser.close().then(()=>{
							if(fail){
								logger.warn(`test ${page.url} failure`)
							}else{
								logger.succes(`test ${page.url} succes`)
							}
							resolve(!fail)
						})
					})
				})
			)
		}catch(e){
			console.error(`test error : ${e}`)
		}
	})
}
async function testWebSitePages(config){
	for (page of config.pages){
		await testPage(new ConfigPage(page,config))
	}
}
function testWebSite(config){
	config = new Config(config)
	console.log(config)
	testWebSitePages(config)
}
if(symfony.isRunning()){
	symfony.StartPostgres()
	symfony.start()
	// config.url = symfony.url()
	testWebSite(config)
}