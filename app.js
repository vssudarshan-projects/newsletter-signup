/*native node modules*/

/*express modules*/
const express = require('express');
const bodyParser = require('body-parser');

const request = require('request');

/*mailchimp module*/
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
const PORT = process.env.PORT || 3000;
const PATH = __dirname;
const PUBLIC_PATH = PATH + '/public';

/* WARNING: REMOVE BEFORE COMMIT*/
mailchimp.setConfig({
  apiKey: "",
  server: "",
});

const listId = "";

/*Add subscriber to mailing List*/
async function addToList(subData){
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subData.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subData.firstName,
      LNAME: subData.lastName
    }
  });

  console.log(
    `Successfully added contact as an audience member. The contact's id is ${
      response.id
    }.`
  );

return response;
}

/*static resources */
app.use(express.static(PUBLIC_PATH));

/* Data from webpage is application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({extended:true}));


/*webpage GET request on root*/
app.get('/', function (clientReq, clientRes){
  clientRes.sendFile(PATH + '/index.html');
});

/*webpage POST request on root by form submition*/
app.post('/', (req, res)=>{

var subData = {
  firstName: req.body.first,
  lastName:  req.body.last,
  email: req.body.email
}



console.log(subData);

var status;

addToList(subData).then(()=>{
  res.sendFile(PUBLIC_PATH + "/success.html");
}, ()=>{
  res.sendFile(PUBLIC_PATH + "/failure.html");
});

});


/*get request on try again from failure page*/
app.get('/failure', function(req,res){
  res.redirect('/');
});

app.listen(PORT, ()=>{

console.log("Listening on port: " + PORT);

});
