export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** An RFC-3339 compliant Full Date Scalar. Example: "2023-11-15" */
  Date: any
  /** A Scalar for the primitive long type. */
  Long: any
}

/** Monetary amount with the corresponding currency code. */
export type Amount = {
  __typename?: "Amount"
  /** The amount. */
  amount: Scalars["Float"]
  /** Currency code of the amount in ISO 4217 format. */
  currencyCode: Scalars["String"]
}

/** A root type for Analytics Sales and Traffic queries version 2024_04_24. */
export type Analytics_SalesAndTraffic_2024_04_24 = {
  __typename?: "Analytics_SalesAndTraffic_2024_04_24"
  /** A query to retrieve sales and traffic data for the seller's account aggregated by ASIN. */
  salesAndTrafficByAsin?: Maybe<Array<Maybe<SalesAndTrafficByAsin>>>
  /** A query to retrieve sales and traffic data for the seller's account aggregated by date. */
  salesAndTrafficByDate?: Maybe<Array<Maybe<SalesAndTrafficByDate>>>
}

/** A root type for Analytics Sales and Traffic queries version 2024_04_24. */
export type Analytics_SalesAndTraffic_2024_04_24SalesAndTrafficByAsinArgs = {
  aggregateBy: AsinGranularity
  endDate: Scalars["Date"]
  marketplaceIds: Array<Scalars["String"]>
  startDate: Scalars["Date"]
}

/** A root type for Analytics Sales and Traffic queries version 2024_04_24. */
export type Analytics_SalesAndTraffic_2024_04_24SalesAndTrafficByDateArgs = {
  aggregateBy: DateGranularity
  endDate: Scalars["Date"]
  marketplaceIds: Array<Scalars["String"]>
  startDate: Scalars["Date"]
}

/** The sales data for the seller's account aggregated by ASIN. */
export type ByAsinSales = {
  __typename?: "ByAsinSales"
  /**
   * The amount of ordered product sales, calculated by multiplying the price of
   * products and the number of units sold for the selected time period.
   */
  orderedProductSales: Amount
  /**
   * The amount of ordered product sales to Amazon Business customers, calculated
   * by multiplying the price of products and the number of units sold for the
   * selected time period. Note: This field is only populated when the seller is a B2B seller.
   */
  orderedProductSalesB2B?: Maybe<Amount>
  /** The number of items that were ordered for the selected time period. */
  totalOrderItems: Scalars["Long"]
  /**
   * The number of items that were ordered by Amazon Business customers for the
   * selected time period. Note: This field is only populated when the seller is a B2B seller.
   */
  totalOrderItemsB2B?: Maybe<Scalars["Long"]>
  /** The number of units ordered. */
  unitsOrdered: Scalars["Long"]
  /**
   * The number of units ordered by Amazon Business customers. Note: This field is
   * only populated when the seller is a B2B seller.
   */
  unitsOrderedB2B?: Maybe<Scalars["Long"]>
}

