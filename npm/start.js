const {start,StartPostgres} = require('./symfony')
const execute = require('./cmd')
const {exec} = require("child_process")
execute("npm run dev")
StartPostgres()
start(true)
//execute("npm run watch")