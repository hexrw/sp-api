import { SellerPerformanceFields } from "./performance"
import { Report } from "../enums"

export interface CreateReportOptions {
    reportType: Report | `${Report}`
    marketplaces?: string[]
    startDate?: string
    endDate?: string
    options?: Record<string, unknown>
}

export interface ActiveListingsFields {
    "item-name": string
    "item-description": string
    "listing-id": string
    "seller-sku": string
    price: string
    quantity: string
    "open-date": string
    "image-url": string
    "item-is-marketplace": string
    "product-id-type": string
    "zshop-shipping-fee": string
    "item-note": string
    "item-condition": string
    "zshop-category1": string
    "zshop-browse-path": string
    "zshop-storefront-feature": string
    asin1: string
    asin2: string
    asin3: string
    "will-ship-internationally": string
    "expedited-shipping": string
    "zshop-boldface": string
    "product-id": string
    "bid-for-featured-placement": string
    "add-delete": string
    "pending-quantity": string
    "fulfillment-channel": string
    "Business Price": string
    "Quantity Price Type": string
    "Quantity Lower Bound 1": string
    "Quantity Price 1": string
    "Quantity Lower Bound 2": string
    "Quantity Price 2": string
    "Quantity Lower Bound 3": string
    "Quantity Price 3": string
    "Quantity Lower Bound 4": string
    "Quantity Price 4": string
    "Quantity Lower Bound 5": string
    "Quantity Price 5": string
    "merchant-shipping-group": string
    "Progressive Price Type": string
    "Progressive Lower Bound 1": string
    "Progressive Price 1": string
    "Progressive Lower Bound 2": string
    "Progressive Price 2": string
    "Progressive Lower Bound 3": string
    "Progressive Price 3": string
}

export interface AllListingsFields {
    "item-name": string
    "item-description": string
    "listing-id": string
    "seller-sku": string
    price: string
    quantity: string
    "open-date": string
    "image-url": string
    "item-is-marketplace": string
    "product-id-type": string
    "zshop-shipping-fee": string
    "item-note": string
    "item-condition": string
    "zshop-category1": string
    "zshop-browse-path": string
    "zshop-storefront-feature": string
    asin1: string
    asin2: string
    asin3: string
    "will-ship-internationally": string
    "expedited-shipping": string
    "zshop-boldface": string
    "product-id": string
    "bid-for-featured-placement": string
    "add-delete": string
    "pending-quantity": string
    "fulfillment-channel": string
    "optional-payment-type-exclusion": string
    "merchant-shipping-group": string
    status: string
    "Minimum order quantity": string
    "Sell remainder": string
}

/**
 * @summary XML response from the BROSE_TREE report type parsed into a JSON object
 * */
export interface BrowseTreeFields {
    query: string
    Node: {
        browseNodeId: string
        browseNodeAttributes: {
            count: string
            attribute: {
                name: string
                _: string
            }
        }
        browseNodeName: string
        browseNodeStoreContextName: string
        browsePathById: string
        browsePathByName: string
        hasChildren: string
        childNodes: {
            count: string
        }
        productTypeDefinitions: string
        refinementsInformation: {
            count: string
        }
    }
}

export interface InactiveListingsFields {
    "item-name": string
    "item-description": string
    "listing-id": string
    "seller-sku": string
    price: string
    quantity: string
    "open-date": string
    "image-url": string
    "item-is-marketplace": string
    "product-id-type": string
    "zshop-shipping-fee": string
    "item-note": string
    "item-condition": string
    "zshop-category1": string
    "zshop-browse-path": string
    "zshop-storefront-feature": string
    asin1: string
    asin2: string
    asin3: string
    "will-ship-internationally": string
    "expedited-shipping": string
    "zshop-boldface": string
    "product-id": string
    "bid-for-featured-placement": string
    "add-delete": string
    "pending-quantity": string
    "fulfillment-channel": string
    "merchant-shipping-group": string
}

