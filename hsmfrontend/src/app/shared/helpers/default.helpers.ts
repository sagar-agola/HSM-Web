import { IFMEA, IFmeaAssembly, IFMEAImport, IFmeaSiteAssembly, IFMUFTSite, IFMUFTSiteImport } from "src/app/hsm/interfaces/IFMEA";

export function fmeaDefault(): IFMEA {
    return {
        id: 0,
        componentHierarchyId: 0,
        systemDescription: '',
        componentLevel1Id: 0,
        // componentLevel2Id: 0,
        // componentLevel3Id: 0,
        taskIdentificationNo: '',
        componentTaskFunction: '',
        failureMode: '',
        failureEffect: '',
        failureCause: '',
        endEffect: '',
        taskDescription: '',
        acceptableLimits: '',
        correctiveActions: '',
        taskTypeId: 0,
        operationalModeId: 0,
        failureRiskTotalScore: 0,
        intervalId: 0,
        durationId: 0,
        resourceQuantity: '',
        tradeTypeId: 0,
        parentCode: '',
        origIndic: 0,
        // componentLevel4Id: 0,
        familyTaxonomyId: 0,
        classTaxonomyId: 0,
        subClassTaxonomyId: 0,
        buildSpecTaxonomyId: 0,
        manufacturerTaxonomyId: 0,
        variantId: 0,
        comment: '',
        createdBy: '',
        updatedBy: '',
        dtCreated:undefined,
        dtUpdated:undefined,
        systemStatus: 0
    }
}

export function fmeaImportDefault(): IFMEAImport {
    return {
        componentHierarchyId: '',
        systemDescription: '',
        componentLevel1Id: '',
        taskIdentificationNo: '',
        componentTaskFunction: '',
        failureMode: '',
        failureEffect: '',
        failureCause: '',
        endEffect: '',
        taskDescription: '',
        acceptableLimits: '',
        correctiveActions: '',
        taskTypeId: '',
        operationalModeId: '',
        failureRiskTotalScore: 0,
        intervalId: '',
        durationId: '',
        resourceQuantity: '',
        tradeTypeId: '',
        parentCode: '',
        origIndic: 0,
        familyTaxonomyId: '',
        classTaxonomyId: '',
        subClassTaxonomyId: '',
        buildSpecTaxonomyId: '',
        manufacturerTaxonomyId: '',
        variantId: 0,
        comment: '',
        createdBy: '',
        updatedBy: '',
        dtCreated:undefined,
        dtUpdated:undefined,
        systemStatus: 0
    }
}

export function fmuftSiteDefault(): IFMUFTSite {
    return {
        id: 0,
        componentHierarchyId: 0,
        systemDescription: '',
        componentLevel1Id: 0,
        taskIdentificationNo: '',
        componentTaskFunction: '',
        failureMode: '',
        failureEffect: '',
        failureCause: '',
        endEffect: '',
        taskDescription: '',
        acceptableLimits: '',
        correctiveActions: '',
        taskTypeId: 0,
        operationalModeId: 0,
        failureRiskTotalScore: 0,
        intervalId: 0,
        durationId: 0,
        resourceQuantity: '',
        tradeTypeId: 0,
        parentCode: '',
        origIndic: 0,
        familyTaxonomyId: 0,
        classTaxonomyId: 0,
        subClassTaxonomyId: 0,
        buildSpecTaxonomyId: 0,
        manufacturerTaxonomyId: 0,
        variantId: 0,
        comment: '',
        createdBy: '',
        updatedBy: '',
        dtCreated:undefined,
        dtUpdated:undefined,
        systemStatus: 0,
        siteId: 0,
        customerId: 0
    }
}

export function fmuftSiteImportDefault(): IFMUFTSiteImport {
    return {
        componentHierarchyId: '',
        systemDescription: '',
        componentLevel1Id: '',
        taskIdentificationNo: '',
        componentTaskFunction: '',
        failureMode: '',
        failureEffect: '',
        failureCause: '',
        endEffect: '',
        taskDescription: '',
        acceptableLimits: '',
        correctiveActions: '',
        taskTypeId: '',
        operationalModeId: '',
        failureRiskTotalScore: 0,
        intervalId: '',
        durationId: '',
        resourceQuantity: '',
        tradeTypeId: '',
        parentCode: '',
        origIndic: 0,
        familyTaxonomyId: '',
        classTaxonomyId: '',
        subClassTaxonomyId: '',
        buildSpecTaxonomyId: '',
        manufacturerTaxonomyId: '',
        variantId: 0,
        comment: '',
        createdBy: '',
        updatedBy: '',
        dtCreated:undefined,
        dtUpdated:undefined,
        systemStatus: 0,
        site: 0,
        customerId: 0
    }
}

export function fmeaAssemblyDefault(): IFmeaAssembly {
    return {
        id: 0,
        componentHierarchyId: 0,
        systemDescription: '',
        componentLevel1Id: 0,
        taskIdentificationNo: '',
        componentTaskFunction: '',
        failureMode: '',
        failureEffect: '',
        failureCause: '',
        endEffect: '',
        taskDescription: '',
        acceptableLimits: '',
        correctiveActions: '',
        taskTypeId: 0,
        operationalModeId: 0,
        failureRiskTotalScore: 0,
        intervalId: 0,
        durationId: 0,
        resourceQuantity: '',
        tradeTypeId: 0,
        parentCode: '',
        origIndic: 0,
        familyTaxonomyId: 0,
        classTaxonomyId: 0,
        subClassTaxonomyId: 0,
        buildSpecTaxonomyId: 0,
        manufacturerTaxonomyId: 0,
        variantId: 0,
        categoryId: 0,
        fmmtId: 0,
        comment: '',
        createdBy: '',
        updatedBy: '',
        dtCreated: undefined,
        dtUpdated: undefined,
        systemStatus: 0
    }
}

export function fmeaSiteAssemblyDefault(): IFmeaSiteAssembly {
    return {
        id: 0,
        componentHierarchyId: 0,
        systemDescription: '',
        componentLevel1Id: 0,
        taskIdentificationNo: '',
        componentTaskFunction: '',
        failureMode: '',
        failureEffect: '',
        failureCause: '',
        endEffect: '',
        taskDescription: '',
        acceptableLimits: '',
        correctiveActions: '',
        taskTypeId: 0,
        operationalModeId: 0,
        failureRiskTotalScore: 0,
        intervalId: 0,
        durationId: 0,
        resourceQuantity: '',
        tradeTypeId: 0,
        parentCode: '',
        origIndic: 0,
        familyTaxonomyId: 0,
        classTaxonomyId: 0,
        subClassTaxonomyId: 0,
        buildSpecTaxonomyId: 0,
        manufacturerTaxonomyId: 0,
        variantId: 0,
        categoryId: 0,
        fmmtId: 0,
        comment: '',
        createdBy: '',
        updatedBy: '',
        dtCreated: undefined,
        dtUpdated: undefined,
        systemStatus: 0
    }
}