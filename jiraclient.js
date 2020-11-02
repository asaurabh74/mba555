"use strict";
var JiraClient = require("jira-connector");

module.exports = Jiralib;

function Jiralib(opts, adminClient) {
    this.adminClient = adminClient;
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

    this.addField = async (customFields, fieldName) => {
        var customField = await this.adminClient.getCustomField(fieldName);
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

        var customFieldNames = this.adminClient.getCustomFieldNames();
        
        for (var x in customFieldNames) {
            await this.addField(customFields, customFieldNames[x]);
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
            for (var id in customFieldNames) {
                 var customField =  await this.adminClient.getCustomField(customFieldNames[id]);
                 if (customField) {
                    candidate[id] = fields[customField.id];
                 }
            }
            // var state = {
            //     "abbreviation": candidate.state,
            //     "name": candidate.state,
            // }
            // candidate.state = state;
            candidate.gender = candidate.gender || "male";
            candidates.push(candidate);
           }
        
       }
       return candidates;
    }
    
    this.selectedFieldNames = ["firstName", "lastName", "address", "GT_ASVAB_SCORE", "city", "state", "zip"];

    this.getSelectedFieldNames = () => {
        var customFieldNames = this.adminClient.getCustomFieldNames();
        var  fields = [];
        for (var id in customFieldNames) {
            if (this.selectedFieldNames.indexOf(id) !== -1) {
                fields.push({
                    name: id,
                    displayName: customFieldNames[id]
                });
            }
        }
        return fields;
    }

    this.setSelectedFieldNames = (fieldNames) => {
        this.selectedFieldNames = fieldNames;
    }
  }