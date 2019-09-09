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
    const data = req.body

    // Check that we have data for first person
    if (data.your_firstname && data.your_lastname) {
        // Add person to Planning Center
        const you = addPersonToPlanningCenter(data.your_firstname, data.your_lastname, data.your_email, data.your_phone, data.campus)
    }

    // Check if we have spouse
    if (data.spouse_firstname && data.spouse_lastname) {
        const spouse = addPersonToPlanningCenter(data.spouse_firstname, data.spouse_lastname, '', '', data.campus)
    }

    // TODO: householding


    // TODO: add children

    res.status(200)
    res.send("Success")
})

function addPersonToPlanningCenter(first, last, email, phone, campus) {

    const campusID = (campus === "North Fayette") ? "9929" :
        (campus === "Boyce Road") ? "9930" :
        (campus === "Cranberry") ? "9931" :
        (campus === "East Liberty") ? "9932" :
        (campus === "Weirton") ? "9933" :
        "9929"

    let personID

    const personPost = {
        uri: 'https://api.planningcenteronline.com/people/v2/people/',
        method: 'POST',
        json: {
            "data": {
                "attributes": {
                    "first_name": first,
                    "last_name": last,
                    "primary_campus_id": campusID
                }
            }
        }
    }

    request.post(personPost, (error, response, body) => {
        console.error('error:', error) // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
        console.log('body:', body) // Print the body
        personID = body["data"]["id"]
        console.log("Person ID: " + personID)
        if (email) {
            // Post the email address
            const emailPost = {
                uri: `https://api.planningcenteronline.com/people/v2/people/${personID}/emails`,
                method: 'POST',
                json: {
                    "data": {
                        "attributes": {
                            "address": email,
                            "location": "Home",
                            "primary": true
                        }
                    }
                }
            }
            request.post(emailPost, (error, response, body) => {
                console.error('error:', error) // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
                console.log('body:', body) // Print the body

                if (phone) {
                    // Post the phone number
                    const phonePost = {
                        uri: `https://api.planningcenteronline.com/people/v2/people/${personID}/phone_numbers`,
                        method: 'POST',
                        json: {
                            "data": {
                                "attributes": {
                                    "number": phone,
                                    "location": "Mobile",
                                    "primary": true
                                }
                            }
                        }
                    }

                    request.post(phonePost, (error, response, body) => {
                        console.error('error:', error) // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
                        console.log('body:', body) // Print the body

                    }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false)
                }

            }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false)
        }

    }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false)

    return personID
}

app.listen(port, () => console.log(`PlanAVisit app listening on port ${port}!`))