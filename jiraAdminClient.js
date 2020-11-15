"use strict";
const { urlencoded } = require("body-parser");
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
    this.users;

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

    
    this.getUsers = async() => {
        if (!this.users) {
            this.users = await this.adminClient.user.all({maxResults: 100});
        }
        return this.users;
    }

    this.populateOptions = async () => {
        for (var x=0; x< this.customFieldNames.length; ++x){
            if (this.customFieldNames[x].fieldName === "assignee") {
                console.log("assignee");
                this.customFieldNames[x].type = "select";
                var options = [];
                this.customFieldNames[x].options = options;
                var users = await this.getUsers();
                for (var u=0; u < users.length; ++u) {
                    var user = users[u];
                    if (user.accountType === "atlassian" && user.active) {
                        options.push({
                            id: user.accountId,
                            value: user.displayName,
                            email: user.emailAddress
                        });
                    }
                }
            }
            var customField = await this.getCustomField(this.customFieldNames[x].fieldName);

            if (customField && customField.schema && customField.schema.type) {
                this.customFieldNames[x].type = customField.schema.type;
            }
            if (customField && customField.schema 
                && (customField.schema.type === 'option' ||  customField.schema.type === 'array')) {
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
        {"name": "ID", "displayName":  "ID", "fieldName": "ID", "editable": false, "type": "number"},
        {"name": "gender", "displayName":  "Gender", "fieldName": "Gender", "editable": false, "type": "string"},
        {"name": "GT_ASVAB_SCORE", "displayName":  "GT Score", "fieldName": "GT_ASVAB_SCORE", "editable": false, "type": "number"},
        {"name": "GM_ASVAB_SCORE", "displayName":  "GM Score", "fieldName": "GM_ASVAB_SCORE", "editable": false, "type": "number"},
        {"name": "CO_ASVAB_SCORE", "displayName":  "CO Score", "fieldName": "CO_ASVAB_SCORE", "editable": false, "type": "number"},
        {"name": "ST_ASVAB_SCORE", "displayName":  "ST Score", "fieldName": "ST_ASVAB_SCORE", "editable": false, "type": "number"},
        {"name": "Installation", "displayName":  "Installation", "fieldName": "INSTALLATION", "editable": false, "type": "string"},
        {"name": "ASG_ELIG_CD", "displayName":  "ASG_ELIG_CD", "fieldName": "ASG_ELIG_CD", "editable": false, "type": "string"},
        {"name": "UIC", "displayName":  "UIC", "fieldName": "UIC", "editable": false, "type": "string"},
        {"name": "UNIT", "displayName":  "UNIT", "fieldName": "UNIT", "editable": false, "type": "string"},
        {"name": "MIL_ED_LVL_CD", "displayName":  "Millitary Education Level", "fieldName": "MIL_ED_LVL_CD(MEL)", "editable": false, "type": "string"},
        {"name": "SORB INSTALLATION", "displayName":  "SORB Installation", "fieldName": "SORB INSTALLATION", "editable": false, "type": "string"},
        {"name": "Address", "displayName":  "Address", "fieldName": "Address", "editable": false, "type": "string"},
        {"name": "PrimaryEmail", "displayName":  "Primary email", "fieldName": "Primary email", "editable": false, "type": "string"},
        {"name": "SecondaryEmail", "displayName":  "Secondary email", "fieldName": "Secondary email", "editable": false, "type": "string"},
        //{"name": "city", "displayName":  "City", "fieldName": "City", "editable": false, "type": "string"},
        //{"name": "state", "displayName":  "State", "fieldName": "State", "editable": false, "type": "string"},
        //{"name": "zip", "displayName":  "Zip", "fieldName": "Zip", "editable": false, "type": "string"},
        {"name": "firstName", "displayName":  "First Name", "fieldName": "First Name", "editable": true, "type": "string"},
        {"name": "lastName", "displayName":  "Last Name",  "fieldName": "Last Name", "editable": true, "type": "string"},
        {"name": "qualWomos", "displayName":  "QUAL WOMOS", "fieldName": "QUAL WOMOS", "editable": true, "type": "string"},
        {"name": "primaryWomos", "displayName":  "Primary MOS", "fieldName": "PRIMARY MOS", "editable": true, "type": "string"},
        {"name": "rank", "displayName":  "Rank", "fieldName": "Rank", "editable": true, "type": "select"},
        {"name": "DistributionGroup", "displayName":  "Distribution Group", "fieldName": "Distribution Group", "editable": true, "type": "select"},
        {"name": "Territory", "displayName":  "Territory", "fieldName": "Territory", "editable": true, "type": "select"},
        {"name": "PacketProcessingStatus", "displayName":  "Packet Processing Status", "fieldName": "Packet Processing Status", "editable": true, "type": "select"},
        {"name": "assignee", "displayName":  "Recruiter", "fieldName": "assignee", "editable": false, "type": "select"},
    ]
    
     this.getCustomFieldNames = () => {
         return this.customFieldNames;
     }

     this.getCustomFieldNamesJSON = () => {
        return this.getCustomFieldNames();
    }

    // populate options
  }