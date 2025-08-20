# Rate Limits

There are usage plans ranging from fixed to dynamic. There are several factors to this:
- **Region**: Different regions may have different rate limits.
- **Marketplace**: Each marketplace may have its own rate limits.
- **Endpoints**: Different API endpoints have different rate limits.
- **Seller**: Each seller may have different rate limits based mainly on their size and activity.
- **Application**: Each application may have different rate limits based on the usage.

Rate limits may change over time. They may be increased or decreased. Amazon says they will always notify you long before a rate limit is decreased. Watch the official [announcements](https://developer-docs.amazon.com/sp-api/changelog) closely for any changes.

## Generic APIs

Generic APIs, such as the Product Pricing API, usually have a rate limit specified in the documentation and the OpenAPI specs as well. However, these limits may be different in practice, for example a big seller might get a higher rate limit than the one specified in the documentation. This goes for the Orders API especially.

Always check for the presence of a rate limit header in the response and make sure to take it into account when designing your application. The header is usually named `x-amzn-RateLimit-Limit`.

## Reports

Apart from the general rate limits for the API, there are also various undisclosed internal limits that differ for each report type. For example, the `GET_REFERRAL_FEE_PREVIEW_REPORT` is limited to one per every 24 hours.

There is currently no way to know the exact rate limits per report type, your best option is to monitor closely and adjust your request patterns accordingly.

Do not request more reports then you need. Keep track of your report requests and their statuses.

Distribute your report requests over time, do not request them all at once. If you request too many reports in a short period of time, you may hit an internal limit and your report requests will be rejected.

Hitting an internal limit usually results in the report being cancelled. Getting a success response from the `createReport` endpoint does not guarantee that the report will be successfully generated.

Reports seem be influenced not only by the requests you make, but also by the requests made by other applications the seller has connected. They also seem to be influenced by the seller's activity, such as the number of orders they have, the number of products they have, etc. This means that even if you are not making any report requests, you may still hit an internal limit if the seller is very active or has many other applications connected.

Another factor to take into account is the internal load on the Amazon services. If the services are under heavy load, your report requests may be delayed or cancelled even if you are not hitting any known limits.

## Data Kiosk

The Data Kiosk works similarly to Reports. The same practices apply:
- Monitor your requests and their statuses.
- Do not request more data than you need.
- Distribute your requests over time.
