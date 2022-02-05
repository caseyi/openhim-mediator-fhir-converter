// -------------------------------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License (MIT). See LICENSE in the repo root for license information.
// -------------------------------------------------------------------------------------------------

const uuid_1 = require("uuid");

let dataHandler = require('../dataHandler/dataHandler');

module.exports = class fhir extends dataHandler {
    constructor() {
        super("fhir");
    }

    parseSrcData(bundle, template) {
        let out = {fhir: {}}
        
        try {
            if(template && template.includes("ADT")) {
                out.fhir = this.parseAdt(bundle)
    
            } else {
                out.fhir = this.parseObr(bundle)
            }    
        } catch(error) {
            let e = error;
            console.log(`Could not parse Bundle!\n${e.message}\n${e.stack ? e.stack : ""}`)
        }

        out.fhir.controlId = uuid_1.v4().toString();
        out.fhir.date = new Date().toISOString().slice(0, 10).split('-').join('')

        out._originalData = bundle;

        return out
    }

    preProcessTemplate(templateStr) {
        return super.preProcessTemplate(templateStr);
    }

    postProcessResult(inResult) {
        return inResult
    }

    getConversionResultMetadata(context) {
        return super.getConversionResultMetadata(context);
    }

    parseAdt(bundle) {
        let res = {};
        let patient = (bundle.entry.find(e => e.resource.resourceType == "Patient")).resource;
        let provider = (bundle.entry.find(e => e.resource.resourceType == "Practitioner")).resource;
        let sourceLocation = (bundle.entry.find(e => e.resource.resourceType == "Location")).resource;
        let targetLocation = (bundle.entry.reverse().find(e => e.resource.resourceType == "Location")).resource;
        let sourceOrganization = (bundle.entry.find(e => e.resource.resourceType == "Organization")).resource;
        let targetOrganization = (bundle.entry.reverse().find(e => e.resource.resourceType == "Organization")).resource;
        res.patientId = patient.id;
        res.patientOmang = patient.identifier ? patient.identifier[0].value : "";
        res.patientFirstName = patient.name && patient.name[0] && patient.name[0].given ? patient.name[0].given[0] : "";
        res.patientLastName = patient.name && patient.name[0] && patient.name[0].family ? patient.name[0].family : "";
        res.patientDob = patient.birthDate.split('-').join('');
        res.patientSex = patient.gender;
        res.patientStreetAddress = "";
        res.patientCity = "";
        res.patientProvince = "";
        res.patientPostalCode = "";
        res.patientMaritalStatus = "";
        res.patientHomePhoneNumber = "";
        res.patientBusinessPhoneNumber = "";
        res.patientEmail = "";
        res.providerId = provider ? provider.id : "";
        res.providerLastName = provider.name && provider.name[0] && provider.name[0].family ? provider.name[0].family : "";
        res.providerFirstName = provider.name && provider.name[0] && provider.name[0].given ? provider.name[0].given[0] : "";
        res.facilityId = sourceLocation ? sourceLocation.id : "";
        res.kinFamilyName = "";
        res.kinFirstName = "";
        res.kinRelCode = "";
        res.kinRelation = "";
        res.kinStreetAddress = "";
        res.kinCity = "";
        res.kinProvince = "";
        res.kinPostalCode = "";
        return res;
    }
    parseObr(bundle) {
        let res = {};
        let patient = bundle.entry[1].resource;
        let serviceRequest = bundle.entry[4].resource;
        res.patientId = patient.id;
        res.patientOmang = patient.identifier[0].value;
        res.patientFirstName = patient.name[0].given[0];
        res.patientLastName = patient.name[0].family;
        res.patientDoB = patient.birthDate.split('-').join('');
        res.sex = patient.gender;
        res.labOrderId = serviceRequest.identifier ? serviceRequest.identifier[0].value : "";
        res.labOrderDatetime = serviceRequest.authoredOn ? serviceRequest.authoredOn.split('-').join('') : "";
        res.labOrderType = serviceRequest.code.coding[0].code;
        return res;
    }

};