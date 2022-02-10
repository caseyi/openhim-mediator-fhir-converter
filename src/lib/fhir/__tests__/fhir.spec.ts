// -------------------------------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License (MIT). See LICENSE in the repo root for license information.
// -------------------------------------------------------------------------------------------------

import { R4 } from "@ahryman40k/ts-fhir-types";
import got from "got";

var assert = require('assert');
var fhir = require('../fhir');

describe('fhir', function () {
    it('should preprocess template correctly.', function () {
        var result = new fhir().preProcessTemplate('{{PID-2}}');
        assert.equal(result, '{{PID-2}}');
    });

    it('should postprocess result correctly.', function () {
        let sampleMsg = "MSH|^~\&|LAB||LAB||202106171125||ORM^O01|2556|D|2.4|||AL|NE"
        var result = new fhir().postProcessResult(sampleMsg);
        assert.equal(result, sampleMsg);
    });

    it('should generate conversion metadata correctly.', function () {
        let data = 'dummy';
        let result = new fhir().getConversionResultMetadata(data);
        assert.equal(JSON.stringify({}), JSON.stringify(result));
    });

    it('should successfully parse ADT data.', async function () {
        let testBundle: R4.IBundle = await got.get("https://b-techbw.github.io/bw-lab-ig/Bundle-example-bw-lab-bundle.json").json()
        let fhirParser = new fhir()
        
        let result = await fhirParser.parseSrcData(testBundle, "ADT")
        
        expect(result._originalData).toEqual(testBundle)
        expect(result.fhir.patientId).toBe(testBundle.entry![1].resource!.id!)

    });

    // it('should successfully parse OBR data.', async function () {
    //     let testBundle: R4.IBundle = await got.get("https://i-tech-uw.github.io/laboratory-workflows-ig/Bundle-example-laboratory-simple-bundle.json").json()
    //     let fhirParser = new fhir().parseSrcData
        
    //     let result = await fhirParser(testBundle, "OBR")
        
    //     expect(result._originalData).toEqual(testBundle)
    //     expect(result.fhir.patientId).toBe(testBundle.entry![1].resource!.id!)

    // });
});
