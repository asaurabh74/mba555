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
            await this.populateOptions();
        }
        return this.fields;
    }

    this.issueMetaData;

    this.getAvailableOptions = async (name) => {
        if (!this.issueMetaData) {
            var options = {
                expand: "projects.issuetypes.fields"
            };
            this.issueMetaData = await this.adminClient.issue.getCreateMetadata(options);
        }
        if (this.issueMetaData && this.issueMetaData.projects && this.issueMetaData.projects.length >0) {
            var project = this.issueMetaData.projects[0];
            if (project.issuetypes && project.issuetypes.length>0) {
                var issueType = project.issuetypes[0];
                var field = issueType.fields[name];
                if (field && field.allowedValues) {
                    return field.allowedValues;
                }
            }
        }
        return [];
    }

    this.populateOptions = async () => {
        for (var x=0; x< this.customFieldNames.length; ++x){
            var customField = await this.getCustomField(this.customFieldNames[x].fieldName);

            if (customField && customField.schema && customField.schema.type) {
                this.customFieldNames[x].type = customField.schema.type;
            }
            if (customField && customField.schema && customField.schema.type === 'option') {
                customField.allowedValues = await this.getAvailableOptions(customField.id);
                if (customField.allowedValues) {
                    var options = [];
                    for (var y=0; y< customField.allowedValues.length; ++y) {
                        options.push  ({
                            id: customField.allowedValues[y].id,
                            value: customField.allowedValues[y].value,
                        });
                    }
                    this.customFieldNames[x].options = options;
                }
            }
        }
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
        {"name": "rank", "displayName":  "Rank", "fieldName": "Rank", "editable": true, "type": "select"},
       {"name": "leadStatus", "displayName":  "Lead Status", "fieldName": "Rank", "editable": true, "type": "select"}
    ]
    
     this.getCustomFieldNames = () => {
         return this.customFieldNames;
     }

     this.getCustomFieldNamesJSON = () => {
        return this.getCustomFieldNames();
    }

    // populate options
  }