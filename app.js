const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Body parser - support parsing of application/json type post data
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log(process.env.PCO_APP_ID);
    // request.get('https://api.planningcenteronline.com/people/v2/people/4960326', (error, response, body) => {
    //     let person = JSON.parse(body)["data"]
    //     res.send("Person name: " + person["attributes"]["name"])
    //     console.error('error:', error) // Print the error if one occurred
    //     console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
    //     console.log('body:', body) // Print the body
    // }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false)
    const postRequest = {
            uri: 'https://api.planningcenteronline.com/people/v2/people/',
            method: 'POST',
            json: {
                "data": {
                    "attributes": {
                        "first_name": "JordanTestPerson",
                        "last_name": "JordanTestPersonLast"
                    }
                }
            }
        }
        // request.post(postRequest, (error, response, body) => {
        //     res.send("Posted.")
        //     console.error('error:', error) // Print the error if one occurred
        //     console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
        //     console.log('body:', body) // Print the body
        // }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false)
    res.send("Plan a visit!")
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.status(200)
    res.send("Success")
})

app.listen(port, () => console.log(`PlanAVisit app listening on port ${port}!`))