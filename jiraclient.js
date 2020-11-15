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


   this.getLoggedInUser = async () => {
        return await this.client.auth.currentUser();
   }
 
    this.getCandidates = async (jql, startAt, maxResults) => {
        var customFields = [
            "summary",
            "description",
            "status",
            "priority",
            "project",
            "assignee",
            "reporter"
        ];

        var customFieldNames = this.adminClient.getCustomFieldNames();
        
        for (var x=0; x<customFieldNames.length; ++x) {
            await this.addField(customFields, customFieldNames[x].fieldName);
        }
        
        jql = jql || "";

       var result =  await this.client.search.search({
           jql,
           fields : customFields,
           startAt,
           maxResults : maxResults || 50,
       });
       var candidates = [];
       var retVal = {
           totalResults: 0,
           candidates: candidates
       }
       if (result && result.issues) {
           retVal.totalResults = result.total;
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
                assignee: {
                    id: fields.assignee ? fields.assignee.accountId : "",
                    value: fields.assignee ? fields.assignee.displayName : ""
                }
            };

            for (var y=0; y<customFieldNames.length; ++y) {
                 var customField =  await this.adminClient.getCustomField(customFieldNames[y].fieldName);
                 if (customField) {
                    candidate[customFieldNames[y].name] = fields[customField.id];
                 }
            }
            candidate.gender = candidate.gender || "Male";
            candidate.checked = false;
            candidates.push(candidate);
           }

        
       }
       
       return retVal;
    }
    
    this.selectedFieldNames = ["firstName", "lastName", "address", "GT_ASVAB_SCORE", "city", "state", "zip"];

    this.getSelectedFieldNames = () => {
        var customFieldNames = this.adminClient.getCustomFieldNames();
        var  fields = [];
        for (var x=0; x<customFieldNames.length; ++x) {
            if (this.selectedFieldNames.indexOf(customFieldNames[x].name) !== -1) {
                fields.push(customFieldNames[x]);
            }
        }
        return fields;
    }

    this.setSelectedFieldNames = (fieldNames) => {
        this.selectedFieldNames = fieldNames;
    }
  }