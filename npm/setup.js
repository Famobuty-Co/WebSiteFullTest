const {start} = require('./symfony')
const execute = require('./cmd')
const logger = require("./logger")
const fs = require('fs')

var init = execute("php -i")
var vers = init.search("PHP Version => 8")
if(vers<0){
	throw logger.error("votre version de PHP n'est pas compatible avec le projet")
}
var ini = init.split("Loaded Configuration File =>")[1].split("\n")[0]

var pdo_driver = init.split("PDO Driver for PostgreSQL =>")[1].split("\n")[0]
if(!pdo_driver){
	var content = fs.readFileSync(ini)
	content = content.replace(";extension=pdo_pgsql","extension=pdo_pgsql")
	content = content.replace(";extension=pgsql","extension=pgsql")
	fs.writeFileSync(ini,content)
	throw logger.error("votre version de PHP n'est pas compatible avec le projet")
}

//console.log(ini)
const {exec} = require("child_process")
const {postgres} = require("../CI.json")
exec(`postgres -D "${postgres}"`)
logger.succes('install composer package')
exec("composer i")
logger.succes('your installation is a succes')
execute("php bin/console doctrine:database:create")
logger.succes('your database was installed with succes')
var err0 = execute("php bin/console make:migration")
var err1 = execute("php bin/console doctrine:migrations:migrate")
if(err0 || err1){
	logger.warn("delete ./migreations dir to resetup the database")
}
logger.succes('your database was updated with succes')