export interface OrdersByCreatedDateFields {
    "amazon-order-id": string
    "merchant-order-id": string
    "purchase-date": string
    "last-updated-date": string
    "order-status": "Shipped" | "Cancelled" | "Shipping" | "Pending" | "Unshipped"
    "fulfillment-channel": string
    "sales-channel": string
    "order-channel": string
    "ship-service-level": string
    "product-name": string
    sku: string
    asin: string
    "number-of-items": string
    "item-status": "Shipped" | "Unshipped" | "Cancelled" | null | undefined
    "tax-collection-model": string
    "tax-collection-responsible-party": string
    quantity: string
    currency: string
    "item-price": string
    "item-tax": string
    "shipping-price": string
    "shipping-tax": string
    "gift-wrap-price": string
    "gift-wrap-tax": string
    "item-promotion-discount": string
    "ship-promotion-discount": string
    "address-type": string
    "ship-city": string
    "ship-state": string
    "ship-postal-code": string
    "ship-country": string
    "promotion-ids": string
    "payment-method-details": string
    "item-extensions-data": string
    "is-business-order": string
    "purchase-order-number": string
    "price-designation": string
    "fulfilled-by": string
    "buyer-company-name": string
    "buyer-tax-registration-country": string
    "buyer-tax-registration-type": string
    "is-heavy-or-bulky": string
    "is-replacement-order": string
    "is-exchange-order": string
    "original-order-id": string
    "is-amazon-invoiced": string
    "vat-exclusive-item-price": string
    "vat-exclusive-shipping-price": string
    "vat-exclusive-giftwrap-price": string
    "is-iba": string
    "is-buyer-requested-cancellation": string
    "buyer-requested-cancel-reason": string
    "is-transparency": string
    "ioss-number": string
    "order-invoice-type": string
}

export interface OrdersByUpdatedDateFields {
    "amazon-order-id": string
    "merchant-order-id": string
    "purchase-date": string
    "last-updated-date": string
    "order-status": string
    "fulfillment-channel": string
    "sales-channel": string
    "order-channel": string
    "ship-service-level": string
    "product-name": string
    sku: string
    asin: string
    "item-status": string
    quantity: string
    currency: string
    "item-price": string
    "item-tax": string
    "shipping-price": string
    "shipping-tax": string
    "gift-wrap-price": string
    "gift-wrap-tax": string
    "item-promotion-discount": string
    "ship-promotion-discount": string
    "ship-city": string
    "ship-state": string
    "ship-postal-code": string
    "ship-country": string
    "promotion-ids": string
    "is-business-order": string
    "purchase-order-number": string
    "price-designation": string
}

export interface ReferralFeePreviewFields {
    "seller-sku": string
    asin: string
    "item-name": string
    price: string
    "estimated-referral-fee-per-item": string
}

export interface ReturnsByReturnDateFields {
    "Order ID": string
    "Order date": string
    "Return request date": string
    "Return request status": string
    "Amazon RMA ID": string
    "Merchant RMA ID": string
    "Label type": string
    "Label cost": string
    "Currency code": string
    "Return carrier": string
    "Tracking ID": string
    "Label to be paid by": string
    "A-to-Z Claim": string
    "Is prime": string
    ASIN: string
    "Merchant SKU": string
    "Item Name": string
    "Return quantity": string
    "Return Reason": string
    "In policy": string
    "Return type": string
    Resolution: string
    "Invoice number": string
    "Return delivery date": string
    "Order Amount": string
    "Order quantity": string
    "SafeT Action reason": string
    "SafeT claim id": string
    "SafeT claim state": string
    "SafeT claim creation time": string
    "SafeT claim reimbursement amount": string
    "Refunded Amount": string
}

export interface RepeatPurchaseFields {
    startDate: string
    endDate: string
    asin: string
    orders: number
    uniqueCustomers: number
    repeatCustomersPctTotal: number
    repeatPurchaseRevenue: {
        amount: number
        currencyCode: string
    }
    repeatPurchaseRevenuePctTotal: number
}

