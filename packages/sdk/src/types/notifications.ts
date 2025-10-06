export interface BaseNotification {
    NotificationType: string,
    PayloadVersion: string
}
export interface FBAInventoryAvailabilityChangeNotification {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    payload: {
        sellerId: string
        fnsku: string
        asin: string
        sku: string
        fulfillmentInventoryByMarketplace: [{
            marketplaceId: string
            itemName: string
            fulfillmentInventory: {
                inboundQuantityBreakdown: {
                    working: number
                    shipped: number
                    receiving: number
                }
                fulfillable: number
                unfulfillable: number
                researching: number
                reservedQuantityBreakdown: {
                    warehouseProcessing: number
                    warehouseTransfer: number
                    pendingCustomerOrder: number
                }
                futureSupplyBuyable: number
                pendingCustomerOrderInTransit: number
            }
            stores: Array<string>
        }]
    }
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
}

export interface B2bAnyOfferChangedNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
    Payload: {
        [key: string]: any
    }
}

export interface AnyOfferChangedNotification {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
    payload: {
        anyOfferChangedNotification: {
            sellerId: string
            offerChangeTrigger: {
                marketplaceId: string
                asin: string
                itemCondition: string
                timeOfOfferChange: string
                offerChangeType: string
            }
            summary: {
                numberOfOffers: Array<{
                    condition: string
                    fulfillmentChannel: string
                    offerCount: number
                }>
                lowestPrices: Array<{
                    condition: string
                    fulfillmentChannel: string
                    landedPrice: {
                        amount: number
                        currencyCode: string
                    }
                    listingPrice: {
                        amount: number
                        currencyCode: string
                    }
                    shipping: {
                        amount: number
                        currencyCode: string
                    }
                    points?: {
                        pointsNumber: number
                    }
                }>
                buyBoxPrices: Array<{
                    condition: string
                    landedPrice: {
                        amount: number
                        currencyCode: string
                    }
                    listingPrice: {
                        amount: number
                        currencyCode: string
                    }
                    shipping: {
                        amount: number
                        currencyCode: string
                    }
                    points?: {
                        pointsNumber: number
                    }
                }>
                listPrice: {
                    amount: number
                    currencyCode: string
                }
                minimumAdvertisedPrice: {
                    amount: number
                    currencyCode: string
                }
                suggestedLowerPricePlusShipping: {
                    amount: number
                    currencyCode: string
                }
                totalBuyBoxEligibleOffers: number
                salesRankings: Array<{
                    productCategoryId: string
                    rank: number
                }>
                numberOfBuyBoxEligibleOffers: Array<{
                    condition: string
                    fulfillmentChannel: string
                    offerCount: number
                }>
                competitivePriceThreshold: {
                    amount: number
                    currencyCode: string
                }
            }
            offers: Array<{
                sellerId: string
                subCondition: string
                sellerFeedbackRating?: {
                    feedbackCount?: number
                    sellerPositiveFeedbackRating?: number
                }
                shippingTime: {
                    minimumHours: number
                    maximumHours: number
                    availabilityType: string
                    availableDate: string
                }
                listingPrice: {
                    amount: number
                    currencyCode: string
                }
                points: {
                    pointsNumber: number
                }
                shipping: {
                    amount: number
                    currencyCode: string
                }
                shipsFrom: {
                    country: string
                    state: string
                }
                isFulfilledByAmazon: boolean
                primeInformation: {
                    isOfferPrime: boolean
                    isOfferNationalPrime: boolean
                }
                isExpeditedShippingAvailable: boolean
                isFeaturedMerchant: boolean
                shipsDomestically: boolean
                shipsInternationally: boolean
                isBuyBoxWinner: boolean
            }>
        }
    }
}

export interface BrandedItemContentChangeNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        MarketplaceId: string
        BrandName: string
        Asin: string
        AttributesChanged: Array<string>
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface DataKioskQueryProcessingFinishedNotification {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    payload: {
        accountId: string
        queryId: string
        query: string
        processingStatus: string
        dataDocumentId: string
        pagination: {
            nextToken: string
        }
    }
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
}

