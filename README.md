# PlanAVisit
The backend for Plan A Visit - adding the household to Planning Center

### To Run:  
Create `.env` file with:  
```javascript
PCO_APP_ID=
PCO_SECRET=  
```
npm install  
node app.js

### POST Request from Gravity Forms
The app can handle POST requests via, for example, a Gravity Forms form (throught the webhook plugin) with JSON data formatted like the following:
```javascript
{
  "campus": "North Fayette",
  "your_firstname": "Jim",
  "your_lastname": "Halpert",
  "your_email": "jhalpert@dundermifflin.com",
  "your_phone": "5701234567",
  "spouse_firstname": "Pam",
  "spouse_lastname": "Halpert",
  "child1_firstname": "CeCe",
  "child1_lastname": "Halpert",
  "child1_dob": "2010-03-04",
  "child1_info": "Not allowed to be picked up by Dwight Shrute",
  "child2_firstname": "",
  "child2_lastname": "",
  "child2_dob": "",
  "child2_info": ""
}
```
Note: spouse, child1, child2 data not required
