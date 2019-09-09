const express = require('express')
const request = require('request-promise')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Body parser - support parsing of application/json type post data
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Plan a Visit at XR.church!")
})

app.post('/', (req, res) => {
    const data = req.body

    const campusID = (data.campus === "North Fayette") ? "9929" :
        (data.campus === "Boyce Road") ? "9930" :
        (data.campus === "Cranberry") ? "9931" :
        (data.campus === "East Liberty") ? "9932" :
        (data.campus === "Weirton") ? "9933" :
        "9929"

    // household is an array of Promises - each promise being a person being created
    let household = []

    // Check that we have data for first person
    if (data.your_firstname && data.your_lastname) {

        // Add person to Planning Center
        const postPerson = request.post({
            uri: 'https://api.planningcenteronline.com/people/v2/people/',
            method: 'POST',
            json: {
                "data": {
                    "attributes": {
                        "first_name": data.your_firstname,
                        "last_name": data.your_lastname,
                        "primary_campus_id": campusID,
                        "membership": "Planned Visit Online"
                    }
                }
            }
        }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false).catch(error => { console.log(error.message) })

        household.push(postPerson) // Add the Promise to the households array

        // Add their email to their profile, if provided
        if (data.your_email) {
            const postEmail = postPerson.then(body => {
                const personID = body["data"]["id"]
                console.log("Person ID: " + personID)
                return request.post({
                    uri: `https://api.planningcenteronline.com/people/v2/people/${personID}/emails`,
                    method: 'POST',
                    json: {
                        "data": {
                            "attributes": {
                                "address": data.your_email,
                                "location": "Home",
                                "primary": true
                            }
                        }
                    }
                }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false).catch(error => { console.log(error.message) })
            })
        }

        // Add their phone number to their profile, if provided
        if (data.your_phone) {
            const postPhone = postPerson.then(body => {
                const personID = body["data"]["id"]
                console.log("Person ID: " + body["data"]["id"])
                return request.post({
                    uri: `https://api.planningcenteronline.com/people/v2/people/${personID}/phone_numbers`,
                    method: 'POST',
                    json: {
                        "data": {
                            "attributes": {
                                "number": data.your_phone,
                                "location": "Mobile",
                                "primary": true
                            }
                        }
                    }
                }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false).catch(error => { console.log(error.message) })
            })
        }

    }

    // Check if we have spouse
    if (data.spouse_firstname && data.spouse_lastname) {

        // Add spouse to Planning Center
        const postSpouse = request.post({
            uri: 'https://api.planningcenteronline.com/people/v2/people/',
            method: 'POST',
            json: {
                "data": {
                    "attributes": {
                        "first_name": data.spouse_firstname,
                        "last_name": data.spouse_lastname,
                        "primary_campus_id": campusID,
                        "membership": "Planned Visit Online"
                    }
                }
            }
        }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false).catch(error => { console.log(error.message) })

        household.push(postSpouse) // Add the Promise to the households array
    }

    // Check for first child
    if (data.child1_firstname && data.child1_lastname) {

        // Add spouse to Planning Center
        const postChild1 = request.post({
            uri: 'https://api.planningcenteronline.com/people/v2/people/',
            method: 'POST',
            json: {
                "data": {
                    "attributes": {
                        "first_name": data.child1_firstname,
                        "last_name": data.child1_lastname,
                        "birthdate": data.child1_dob,
                        "medical_notes": data.child1_info,
                        "child": true, // May need to change this in the future to check if age < 18
                        "primary_campus_id": campusID,
                        "membership": "Planned Visit Online"
                    }
                }
            }
        }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false).catch(error => { console.log(error.message) })

        household.push(postChild1) // Add the Promise to the households array

    }


    // Put all the people in a household!
    if (household.length > 0 && data.your_lastname) {

        // Once all the people are created (every Promise in the household array has been resolved)
        Promise.all(household).then(householdBodys => {

            // Create the json to be POSTed
            let householdJson = {
                "data": {
                    "attributes": {},
                    "relationships": {
                        "people": {
                            "data": []
                        },
                        "primary_contact": {
                            "data": {}
                        }
                    }
                }
            }
            householdJson.data.attributes = { "name": data.your_lastname }
            householdBodys.forEach((body) => {
                householdJson.data.relationships.people.data.push({ "type": "Person", "id": `${body["data"]["id"]}` })
            })
            householdJson.data.relationships.primary_contact.data = { "type": "Person", "id": `${householdBodys[0]["data"]["id"]}` }
            console.log(householdJson)

            const postHousehold = request.post({
                uri: 'https://api.planningcenteronline.com/people/v2/households/',
                method: 'POST',
                json: householdJson
            }).auth(process.env.PCO_APP_ID, process.env.PCO_SECRET, false).catch(error => { console.log(error.message) })

        })
    }


    res.status(200)
    res.send("Success")
})


app.listen(port, () => console.log(`PlanAVisit app listening on port ${port}!`))