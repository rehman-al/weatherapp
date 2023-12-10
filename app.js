const http = require('http')
const fs = require('fs')
var requests = require('requests')
var PORT = process.env.PORT || 8080
var host = "0.0.0.0"
const homefile = fs.readFileSync('home.html', "utf-8");
function replaceval(tempVal, orgVAl) {
    let kelvin = 273.15;
    let temperature = tempVal.replace("{%tempval%}", (orgVAl.main.temp - kelvin).toFixed(2))
    temperature = temperature.replace("{%tempmin%}", (orgVAl.main.temp_min - kelvin).toFixed(2))
    temperature = temperature.replace("{%tempmax%}", (orgVAl.main.temp_max  - kelvin).toFixed(2))
    temperature = temperature.replace("{%city%}", orgVAl.name)
    temperature = temperature.replace("{%country%}", orgVAl.sys.country)
    temperature = temperature.replace('{%tempicon%}', orgVAl.weather[0].icon)
    return temperature
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Sahiwal&appid=e2f5fcfbdd43072c3afeef644af6bff7")
        .on('data', (chunk) => {
            var ondata = JSON.parse(chunk)
            var dataString = [ondata]
            var realTimeDate = dataString.map((val) => replaceval(homefile, val)).join("")
            res.write(realTimeDate)
            // geting the temp 
            // console.log(dataString[0].main.temp)
        })
        .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);
            console.log("end bro")
            res.end();
        });
    }
})


server.listen(PORT, host, () => {
    console.log(`the server is live on: ${PORT}`)
})