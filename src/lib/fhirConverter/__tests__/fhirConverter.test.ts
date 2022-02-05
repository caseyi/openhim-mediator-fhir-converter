"use strict";

import FhirConverter from '../fhirConverter'
import { R4 } from '@ahryman40k/ts-fhir-types'
import got from 'got'

describe('translateBundle', 
  () => { 
    beforeEach(() => {
      jest.setTimeout(25000);
    })

    it('should return a HL7v2 Message', async () => { 

      let testBundle: R4.IBundle = await got.get("https://b-techbw.github.io/bw-lab-ig/Bundle-example-bw-lab-bundle.json").json()

      let fc = new FhirConverter(testBundle, 'OBR.hbs')

      const result = await fc.translateBundle();

      expect(result.resultMsg).toMatch("|");
      expect(result.resultMsg).toMatch(testBundle.entry![1].resource!.id!) 
  }); 
});