export interface SellerPerformanceFields {
    accountStatuses: {
        marketplaceId: string
        status: string
    }[]
    performanceMetrics: {
        lateShipmentRate: LateShipmentRate
        lateShipmentRateList: LateShipmentRate[]
        invoiceDefectRate: {
            reportingDateRange: ReportingDateRange
            status: string
            targetValue: number
            targetCondition: string
            invoiceDefect: Count
            missingInvoice: Count
            lateInvoice: Count
            orderCount: number
            rate: number
        }
        orderDefectRate: {
            afn: OrderDefectRate
            mfn: OrderDefectRate
        }
        onTimeDeliveryRate: {
            reportingDateRange: ReportingDateRange
            status: string
            targetValue: number
            targetCondition: string
            shipmentCountWithValidTracking: number
            onTimeDeliveryCount: number
            rate: number
        }
        validTrackingRate: {
            reportingDateRange: ReportingDateRange
            status: string
            targetValue: number
            targetCondition: string
            shipmentCount: number
            validTrackingCount: number
            rate: number
        }
        preFulfillmentCancellationRate: {
            reportingDateRange: ReportingDateRange
            status: string
            targetValue: number
            targetCondition: string
            orderCount: number
            cancellationCount: number
            rate: number
        }
        warningStates: unknown[]
        accountHealthRating: {
            ahrStatus: string
            reportingDateRange: ReportingDateRange
            ahrScore: number
        }
        listingPolicyViolations: ViolationsComplaints
        productAuthenticityCustomerComplaints: ViolationsComplaints
        productConditionCustomerComplaints: ViolationsComplaints
        productSafetyCustomerComplaints: ViolationsComplaints
        receivedIntellectualPropertyComplaints: ViolationsComplaints
        restrictedProductPolicyViolations: ViolationsComplaints
        suspectedIntellectualPropertyViolations: ViolationsComplaints
        foodAndProductSafetyIssues: ViolationsComplaints
        customerProductReviewsPolicyViolations: ViolationsComplaints
        otherPolicyViolations: ViolationsComplaints
        documentRequests: ViolationsComplaints
        policyViolationWarnings: {
            warningsCount: number
            reportingDateRange: ReportingDateRange
        }
        marketplaceId: string
    }[]
}

interface LateShipmentRate {
    reportingDateRange: ReportingDateRange
    status: string
    targetValue: number
    targetCondition: string
    orderCount: number
    lateShipmentCount: number
    rate: number
}

interface OrderDefectRate {
    reportingDateRange: ReportingDateRange
    status: string
    targetValue: number
    targetCondition: string
    orderWithDefects: Count
    claims: Count
    chargebacks: Count
    negativeFeedback: Count
    orderCount: number
    rate: number
    fulfillmentType: string
}

interface ViolationsComplaints {
    reportingDateRange: ReportingDateRange
    status: string
    targetValue: number
    targetCondition: string
    defectsCount: number
}

interface Count {
    status: string
    count: number
}

interface ReportingDateRange {
    reportingDateFrom: string
    reportingDateTo: string
}