/** The traffic data for the seller's account aggregated by ASIN. */
export type ByAsinTraffic = {
  __typename?: "ByAsinTraffic"
  /** Browser page views are the number of times a user visited your Amazon.com browser pages for the selected time period. */
  browserPageViews: Scalars["Long"]
  /**
   * Browser B2B page views are the number of times an Amazon Business customer
   * visited your Amazon.com browser pages for the selected time period. Note: This
   * field is only populated when the seller is a B2B seller.
   */
  browserPageViewsB2B?: Maybe<Scalars["Long"]>
  /**
   * The percentage of browser page views that a particular SKU/ASIN receives
   * relative to the total number of browser page views for all products.
   */
  browserPageViewsPercentage: Scalars["Float"]
  /**
   * The percentage of browser views by Amazon Business customers that a particular
   * SKU/ASIN receives relative to the total number of mobile page views by Amazon
   * Business customers for all products. Note: This field is only populated when
   * the seller is a B2B seller.
   */
  browserPageViewsPercentageB2B?: Maybe<Scalars["Float"]>
  /**
   * The percentage of browser sessions that contain at least one page view for a
   * particular SKU/ASIN relative to the total number of browser sessions for all products.
   */
  browserSessionPercentage: Scalars["Float"]
  /**
   * The percentage of browser sessions that contain at least one page view by an
   * Amazon Business customer for a particular SKU/ASIN relative to the total
   * number of browser sessions by Amazon Business customers for all products.
   * Note: This field is only populated when the seller is a B2B seller.
   */
  browserSessionPercentageB2B?: Maybe<Scalars["Float"]>
  /**
   * Browser sessions are visits to your Amazon.com browser pages by a user. All
   * browser activity within a 24-hour period is considered a browser session. For
   * example, if a user visits your pages using a browser multiple times within a
   * 24 hour period it is counted as a single browser session.
   */
  browserSessions: Scalars["Long"]
  /**
   * Browser B2B sessions are visits to your Amazon.com browser pages by an Amazon
   * Business customer. All activity within a 24-hour period is considered a
   * browser session. For example, if an Amazon Business customer visits your pages
   * using browser multiple times within a 24 hour period it is counted as a single
   * session. Note: This field is only populated when the seller is a B2B seller.
   */
  browserSessionsB2B?: Maybe<Scalars["Long"]>
  /**
   * The percentage of page views where the buy box (the add to shopping cart link)
   * appeared on the page for customers to add your product to their cart.
   */
  buyBoxPercentage: Scalars["Float"]
  /**
   * The percentage of page views by Amazon Business customers where the buy box
   * (the add to shopping cart link) appeared on the page for customers to add your
   * product to their cart. Note: This field is only populated when the seller is a B2B seller.
   */
  buyBoxPercentageB2B?: Maybe<Scalars["Float"]>
  /**
   * Mobile app page views are the number of times a user visited your Amazon.com
   * mobile app pages for the selected time period.
   */
  mobileAppPageViews: Scalars["Long"]
  /**
   * Mobile app B2B page views are the number of times an Amazon Business customer
   * visited your Amazon.com mobile app pages for the selected time period. Note:
   * This field is only populated when the seller is a B2B seller.
   */
  mobileAppPageViewsB2B?: Maybe<Scalars["Long"]>
  /**
   * The percentage of mobile app page views that a particular SKU/ASIN receives
   * relative to the total number of mobile app page views for all products.
   */
  mobileAppPageViewsPercentage: Scalars["Float"]
  /**
   * The percentage of mobile page views by Amazon Business customers that a
   * particular SKU/ASIN receives relative to the total number of mobile page views
   * by Amazon Business customers for all products. Note: This field is only
   * populated when the seller is a B2B seller.
   */
  mobileAppPageViewsPercentageB2B?: Maybe<Scalars["Float"]>
  /**
   * The percentage of mobile app sessions that contain at least one page view for
   * a particular SKU/ASIN relative to the total number of mobile app sessions for all products.
   */
  mobileAppSessionPercentage: Scalars["Float"]
  /**
   * The percentage of mobile app sessions that contain at least one page view by
   * an Amazon Business customer for a particular SKU/ASIN relative to the total
   * number of mobile app sessions by Amazon Business customers for all products.
   * Note: This field is only populated when the seller is a B2B seller.
   */
  mobileAppSessionPercentageB2B?: Maybe<Scalars["Float"]>
  /**
   * Mobile app sessions are visits to your Amazon.com mobile app pages by a user.
   * All mobile app activity within a 24-hour period is considered a mobile app
   * session. For example, if a user visits your pages using a mobile app multiple
   * times within a 24 hour period it is counted as a single mobile app session.
   */
  mobileAppSessions: Scalars["Long"]
  /**
   * Mobile app B2B sessions are visits to your Amazon.com mobile app pages by an
   * Amazon Business customer. All activity within a 24-hour period is considered a
   * mobile app session. For example, if an Amazon Business customer visits your
   * pages using mobile app multiple times within a 24 hour period it is counted as
   * a single session. Note: This field is only populated when the seller is a B2B seller.
   */
  mobileAppSessionsB2B?: Maybe<Scalars["Long"]>
  /**
   * Page views are the number of times a user visited your Amazon.com browser or
   * mobile app pages for the selected time period. It is calculated as the sum of
   * browserPageViews and mobileAppPageViews.
   */
  pageViews: Scalars["Long"]
  /**
   * B2B page views are the number of times an Amazon Business customer visited
   * your Amazon.com pages using browser or mobile app for the selected time
   * period. Note: This field is only populated when the seller is a B2B seller.
   */
  pageViewsB2B?: Maybe<Scalars["Long"]>
  /**
   * The percentage of browser and mobile app page views that a particular SKU/ASIN
   * receives relative to the total number of browser and mobile app page views for all products.
   */
  pageViewsPercentage: Scalars["Float"]
  /**
   * The percentage of page views by Amazon Business customers that a particular
   * SKU/ASIN receives relative to the total number of page views by Amazon
   * Business customers for all products. Note: This field is only populated when
   * the seller is a B2B seller.
   */
  pageViewsPercentageB2B?: Maybe<Scalars["Float"]>
  /**
   * The percentage of sessions that contain at least one page view for a
   * particular SKU/ASIN relative to the total number of sessions for all products.
   */
  sessionPercentage: Scalars["Float"]
  /**
   * The percentage of sessions that contain at least one page view by an Amazon
   * Business customer for a particular SKU/ASIN relative to the total number of
   * sessions by Amazon Business customers for all products. Note: This field is
   * only populated when the seller is a B2B seller.
   */
  sessionPercentageB2B?: Maybe<Scalars["Float"]>
  /**
   * Sessions are visits to your Amazon.com browser or mobile app pages by a user.
   * All browser and mobile app activity within a 24-hour period is considered a
   * session. It is calculated as the sum of browserSessions and mobileAppSessions.
   */
  sessions: Scalars["Long"]
  /**
   * B2B sessions are visits to your Amazon.com pages using browser or mobile app
   * by an Amazon Business customer. All activity within a 24-hour period is
   * considered a session. For example, if an Amazon Business customer visits your
   * pages multiple times using mobile app or browser within a 24 hour period it is
   * counted as a single session. Note: This field is only populated when the
   * seller is a B2B seller.
   */
  sessionsB2B?: Maybe<Scalars["Long"]>
  /**
   * The percentage conversion metric indicating how many units were purchased
   * relative to the number of people who viewed the products, calculated by
   * dividing unitsOrdered by sessions.
   */
  unitSessionPercentage: Scalars["Float"]
  /**
   * The percentage conversion metric indicating how many units were purchased by
   * Amazon Business customers relative to the number of Amazon Business customers
   * who viewed the products, calculated by dividing unitsOrderedB2B by sessions.
   * Note: This field is only populated when the seller is a B2B seller.
   */
  unitSessionPercentageB2B?: Maybe<Scalars["Float"]>
}