export interface SalesAndTrafficFields {
    salesAndTrafficByDate: {
        date: string
        salesByDate: {
            orderedProductSales: {
                amount: number
                currencyCode: string
            }
            unitsOrdered: number
            totalOrderItems: number
            averageSalesPerOrderItem: {
                amount: number
                currencyCode: string
            }
            averageUnitsPerOrderItem: number
            averageSellingPrice: {
                amount: number
                currencyCode: string
            }
            unitsRefunded: number
            refundRate: number
            claimsGranted: number
            claimsAmount: {
                amount: number
                currencyCode: string
            }
            shippedProductSales: {
                amount: number
                currencyCode: string
            }
            unitsShipped: number
            ordersShipped: number
        }
        trafficByDate: {
            browserPageViews: number
            mobileAppPageViews: number
            pageViews: number
            browserSessions: number
            mobileAppSessions: number
            sessions: number
            buyBoxPercentage: number
            orderItemSessionPercentage: number
            unitSessionPercentage: number
            averageOfferCount: number
            averageParentItems: number
            feedbackReceived: number
            negativeFeedbackReceived: number
            receivedNegativeFeedbackRate: number
        }
    }[]
}

export interface SearchTermsFields {
    searchTerm: string
    searchFrequencyRank: string
    clickedAsin: string
    clickShareRank: string
    clickShare: string
    conversionShare: string
}

export interface FbaInventoryFields {
    "seller-sku": string
    "fulfillment-channel-sku": string
    asin: string
    "condition-type": string
    "Warehouse-Condition-code": string
    "Quantity Available": string
}

export interface FbaStorageFeesFields {
    asin
    fnsku
    product_name
    fulfillment_center
    country_code
    longest_side
    median_side
    shortest_side
    measurement_units
    weight
    weight_units
    item_volume
    volume_units
    product_size_tier
    average_quantity_on_hand
    average_quantity_pending_removal
    estimated_total_item_volume
    month_of_charge
    storage_rate
    base_rate
    currency
    estimated_monthly_storage_fee
    dangerous_goods_storage_type
    eligible_for_inventory_discount
    qualifies_for_inventory_discount
    total_incentive_fee_amount
    breakdown_incentive_fee_amount
    average_quantity_customer_orders
}
export interface FbaOverageFeesFields {
    charged_date
    country_code
    storage_type
    charge_rate
    storage_usage_volume
    storage_limit_volume
    overage_volume
    volume_unit
    charged_fee_amount
    currency_code
}
export interface FbaLongTermStorageFeesFields {
    "snapshot-date": string
    sku: string
    fnsku: string
    asin: string
    "product-name": string
    condition: string
    "per-unit-volume": string
    currency: string
    "volume-unit": string
    country: string
    "qty-charged": string
    "amount-charged": string
    "surcharge-age-tier": string
    "rate-surcharge": string
}
export interface FbaEstimatedFeesFields {
    sku: string
    fnsku: string
    asin: string
    "amazon-store": string
    "product-name": string
    "product-group": string
    brand: string
    "fulfilled-by": string
    "has-local-inventory": string
    "your-price": string
    "sales-price": string
    "longest-side": string
    "median-side": string
    "shortest-side": string
    "length-and-girth": string
    "unit-of-dimension": string
    "item-package-weight": string
    "unit-of-weight": string
    "product-size-weight-band": string
    currency: string
    "estimated-fee-total": string
    "estimated-referral-fee-per-unit": string
    "estimated-variable-closing-fee": string
    "expected-domestic-fulfilment-fee-per-unit": string
    "expected-efn-fulfilment-fee-per-unit-uk": string
    "expected-efn-fulfilment-fee-per-unit-de": string
    "expected-efn-fulfilment-fee-per-unit-fr": string
    "expected-efn-fulfilment-fee-per-unit-it": string
    "expected-efn-fulfilment-fee-per-unit-es": string
    "expected-efn-fulfilment-fee-per-unit-se": string
}

