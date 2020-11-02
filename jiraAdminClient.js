"use strict";
var JiraClient = require("jira-connector");

module.exports = JiraAdminlib;

function JiraAdminlib() {
    this.adminClient  = new JiraClient({
        host: `${process.env.jira_host}`,
        strictSSL: true, // One of optional parameters
    
        basic_auth: {
            username: process.env.admin_username,
            password: process.env.admin_password
        }
    });

    this.fields;

    this.getAllFields =  async () => {
        if (!this.fields) {
            this.fields = await this.adminClient.field.getAllFields();
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

     this.getCustomFieldNames = () => {
         return this.customFieldNames;
     }

     this.getCustomFieldNamesJSON = () => {
        var fieldNames = [];
        for (var id in this.customFieldNames) {
            fieldNames.push ({
                name: id,
                displayName: customFieldNames[id]
            });
       }
       return fieldNames;
    }
  }