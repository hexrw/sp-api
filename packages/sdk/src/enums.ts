export enum Marketplace {
    CA = "A2EUQ1WTGCTBG2",
    US = "ATVPDKIKX0DER",
    MX = "A1AM78C64UM0Y8",
    BR = "A2Q3Y263D00KWC",
    ES = "A1RKKUPIHCS9HS",
    UK = "A1F83G8C2ARO7P",
    FR = "A13V1IB3VIYZZH",
    BE = "AMEN7PMS3EDWL",
    NL = "A1805IZSGTT6HS",
    DE = "A1PA6795UKMFR9",
    IT = "APJ6JRA9NG5V4",
    SE = "A2NODRKZP88ZB9",
    ZA = "AE08WJ6YKNBMC",
    PL = "A1C3SOZRARQ6R3",
    EG = "ARBP9OOSHTCHU",
    TR = "A33AVAJ2PDY3EV",
    SA = "A17E79C6D8DWNP",
    AE = "A2VIGQ35RCS4UG",
    IN = "A21TJRUUN4KGV",
    SG = "A19VAU5U5O7RUS",
    AU = "A39IBJ37TRP1C6",
    JP = "A1VC38T7YXB528",
    IE = "A28R8C7NBKEWEA",
}

export enum Report {
    OrdersByCreatedDate = "GET_FLAT_FILE_ALL_ORDERS_DATA_BY_ORDER_DATE_GENERAL",
    OrdersByLastUpdate = "GET_FLAT_FILE_ALL_ORDERS_DATA_BY_LAST_UPDATE_GENERAL",
    ReturnsByReturnDate = "GET_FLAT_FILE_RETURNS_DATA_BY_RETURN_DATE",
    SellerPerformance = "GET_V2_SELLER_PERFORMANCE_REPORT",
    AllListings = "GET_MERCHANT_LISTINGS_ALL_DATA",
    ActiveListings = "GET_MERCHANT_LISTINGS_DATA",
    InactiveListings = "GET_MERCHANT_LISTINGS_INACTIVE_DATA",
    OpenListings = "GET_FLAT_FILE_OPEN_LISTINGS_DATA",
    OpenListingsLiter = "GET_MERCHANT_LISTINGS_DATA_LITER",
    BrowseTree = "GET_XML_BROWSE_TREE_DATA",
    ReferralFeePreview = "GET_REFERRAL_FEE_PREVIEW_REPORT",
    SalesAndTraffic = "GET_SALES_AND_TRAFFIC_REPORT",
    RepeatPurchase = "GET_BRAND_ANALYTICS_REPEAT_PURCHASE_REPORT",
    SearchTerms = "GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT",
    FbaInventory = "GET_AFN_INVENTORY_DATA",
    FbaManageInventory = "GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA",
    FbaStorageFees = "GET_FBA_STORAGE_FEE_CHARGES_DATA",
    FbaOverageFees = "GET_FBA_OVERAGE_FEE_CHARGES_DATA",
    FbaEstimatedFees = "GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA",
    FbaReturns = "GET_FBA_FULFILLMENT_CUSTOMER_RETURNS_DATA",
    FbaLongTermStorageFees = "GET_FBA_FULFILLMENT_LONGTERM_STORAGE_FEE_CHARGES_DATA",
    FbaRecommendedRemoval = "GET_FBA_RECOMMENDED_REMOVAL_DATA",
    FbaRestockInventoryRecommendations = "GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT",
    GetAfnInventoryDataByCountry ="GET_AFN_INVENTORY_DATA_BY_COUNTRY",
    FbaInventoryPlanningData = "GET_FBA_INVENTORY_PLANNING_DATA",
}
export enum Query {
    SalesAndTraffic = "getSkuSalesTraffic",
    EconomicsPreview = "getEconomicsPreview30",
}

export enum ReportStatus {
    Cancelled = "CANCELLED",
    Done = "DONE",
    Fatal = "FATAL",
    InProgress = "IN_PROGRESS",
    InQueue = "IN_QUEUE",
    Lost = "LOST",
    Processed = "PROCESSED",
    Requested = "REQUESTED",
}

export enum AmazonSellerIds {
    UK = "A3P5ROKL5A1OLE",
    DE = "A3JWKAKR8XB7XF",
    FR = "A1X6FK5RDHNB96",
    IT = "A11IL2PNWYJU7H",
    ES = "A1AT7YVPFBWXBL",
    BE = "A3Q3FYJVX702M2",
    NL = "A17D2BRD4YMT0X",
    PL = "A2R2221NX79QZP",
    SE = "ANU9KP01APNAG",
    CA = "A3DWYIK6Y9EEQB",
    US = "ATVPDKIKX0DER",
    JP = "AN1VRQENFRJN5"
}

export enum AmazonSeller {
    A1F83G8C2ARO7P = "A3P5ROKL5A1OLE",
    A1PA6795UKMFR9 = "A3JWKAKR8XB7XF",
    A13V1IB3VIYZZH = "A1X6FK5RDHNB96",
    APJ6JRA9NG5V4 = "A11IL2PNWYJU7H",
    A1RKKUPIHCS9HS = "A1AT7YVPFBWXBL",
    AMEN7PMS3EDWL = "A3Q3FYJVX702M2",
    A1805IZSGTT6HS = "A17D2BRD4YMT0X",
    A1C3SOZRARQ6R3 = "A2R2221NX79QZP",
    A2NODRKZP88ZB9 = "ANU9KP01APNAG",
    A2EUQ1WTGCTBG2 = "A3DWYIK6Y9EEQB",
    ATVPDKIKX0DER = "ATVPDKIKX0DER",
    A1VC38T7YXB528 = "AN1VRQENFRJN",
}

export enum ItemCondition {
    "club_club",
    "collectible_acceptable",
    "collectible_good",
    "collectible_like_new",
    "collectible_very_good",
    "new_new",
    "new_oem",
    "new_open_box",
    "refurbished_refurbished",
    "used_acceptable",
    "used_good",
    "used_like_new",
    "used_very_good"
}

export enum Region {
    NA = "na",
    EU = "eu",
    FE = "fe",
}

export enum FulfillmentNetwork { MFN = "MFN", AFN = "AFN" }