export interface FbaReturnsFields {
    "return-date": string
    "order-id": string
    sku: string
    asin: string
    fnsku: string
    "product-name": string
    quantity: string
    "fulfillment-center-id": string
    "detailed-disposition": string
    reason: string
    status: string
    "license-plate-number": string
    "customer-comments": string
}
export interface FbaManageInventoryFields {
    sku: string
    fnsku: string
    asin: string
    "product-name": string
    condition: string
    "your-price": string
    "mfn-listing-exists": string
    "mfn-fulfillable-quantity": string
    "afn-listing-exists": string
    "afn-warehouse-quantity": string
    "afn-fulfillable-quantity": string
    "afn-unsellable-quantity": string
    "afn-reserved-quantity": string
    "afn-total-quantity": string
    "per-unit-volume": string
    "afn-inbound-working-quantity": string
    "afn-inbound-shipped-quantity": string
    "afn-inbound-receiving-quantity": string
    "afn-researching-quantity": string
    "afn-reserved-future-supply": string
    "afn-future-supply-buyable": string
    "afn-fulfillable-quantity-local": string
    "afn-fulfillable-quantity-remote": string
    store: string
}

export interface FbaRestockInventoryRecommendationsFields {
    Country: string
    "Product Name": string
    FNSKU: string
    "Merchant SKU": string
    ASIN: string
    Condition: string
    Supplier: string
    "Supplier part no.": string
    "Currency code": string
    Price: string
    "Sales last 30 days": string
    "Units Sold Last 30 Days": string
    "Total Units": string
    Inbound: string
    Available: string
    "FC transfer": string
    "FC Processing": string
    "Customer Order": string
    Unfulfillable: string
    Working: string
    Shipped: string
    Receiving: string
    "Fulfilled by": string
    "Total Days of Supply (including units from open shipments)": string
    "Days of Supply at Amazon Fulfillment Network": string
    Alert: string
    "Recommended replenishment qty": string
    "Recommended ship date": string
    "Unit storage size": string
}

export interface OpenListingsFields {
    sku: string
    asin: string
    price: string
    quantity: string
    "Business Price": string
    "Quantity Price Type": string
    "Quantity Lower Bound 1": string
    "Quantity Price 1": string
    "Quantity Lower Bound 2": string
    "Quantity Price 2": string
    "Quantity Lower Bound 3": string
    "Quantity Price 3": string
    "Quantity Lower Bound 4": string
    "Quantity Price 4": string
    "Quantity Lower Bound 5": string
    "Quantity Price 5": string
    "Progressive Price Type": string
    "Progressive Lower Bound 1": string
    "Progressive Price 1": string
    "Progressive Lower Bound 2": string
    "Progressive Price 2": string
    "Progressive Lower Bound 3": string
    "Progressive Price 3": string
    "Minimum order quantity": string
    "Sell remainder": string
}
export interface FbaInventoryPlanningDataReportFields {
    "snapshot-date": string
    sku: string
    fnsku: string
    asin: string
    "product-name": string
    condition: string
    available: string
    "pending-removal-quantity": string
    "inv-age-0-to-90-days": string
    "inv-age-91-to-180-days": string
    "inv-age-181-to-270-days": string
    "inv-age-271-to-365-days": string
    "inv-age-365-plus-days": string
    currency: string
    "qty-to-be-charged-ltsf-11-mo"?: string
    "projected-ltsf-11-mo"?: string
    "qty-to-be-charged-ltsf-12-mo"?: string
    "estimated-ltsf-next-charge"?: string
    "units-shipped-t7": string
    "units-shipped-t30": string
    "units-shipped-t60": string
    "units-shipped-t90": string
    alert: string
    "your-price": string
    "sales-price": string
    "lowest-price-new-plus-shipping": string
    "lowest-price-used": string
    "recommended-action": string
    "healthy-inventory-level": string
    "recommended-sales-price": string
    "recommended-sale-duration-days": string
    "recommended-removal-quantity": string
    "estimated-cost-savings-of-recommended-actions": string
    "sell-through": string
    "item-volume": string
    "volume-unit-measurement": string
    "storage-type": string
    "storage-volume": string
    marketplace: string
    "product-group": string
    "sales-rank": string
    "days-of-supply": string
    "estimated-excess-quantity": string
    "weeks-of-cover-t30": string
    "weeks-of-cover-t90": string
    "featuredoffer-price": string
    "sales-shipped-last-7-days": string
    "sales-shipped-last-30-days": string
    "sales-shipped-last-60-days": string
    "sales-shipped-last-90-days": string
    "inv-age-0-to-30-days": string
    "inv-age-31-to-60-days": string
    "inv-age-61-to-90-days": string
    "inv-age-181-to-330-days": string
    "inv-age-331-to-365-days": string
    "estimated-storage-cost-next-month": string
    "inbound-quantity": string
    "inbound-working": string
    "inbound-shipped": string
    "inbound-received": string
    "no-sale-last-6-months"?: string
    "reserved-quantity"?: string
    "Total Reserved Quantity"?: string
    "unfulfillable-quantity": string
    "quantity-to-be-charged-ais-181-210-days"?: string
    "estimated-ais-181-210-days"?: string
    "quantity-to-be-charged-ais-211-240-days"?: string
    "estimated-ais-211-240-days"?: string
    "quantity-to-be-charged-ais-241-270-days"?: string
    "estimated-ais-241-270-days"?: string
    "quantity-to-be-charged-ais-271-300-days"?: string
    "estimated-ais-271-300-days"?: string
    "quantity-to-be-charged-ais-301-330-days"?: string
    "estimated-ais-301-330-days"?: string
    "quantity-to-be-charged-ais-331-365-days"?: string
    "estimated-ais-331-365-days"?: string
    "quantity-to-be-charged-ais-365-plus-days"?: string
    "estimated-ais-365-plus-days"?: string
    "historical-days-of-supply": string
    "fba-minimum-inventory-level": string
    "fba-inventory-level-health-status": string
    "Recommended ship-in quantity": string
    "Recommended ship-in date": string
    "Last updated date for Historical Days of Supply": string
    "Exempted from Low-Inventory cost coverage fee?": string
    "Low-Inventory cost coverage fee applied in current week?": string
    "Short term historical days of supply": string
    "Long term historical days of supply": string
    "Inventory age snapshot date": string
    "Inventory Supply at FBA": string
    "Reserved FC Transfer": string
    "Reserved FC Processing": string
    "Reserved Customer Order": string
    "Total Days of Supply (including units from open shipments)": string
}

