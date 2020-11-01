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
      
  }