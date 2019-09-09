const express = require('express')
const request = require('request')
const app = express()
const port = process.env.PORT || 3000

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

app.get('/', (req, res) => {
    console.log(process.env.PCO_APP_ID);
    request.get('https://api.planningcenteronline.com/people/v2/people/4960326', (error, response, body) => {
        res.send(JSON.parse(body))
        console.error('error:', error) // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
        console.log('body:', body) // Print the body
    }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false)
})

app.listen(port, () => console.log(`PlanAVisit app listening on port ${port}!`))