export interface DetailPageTrafficEventNotification {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    payload: {
        detailPageTrafficEvents: Array<{
            accountId: string
            marketplaceId: string
            startTime: string
            endTime: string
            asin: string
            glanceViews: number
        }>
    }
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
}
export interface FBAOutboundShipmentStatusNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        FBAOutboundShipmentStatusNotification: {
            SellerId: string
            AmazonOrderId: string
            AmazonShipmentId: string
            ShipmentStatus: string
        }
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface FeedProcessingFinishedNotification {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    payload: {
        feedProcessingFinishedNotification: {
            sellerId: string
            accountId: string
            feedId: string
            feedType: string
            processingStatus: string
            resultFeedDocumentId: string
        }
    }
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
}

export interface FeePromotionNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
    Payload: {
        FeePromotionNotification: {
            MerchantId: string
            MarketplaceId: string
            FeePromotionType: string
            FeePromotionTypeDescription: string
            PromotionActiveTimeRange: {
                EffectiveFromDate: string
                EffectiveThroughDate: string
            }
            Identifiers: Array<{
                IdentifierType: string
                IdentifierValues: Array<{
                    IdentifierValueId: string
                    IdentifierValueFriendlyName: string
                }>
            }>
            PromotionInformation: Array<{
                FeeType: string
                FeeDiscountType: string
                FeeDiscountValue: number
                PriceThreshold: {
                    Amount: number
                    CurrencyCode: string
                }
                FeeDiscountMonetaryAmount: {
                    Amount: number
                    CurrencyCode: string
                }
                FeesEstimate: {
                    TimeOfFeesEstimated: string
                    TotalFeesEstimate: {
                        Amount: number
                        CurrencyCode: string
                    }
                    FeeDetails: Array<{
                        FeeType: string
                        FeeAmount: {
                            Amount: number
                            CurrencyCode: string
                        }
                        TaxAmount: {
                            Amount: number
                            CurrencyCode: string
                        }
                        FeePromotion: {
                            Amount: number
                            CurrencyCode: string
                        }
                        FinalFee: {
                            Amount: number
                            CurrencyCode: string
                        }
                        IncludedFees: Array<{
                            FeeType: string
                            FeeAmount: {
                                Amount: number
                                CurrencyCode: string
                            }
                            TaxAmount: {
                                Amount: number
                                CurrencyCode: string
                            }
                            FeePromotion: {
                                Amount: number
                                CurrencyCode: string
                            }
                            FinalFee: {
                                Amount: number
                                CurrencyCode: string
                            }
                        }>
                    }>
                }
            }>
        }
    }
}

export interface FulfillmentOrderStatusNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        FulfillmentOrderStatusNotification: {
            SellerId: string
            EventType: string
            StatusUpdatedDateTime: string
            SellerFulfillmentOrderId: string
            FulfillmentOrderStatus: string
            FulfillmentShipment: {
                FulfillmentShipmentStatus: string
                AmazonShipmentId: string
                EstimatedArrivalDateTime: string
                info: {
                    PackageNumber: number
                    CarrierCode: string
                    TrackingNumber: string
                }
                FulfillmentShipmentPackages: Array<{
                    PackageNumber: number
                    CarrierCode: string
                    TrackingNumber: string
                }>
            }
            FulfillmentReturnItem: {
                ReceivedDateTime: string
                ReturnedQuantity: number
                SellerSKU: string
            }
        }
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface ItemInventoryEventChanges {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    payload: {
        itemInventoryEventChanges: Array<{
            accountId: string
            marketplaceId: string
            startTime: string
            endTime: string
            asin: string
            highlyAvailableInventory: number
        }>
    }
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
}

export interface ItemProductTypeChangeNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        MarketplaceId: string
        Asin: string
        PreviousProductType: string
        CurrentProductType: string
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface ItemSalesEventChanges {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    payload: {
        itemSalesEventChanges: Array<{
            accountId: string
            marketplaceId: string
            currencyCode: string
            startTime: string
            endTime: string
            asin: string
            orderedUnits: number
            orderedRevenue: number
        }>
    }
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
}

export interface ListingItemIssuesChangeNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        SellerId: string
        MarketplaceId: string
        Asin: string
        Sku: string
        Severities: Array<string>
        EnforcementActions: Array<string>
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface ListingsItemMfnQuantityChange {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        SellerId: string
        FulfillmentChannelCode: string
        Sku: string
        Quantity: number
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface ListingItemStatusChangeNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        SellerId: string
        MarketplaceId: string
        Asin: string
        Sku: string
        CreatedDate: string
        Status: Array<string>
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface MFNOrderStatusChangeNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        MFNOrderStatusChangeNotification: {
            SellerId: string
            MarketplaceId: string
            AmazonOrderId: string
            PurchaseDate: number
            OrderStatus: string
            DestinationPostalCode: string
            SupplySourceId: string
            OrderItemId: string
            SellerSKU: string
            Quantity: number
        }
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface OrderStatusChangeNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        OrderStatusChangeNotification: {
            SellerId: string
            MarketplaceId: string
            AmazonOrderId: string
            PurchaseDate: number
            OrderStatus: string
            DestinationPostalCode: string
            SupplySourceId: string
            OrderItemId: string
            SellerSKU: string
            Quantity: number
            FulfillmentChannel: string
        }
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface PricingHealthNotification {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    payload: {
        issueType: string
        sellerId: string
        offerChangeTrigger: {
            marketplaceId: string
            asin: string
            itemCondition: string
            timeOfOfferChange: string
        }
        merchantOffer: {
            condition: string
            fulfillmentType: string
            listingPrice: {
                amount: number
                currencyCode: string
            }
            shipping: {
                amount: number
                currencyCode: string
            }
            landedPrice: {
                amount: number
                currencyCode: string
            }
            points: {
                pointsNumber: number
            }
        }
        summary: {
            numberOfOffers: Array<{
                condition: string
                fulfillmentType: string
                offerCount: number
            }>
            buyBoxEligibleOffers: Array<{
                condition: string
                fulfillmentType: string
                offerCount: number
            }>
            buyBoxPrices: Array<{
                condition: string
                listingPrice: {
                    amount: number
                    currencyCode: string
                }
                shipping: {
                    amount: number
                    currencyCode: string
                }
                landedPrice: {
                    amount: number
                    currencyCode: string
                }
                points: {
                    pointsNumber: number
                }
            }>
            salesRankings: Array<{
                productCategoryId: string
                rank: number
            }>
            referencePrice: {
                averageSellingPrice: {
                    amount: number
                    currencyCode: string
                }
                competitivePriceThreshold: {
                    amount: number
                    currencyCode: string
                }
                msrpPrice: {
                    amount: number
                    currencyCode: string
                }
                retailOfferPrice: {
                    amount: number
                    currencyCode: string
                }
            }
        }
    },
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
}

export interface ProductTypeDefinitionsChangeNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    Payload: {
        AccountId: string
        MarketplaceId: string
        ProductTypeVersion: string
        NewProductTypes: Array<string>
    }
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
}

export interface ReportProcessingFinishedNotification {
    notificationVersion: string
    notificationType: string
    payloadVersion: string
    eventTime: string
    payload: {
        reportProcessingFinishedNotification: {
            sellerId: string
            accountId: string
            reportId: string
            reportType: string
            processingStatus: string
            reportDocumentId: string
        }
    }
    notificationMetadata: {
        applicationId: string
        subscriptionId: string
        publishTime: string
        notificationId: string
    }
}

export interface TransactionUpdateNotification {
    NotificationVersion: string
    NotificationType: string
    PayloadVersion: string
    EventTime: string
    NotificationMetadata: {
        ApplicationId: string
        SubscriptionId: string
        PublishTime: string
        NotificationId: string
    }
    Payload: {
        TransactionUpdateNotification: {
            SellingPartnerMetadata: {
                SellingPartnerId: string
                MarketplaceId: string
                AccountType: string
            }
            RelatedIdentifiers: Array<{
                RelatedIdentifierName: string
                RelatedIdentifierValue: string
            }>
            TransactionType: string
            PostedDate: string
            TotalAmount: {
                CurrencyAmount: number
                CurrencyCode: string
            }
        }
    }
}