/** The sales data for the seller's account aggregated by date. */
export type ByDateSales = {
  __typename?: "ByDateSales"
  /**
   * The average ordered product sales, calculated by dividing orderedProductSales
   * by totalOrderItems for the selected time period.
   */
  averageSalesPerOrderItem: Amount
  /**
   * The average ordered product sales to Amazon Business customers, calculated by
   * dividing orderedProductSalesB2B by totalOrderItemsB2B for the selected time
   * period. Note: This field is only populated when the seller is a B2B seller.
   */
  averageSalesPerOrderItemB2B?: Maybe<Amount>
  /**
   * The average price of the units sold in the selected time period, calculated by
   * dividing the orderedProductSales by unitsOrdered for the selected time period.
   */
  averageSellingPrice: Amount
  /**
   * The average price of the units sold to Amazon Business customers, calculated
   * by dividing the orderedProductSalesB2B by unitsOrderedB2B for the selected
   * time period. Note: This field is only populated when the seller is a B2B seller.
   */
  averageSellingPriceB2B?: Maybe<Amount>
  /** The average number of units in each order item for the selected time period. */
  averageUnitsPerOrderItem: Scalars["Float"]
  /**
   * The average number of units in each order item ordered by Amazon Business
   * customers for the selected time period. Note: This field is only populated
   * when the seller is a B2B seller.
   */
  averageUnitsPerOrderItemB2B?: Maybe<Scalars["Float"]>
  /** Monetary amount of filed A-to-z guarantee claims. */
  claimsAmount: Amount
  /** The number of A-to-z guarantee claims granted. */
  claimsGranted: Scalars["Long"]
  /**
   * The amount of ordered product sales, calculated by multiplying the price of
   * products and the number of units sold for the selected time period.
   */
  orderedProductSales: Amount
  /**
   * The amount of ordered product sales to Amazon Business customers, calculated
   * by multiplying the price of products and the number of units sold for the
   * selected time period.
   */
  orderedProductSalesB2B?: Maybe<Amount>
  /** The number of orders shipped in the selected time period. */
  ordersShipped: Scalars["Long"]
  /**
   * The percentage conversion metric indicating how many orders were refunded by
   * the seller, calculated by dividing unitsOrdered by unitsRefunded in the
   * selected time period.
   */
  refundRate: Scalars["Float"]
  /** The amount of ordered product sales shipped for the selected time period. */
  shippedProductSales: Amount
  /**
   * The number of items that were ordered for the selected time period. Example:
   * For an order containing 2 copies of book A and 3 copies of book B, the number
   * of orders is 1, the number of order items is 2 (book A and book B), and the
   * number of units is 5 (2 + 3).
   */
  totalOrderItems: Scalars["Long"]
  /**
   * The number of items that were ordered by Amazon Business customers for the
   * selected time period. Example: For an order containing 2 copies of book A and
   * 3 copies of book B, the number of orders is 1, the number of order items is 2
   * (book A and book B), and the number of units is 5 (2 + 3).
   */
  totalOrderItemsB2B?: Maybe<Scalars["Long"]>
  /**
   * The number of units ordered for the selected time period. Example: For an
   * order containing 2 copies of book A and 3 copies of book B, the number of
   * orders is 1, the number of order items is 2 (book A and book B), and the
   * number of units is 5 (2 + 3).
   */
  unitsOrdered: Scalars["Long"]
  /**
   * The number of units ordered by Amazon Business customers for the selected time
   * period. Example: For an order containing 2 copies of book A and 3 copies of
   * book B, the number of orders is 1, the number of order items is 2 (book A and
   * book B), and the number of units is 5 (2 + 3).
   */
  unitsOrderedB2B?: Maybe<Scalars["Long"]>
  /** The number of units refunded in the selected time period. */
  unitsRefunded: Scalars["Long"]
  /** The number of units shipped in the selected time period. */
  unitsShipped: Scalars["Long"]
}

