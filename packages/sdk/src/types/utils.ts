export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
export type ExpandDeep<T> = T extends object ? { [K in keyof T]: ExpandDeep<T[K]> } : T
