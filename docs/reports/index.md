# Reports API

_Notes, patterns, and gotchas for Amazon SP-API Reports_

---

Amazon often deprecates report types. Usually those are legacy reports already replaced by newer ones, but that may not always be the case. Therefore, it is highly recommended to watch the official announcements closely for deprecation notices.

Amazon states they want to fully deprecate the Reports API in the future and replace it with the Data Kiosk. However, as of now, the Data Kiosk does not provide a fraction of the functionality that the Reports API provides and it still has many bugs and limitations. Therefore, it is recommended to continue using the Reports API for now.

Exact statement from [their FAQ](https://developer.amazonservices.com/datakiosk) (as of Aug 2025):
> **Does this mean that Reports API will be deprecated?**
>
> Yes.
>
> Data Kiosk has all the functionality that the Reports API currently has and more. Reports within the Reports API will be deprecated after they are onboarded to Data Kiosk. You can find up-to-date deprecation dates in the SP-API deprecations table. Eventually, Data Kiosk will be the standard reporting platform for selling partner data.

But, new report types are still being added, so it is reasonable to assume the Reports API will remain available for the foreseeable future.

## What this section covers
- Available endpoints
- Report types catalog
- Common pitfalls and real-world errors
- Example request/response snippets

---

## Quick links
- [Creating reports](./requesting-reports.md)
- [Report type registry](./registry.md)
- [Report types explained](./types.md)

---

Last updated: 4 September 2025