/** The traffic data for the seller's account aggregated by date. */
export type ByDateTraffic = {
  __typename?: "ByDateTraffic"
  /**
   * The average number of offers listed for sale in the selected time period. It
   * is calculated from the total number of offers and the total number of days in
   * the selected time period.
   */
  averageOfferCount: Scalars["Long"]
  /** The average number of parent items listed for sale in the selected time period. */
  averageParentItems: Scalars["Long"]
  /** Browser page views are the number of times a user visited your Amazon.com browser pages for the selected time period. */
  browserPageViews: Scalars["Long"]
  /**
   * Browser B2B page views are the number of times an Amazon Business customer
   * visited your Amazon.com browser pages for the selected time period. Note: This
   * field is only populated when the seller is a B2B seller.
   */
  browserPageViewsB2B?: Maybe<Scalars["Long"]>
  /**
   * Browser sessions are visits to your Amazon.com browser pages by a user. All
   * browser activity within a 24-hour period is considered a browser session. For
   * example, if a user visits your pages using a browser multiple times within a
   * 24 hour period it is counted as a single browser session.
   */
  browserSessions: Scalars["Long"]
  /**
   * Browser B2B sessions are visits to your Amazon.com browser pages by an Amazon
   * Business customer. All activity within a 24-hour period is considered a
   * browser session. For example, if an Amazon Business customer visits your pages
   * using browser multiple times within a 24 hour period it is counted as a single
   * session. Note: This field is only populated when the seller is a B2B seller.
   */
  browserSessionsB2B?: Maybe<Scalars["Long"]>
  /**
   * The percentage of page views where the buy box (the add to shopping cart link)
   * appeared on the page for customers to add your product to their cart.
   */
  buyBoxPercentage: Scalars["Float"]
  /**
   * The percentage of page views by Amazon Business customers where the buy box
   * (the add to shopping cart link) appeared on the page for customers to add your
   * product to their cart. Note: This field is only populated when the seller is a B2B seller.
   */
  buyBoxPercentageB2B?: Maybe<Scalars["Float"]>
  /** The number of times customers left feedback in the selected time period. */
  feedbackReceived: Scalars["Long"]
  /**
   * Mobile app page views are the number of times a user visited your Amazon.com
   * mobile app pages for the selected time period.
   */
  mobileAppPageViews: Scalars["Long"]
  /**
   * Mobile app B2B page views are the number of times an Amazon Business customer
   * visited your Amazon.com mobile app pages for the selected time period. Note:
   * This field is only populated when the seller is a B2B seller.
   */
  mobileAppPageViewsB2B?: Maybe<Scalars["Long"]>
  /**
   * Mobile app sessions are visits to your Amazon.com mobile app pages by a user.
   * All mobile app activity within a 24-hour period is considered a mobile app
   * session. For example, if a user visits your pages using a mobile app multiple
   * times within a 24 hour period it is counted as a single mobile app session.
   */
  mobileAppSessions: Scalars["Long"]
  /**
   * Mobile app B2B sessions are visits to your Amazon.com mobile app pages by an
   * Amazon Business customer. All activity within a 24-hour period is considered a
   * mobile app session. For example, if an Amazon Business customer visits your
   * pages using mobile app multiple times within a 24 hour period it is counted as
   * a single session. Note: This field is only populated when the seller is a B2B seller.
   */
  mobileAppSessionsB2B?: Maybe<Scalars["Long"]>
  /** The number of times customers left negative feedback in the selected time period. */
  negativeFeedbackReceived: Scalars["Long"]
  /**
   * The percentage conversion metric indicating how many order items were
   * generated relative to the number of people who viewed the products.
   */
  orderItemSessionPercentage: Scalars["Float"]
  /**
   * The percentage conversion metric indicating how many order items were
   * generated by Amazon Business customers relative to the number of Amazon
   * Business customers who viewed the products. Note: This field is only populated
   * when the seller is a B2B seller.
   */
  orderItemSessionPercentageB2B?: Maybe<Scalars["Float"]>
  /**
   * Page views are the number of times a user visited your Amazon.com browser or
   * mobile app pages for the selected time period. It is calculated as the sum of
   * browserPageViews and mobileAppPageViews.
   */
  pageViews: Scalars["Long"]
  /**
   * B2B page views are the number of times an Amazon Business customer visited
   * your Amazon.com pages using browser or mobile app for the selected time
   * period. Note: This field is only populated when the seller is a B2B seller.
   */
  pageViewsB2B?: Maybe<Scalars["Long"]>
  /**
   * The negative feedback rate is the number of orders that have received negative
   * feedback divided by the number of orders in the selected time period.
   */
  receivedNegativeFeedbackRate: Scalars["Float"]
  /**
   * Sessions are visits to your Amazon.com browser or mobile app pages by a user.
   * All browser and mobile app activity within a 24-hour period is considered a
   * session. It is calculated as the sum of browserSessions and mobileAppSessions.
   */
  sessions: Scalars["Long"]
  /**
   * B2B sessions are visits to your Amazon.com pages using browser or mobile app
   * by an Amazon Business customer. All activity within a 24-hour period is
   * considered a session. For example, if an Amazon Business customer visits your
   * pages multiple times using mobile app or browser within a 24 hour period it is
   * counted as a single session. Note: This field is only populated when the
   * seller is a B2B seller.
   */
  sessionsB2B?: Maybe<Scalars["Long"]>
  /**
   * The percentage conversion metric indicating how many units were purchased
   * relative to the number of people who viewed the products.
   */
  unitSessionPercentage: Scalars["Float"]
  /**
   * The percentage conversion metric indicating how many units were purchased by
   * Amazon Business customers relative to number of Amazon Business customers who
   * viewed the products. Note: This field is only populated when the seller is a B2B seller.
   */
  unitSessionPercentageB2B?: Maybe<Scalars["Float"]>
}

