"use strict";
var JiraClient = require("jira-connector");

module.exports = Jiralib;

var adminClient  = new JiraClient({
    host: `${process.env.jira_host}`,
    strictSSL: true, // One of optional parameters

    basic_auth: {
        username: process.env.admin_username,
        password: process.env.admin_password
    }
});

function Jiralib(opts) {
    this.client  = new JiraClient({
        host: `${process.env.jira_host}`,
        strictSSL: true, // One of optional parameters
        oauth: {
          consumer_key: opts.consumer_key,
          private_key: opts.private_key,
          token: opts.token,
          token_secret: opts.token_secret
        }
      });

    this.fields;

    this.getAllFields =  async () => {
        if (!this.fields) {
            this.fields = await adminClient.field.getAllFields();
        }
        return this.fields;
    }

    this.getCustomField = async (name) => {
        var fields = await this.getAllFields();
        for (let x=0; x< fields.length; ++x) {
            if (fields[x].name === name) {
                return fields[x];
            }
        }
    }

    this.addField = async (customFields, fieldName) => {
        var customField = await this.getCustomField(fieldName);
        if (customField) {
            customFields.push (customField.id);
        }
    }

    this.customFieldNames = {firstName:"First Name", 
                             lastName:"Last Name", 
                             address: "Address",
                             GT_ASVAB_SCORE: "GT_ASVAB_SCORE", 
                             city: "City",
                             state: "State",
                             zip: "Zip",
                             GM_ASVAB_SCORE: "GM_ASVAB_SCORE", 
                             ST_ASVAB_SCORE: "ST_ASVAB_SCORE", 
                             gender: "gender"};
 
    this.getCandidates = async (jql, startAt, maxResults) => {
        var customFields = [
            "summary",
            "description",
            "status",
            "priority",
            "project",
            "assignee",
            "reporter",
        ];
        
        for (var x in this.customFieldNames) {
            await this.addField(customFields, this.customFieldNames[x]);
        }
        
        jql = jql || "";

       var result =  await this.client.search.search({
           jql,
           fields : customFields,
           startAt,
           maxResults : maxResults || 50,
       });
       var candidates = [];
       if (result && result.issues) {
           for (var x=0;x< result.issues.length; ++x) {
            var issue = result.issues[x];
            var fields = issue.fields;
            var candidate = {
                id : issue.id,
                key: issue.key,
                summary: fields.summary,
                status: fields.status.name,
                reporterName: fields.reporter.displayName,
                reporterEmail: fields.reporter.emailAddress,
                assigneeName: fields.assignee ? fields.assignee.displayName : "",
                assigneeEmail: fields.assignee ? fields.assignee.emailAddress : ""
            };
            for (var id in this.customFieldNames) {
                 var customField =  await this.getCustomField(this.customFieldNames[id]);
                 if (customField) {
                    candidate[id] = fields[customField.id];
                 }
            }
            var state = {
                "abbreviation": candidate.state,
                "name": candidate.state,
            }
            candidate.state = state;
            candidate.gender = candidate.gender || "male";
            candidates.push(candidate);
           }
        
       }
       return candidates;
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