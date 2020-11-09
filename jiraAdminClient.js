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

    this.customFieldNames = [
        {"name": "firstName", "displayName":  "First Name", "fieldName": "First Name", "editable": true, "type": "string"},
        {"name": "lastName", "displayName":  "Last Name",  "fieldName": "Last Name", "editable": true, "type": "string"},
        {"name": "GT_ASVAB_SCORE", "displayName":  "GT ASVAB Score", "fieldName": "GT_ASVAB_SCORE", "editable": false, "type": "number"},
        {"name": "city", "displayName":  "City", "fieldName": "City", "editable": false, "type": "string"},
        {"name": "state", "displayName":  "State", "fieldName": "State", "editable": false, "type": "string"},
        {"name": "zip", "displayName":  "Zip", "fieldName": "Zip", "editable": false, "type": "string"},
        {"name": "GM_ASVAB_SCORE", "displayName":  "GM ASVAB Score", "fieldName": "GM_ASVAB_SCORE", "editable": false, "type": "number"},
        {"name": "ST_ASVAB_SCORE", "displayName":  "ST ASVAB Score", "fieldName": "ST_ASVAB_SCORE", "editable": false, "type": "number"},
        {"name": "gender", "displayName":  "Gender", "fieldName": "gender", "editable": false, "type": "string"},
        {"name": "qualWomos", "displayName":  "QUAL WOMOS", "fieldName": "QUAL WOMOS", "editable": true, "type": "string"},
        {"name": "primaryWomos", "displayName":  "Primary MOS", "fieldName": "PRIMARY MOS", "editable": true, "type": "string"},
        {"name": "rank", "displayName":  "Rank", "fieldName": "ARSOF Rank", "editable": true, "type": "select"},
        {"name": "leadStatus", "displayName":  "Lead Status", "fieldName": "Rank", "editable": true, "type": "select"}
    ]
    
     this.getCustomFieldNames = () => {
         return this.customFieldNames;
     }

     this.getCustomFieldNamesJSON = () => {
        return this.getCustomFieldNames();
    }
  }