/** A root type for queries */
export type Query = {
  __typename?: "Query"
  /** Analytics Sales and Traffic queries version 2024_04_24. */
  analytics_salesAndTraffic_2024_04_24?: Maybe<
    Analytics_SalesAndTraffic_2024_04_24
  >
}

/** The sales and traffic data for the seller's account aggregated by ASIN. */
export type SalesAndTrafficByAsin = {
  __typename?: "SalesAndTrafficByAsin"
  /**
   * The Amazon Standard Identification Number of the child product. Child products
   * are unique, sellable products that are related in our catalog to a single,
   * non-sellable parent product. Note: This field is only present when ASIN
   * aggregation is CHILD or SKU.
   */
  childAsin?: Maybe<Scalars["String"]>
  /** The end date of the period of the aggregated data. */
  endDate: Scalars["Date"]
  /** The marketplace identifier of the sales and traffic data. */
  marketplaceId: Scalars["String"]
  /**
   * The Amazon Standard Identification Number of the parent product. A parent
   * product appears in our catalog as a non-buyable, generic identifier for a
   * product that has buyable variations (child products).
   */
  parentAsin: Scalars["String"]
  /** The sales data for the parentAsin/childAsin/sku within the specified date range. */
  sales: ByAsinSales
  /**
   * The Stock Keeping Unit of the product. The SKU is a seller specific product
   * identifier. Note: This field is only present when ASIN aggregation is SKU.
   */
  sku?: Maybe<Scalars["String"]>
  /** The start date of the period of the aggregated data. */
  startDate: Scalars["Date"]
  /** The traffic data for the parentAsin/childAsin/sku within the specified date range. */
  traffic: ByAsinTraffic
}

/** The sales and traffic data for the seller's account aggregated by date. */
export type SalesAndTrafficByDate = {
  __typename?: "SalesAndTrafficByDate"
  /** The end date of the sales and traffic data. */
  endDate: Scalars["Date"]
  /** The marketplace identifier of the sales and traffic data. */
  marketplaceId: Scalars["String"]
  /** The sales data for the seller's account. */
  sales: ByDateSales
  /** The start date of the sales and traffic data. */
  startDate: Scalars["Date"]
  /** The traffic data for the seller's account. */
  traffic: ByDateTraffic
}

/** The ASIN granularity used in aggregation. */
export enum AsinGranularity {
  /** Sales and traffic data is aggregated by child ASIN. */
  Child = "CHILD",
  /** Sales and traffic data is aggregated by parent ASIN. */
  Parent = "PARENT",
  /** Sales and traffic data is aggregated by sku. */
  Sku = "SKU"
}

/** The date granularity used in aggregation. */
export enum DateGranularity {
  /** Sales and traffic data is aggregated by day. */
  Day = "DAY",
  /** Sales and traffic data is aggregated by month. */
  Month = "MONTH",
  /** Sales and traffic data is aggregated by week. */
  Week = "WEEK"
}
