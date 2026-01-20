
export const prefixMethodName = (methodName:string, prefix = "") : string => {
    return prefix.length ? `${prefix}.${methodName}` : methodName;
}
