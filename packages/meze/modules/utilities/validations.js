/* @flow */

export const isNull = (obj : any) : boolean => obj === null
export const isUndefined = (obj : any) : boolean => obj === undefined
export const isNullOrUndefined = (obj : any) : boolean => isNull(obj) || isUndefined(obj)
export const isString = (obj : any) : boolean => typeof obj === 'string'
export const isError = (obj : any) : boolean => obj instanceof Error
export const isNonEmptyArray = (obj : any) : boolean => Array.isArray(obj) && obj.length > 0