export interface OpenListingsLiterFields {
    "seller-sku": string
    quantity: string
}

export interface Reports {
    [Report.ActiveListings]: ActiveListingsFields
    [Report.AllListings]: AllListingsFields
    [Report.OpenListings]: OpenListingsFields
    [Report.OpenListingsLiter]: OpenListingsLiterFields
    [Report.InactiveListings]: InactiveListingsFields
    [Report.OrdersByCreatedDate]: OrdersByCreatedDateFields
    [Report.OrdersByLastUpdate]: OrdersByUpdatedDateFields
    [Report.ReferralFeePreview]: ReferralFeePreviewFields
    [Report.RepeatPurchase]: RepeatPurchaseFields
    [Report.ReturnsByReturnDate]: ReturnsByReturnDateFields
    [Report.SalesAndTraffic]: SalesAndTrafficFields
    [Report.SellerPerformance]: SellerPerformanceFields
    [Report.SearchTerms]: SearchTermsFields
    [Report.BrowseTree]: BrowseTreeFields
    [Report.FbaStorageFees]: FbaStorageFeesFields
    [Report.FbaOverageFees]: FbaOverageFeesFields
    [Report.FbaLongTermStorageFees]: FbaLongTermStorageFeesFields
    [Report.FbaEstimatedFees]: FbaEstimatedFeesFields
    [Report.FbaReturns]: FbaReturnsFields
    [Report.FbaInventory]: FbaInventoryFields
    [Report.FbaManageInventory]: FbaManageInventoryFields
    [Report.FbaRestockInventoryRecommendations]: FbaRestockInventoryRecommendationsFields
    [Report.FbaRecommendedRemoval]: any
    [Report.FbaInventoryPlanningData]: FbaInventoryPlanningDataReportFields
    [Report.GetAfnInventoryDataByCountry]: any
}

export type GetReportFields<T extends Report> = Reports[T]
