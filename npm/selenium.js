const {Builder, By, Key, until} = require('selenium-webdriver');
const logger = require('./logger')
const path = require("path");
const os = require('os');

const firefox = require('selenium-webdriver/firefox');
const win = os.platform() == "win32"
const geckodriver = path.join(__dirname,"bin","geckodriver")+(win?".exe":"")
const serviceBuilder = new firefox.ServiceBuilder(geckodriver);

const options = new firefox.Options();
options.headless();

class Browser{
	constructor(){
		
	}
	async loadURL(url){
		if(!this.driver)
		this.driver = await new Builder()
			.forBrowser('firefox')
			.setFirefoxOptions(options)
			.setFirefoxService(serviceBuilder)
			.build();
		logger.info(url)
		await this.driver.get(url);
	}
	async close(){
		await this.driver.quit();
	}
	async querySelector(selector){
		try {
			return await this.driver.findElement(By.css(selector))
		} catch{
			return null
		}
	}
	async screenShot(){
		return await this.driver.takeScreenshot()
	}
}
function open(url){
	return new Promise((resolve)=>{
		var b = new Browser()
		b.loadURL(url).then(x=>{
			resolve(b)
		})
	})

}
module.exports = {
	Browser,
	open
}