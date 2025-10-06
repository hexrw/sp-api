import { Marketplace } from "../enums"

export const nameToIdMap = {
    "Amazon.fr": Marketplace.FR,
    "Amazon.sa": Marketplace.SA,
    "Amazon.nl": Marketplace.NL,
    "Amazon.com.sg": Marketplace.SG,
    "Amazon.com.mx": Marketplace.MX,
    "Amazon.pl": Marketplace.PL,
    "Amazon.co.uk": Marketplace.UK,
    "Amazon.de": Marketplace.DE,
    "Amazon.es": Marketplace.ES,
    "Amazon.co.jp": Marketplace.JP,
    "Amazon.in": Marketplace.IN,
    "Amazon.ca": Marketplace.CA,
    "Amazon.se": Marketplace.SE,
    "Amazon.com.br": Marketplace.BR,
    "Amazon.ae": Marketplace.AE,
    "Amazon.com.tr": Marketplace.TR,
    "Amazon.com.au": Marketplace.AU,
    "Amazon.it": Marketplace.IT,
    "Amazon.eg": Marketplace.EG,
    "Amazon.com": Marketplace.US,
    "Amazon.com.be": Marketplace.BE,
    "Amazon.ie": Marketplace.IE,
    "Amazon.co.za": Marketplace.ZA,
} as const

export const countryCodeToIdMap = {
    CA: Marketplace.CA,
    US: Marketplace.US,
    MX: Marketplace.MX,
    BR: Marketplace.BR,
    ES: Marketplace.ES,
    UK: Marketplace.UK,
    GB: Marketplace.UK,
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
} as const

export function nameToId(name: string): Marketplace {
    return nameToIdMap[name]
}
