import { Marketplace } from "./enums"

export const AmazonSellerIdsList = [
    "A3P5ROKL5A1OLE",
    "A3JWKAKR8XB7XF",
    "A1X6FK5RDHNB96",
    "A11IL2PNWYJU7H",
    "A1AT7YVPFBWXBL",
    "A3Q3FYJVX702M2",
    "A17D2BRD4YMT0X",
    "A2R2221NX79QZP",
    "ANU9KP01APNAG",
    "A3DWYIK6Y9EEQB",
    "ATVPDKIKX0DER",
    "AN1VRQENFRJN5",
]

export const MarketplaceIdToName = {
    [Marketplace.UK]: "United Kingdom",
    [Marketplace.US]: "United States",
    [Marketplace.AE]: "United Arab Emirates",
    [Marketplace.ZA]: "South Africa",
    [Marketplace.SA]: "Saudi Arabia",
    [Marketplace.NL]: "Netherlands",
    [Marketplace.SG]: "Singapore",
    [Marketplace.AU]: "Australia",
    [Marketplace.ES]: "Spain",
    [Marketplace.BE]: "Belgium",
    [Marketplace.DE]: "Germany",
    [Marketplace.CA]: "Canada",
    [Marketplace.MX]: "Mexico",
    [Marketplace.BR]: "Brazil",
    [Marketplace.TR]: "Turkey",
    [Marketplace.FR]: "France",
    [Marketplace.SE]: "Sweden",
    [Marketplace.PL]: "Poland",
    [Marketplace.IE]: "Ireland",
    [Marketplace.EG]: "Egypt",
    [Marketplace.IT]: "Italy",
    [Marketplace.IN]: "India",
    [Marketplace.JP]: "Japan",
}

export const MarketplaceNative = {
    CA: Marketplace.CA,
    US: Marketplace.US,
    MX: Marketplace.MX,
    BR: Marketplace.BR,
    ES: Marketplace.ES,
    UK: Marketplace.UK,
    FR: Marketplace.FR,
    BE: Marketplace.BE,
    NL: Marketplace.NL,
    DE: Marketplace.DE,
    IT: Marketplace.IT,
    SE: Marketplace.SE,
    ZA: Marketplace.ZA,
    PL: Marketplace.PL,
    EG: Marketplace.EG,
    TR: Marketplace.TR,
    SA: Marketplace.SA,
    AE: Marketplace.AE,
    IN: Marketplace.IN,
    SG: Marketplace.SG,
    AU: Marketplace.AU,
    JP: Marketplace.JP,
    IE: Marketplace.IE,
    GB: Marketplace.UK, // GB is used for UK randomly in some places
}

export const Endpoint = {
    na: {
        api: "https://sellingpartnerapi-na.amazon.com",
        sandbox: "https://sandbox.sellingpartnerapi-na.amazon.com",
        token: "https://api.amazon.com/auth/o2/token",
    },
    eu: {
        api: "https://sellingpartnerapi-eu.amazon.com",
        sandbox: "https://sandbox.sellingpartnerapi-eu.amazon.com",
        token: "https://api.amazon.co.uk/auth/o2/token",
    },
    fe: {
        api: "https://sellingpartnerapi-fe.amazon.com",
        sandbox: "https://sandbox.sellingpartnerapi-fe.amazon.com",
        token: "https://api.amazon.co.jp/auth/o2/token",
    },
}

export const Regions = {
    NA: {
        ENDPOINT: "https://sellingpartnerapi-na.amazon.com",
        SANDBOX_ENDPOINT: "https://sandbox.sellingpartnerapi-na.amazon.com",
        AUTH_ENDPOINT: "https://api.amazon.com/auth/o2/token",
    },
    EU: {
        ENDPOINT: "https://sellingpartnerapi-eu.amazon.com",
        SANDBOX_ENDPOINT: "https://sandbox.sellingpartnerapi-eu.amazon.com",
        AUTH_ENDPOINT: "https://api.amazon.co.uk/auth/o2/token",
    },
    FE: {
        ENDPOINT: "https://sellingpartnerapi-fe.amazon.com",
        SANDBOX_ENDPOINT: "https://sandbox.sellingpartnerapi-fe.amazon.com",
        AUTH_ENDPOINT: "https://api.amazon.co.jp/auth/o2/token",
    },
} as const

export const BaseNotifications = [
    { type: "REPORT_PROCESSING_FINISHED", version: "2020-09-04" },
    { type: "DATA_KIOSK_QUERY_PROCESSING_FINISHED", version: "2023-11-15" },
]
export const OtherNotifications = [
    //{ type: "FBA_INVENTORY_AVAILABILITY_CHANGES", version: "1.0" },
    //{ type: "PRICING_HEALTH", version: "1.0" },
    //{ type: "LISTINGS_ITEM_STATUS_CHANGE", version:"1.0" }
]
export const ProMembershipNotifications = [{ type: "ANY_OFFER_CHANGED", version: "1.0" }]

export const NotificationsQueueDestinationId = "40e2b717-bede-4b12-8525-a3fc38a65b2c"

export const RateLimits = new Set([
    [
        ["/batches/pricing", "POST"],
        {
            rate: 0.033,
            burst: 1,
        },
    ],
    [
        ["/reports/2021-06-30/report", "POST"],
        {
            rate: 0.0167,
            burst: 15,
        },
    ],
])

export const ConditionMap = new Map([
    ["1", "used-like-new"],
    ["2", "used-very-good"],
    ["3", "used-good"],
    ["4", "used-acceptable"],
    ["5", "collectible-like-new"],
    ["6", "collectible-very-good"],
    ["7", "collectible-good"],
    ["8", "collectible-acceptable"],
    ["9", "not-used"],
    ["10", "refurbished"],
    ["11", "new"],
])
