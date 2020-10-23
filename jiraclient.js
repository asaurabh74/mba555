"use strict";
var JiraClient = require("jira-connector");

module.exports = Jiralib;

function Jiralib(config) {
    this.client = new JiraClient({
        host: "arsof.atlassian.net",
        strictSSL: true, // One of optional parameters

        basic_auth: {
            username: "asaurabh@yahoo.com",
            password: "hb7Zq3eXgTlScf1dChAm7A0D"
        }
    });

    this.getCandidates = async () => {
       return await this.client.search.search({});
    }

  /*  {
        "id": 1,
        "firstName": "ted",
        "lastName": "james",
        "gender": "male",
        "address": "1234 Anywhere St.",
        "city": " Phoenix ",
        "state": {
            "abbreviation": "AZ",
            "name": "Arizona"
        },
        "orders": [
            {"productName": "Basketball", "itemCost": 7.99},
            {"productName": "Shoes", "itemCost": 199.99}
        ],
        "latitude": 33.299,
        "longitude": -111.963
  },*/
      
  }