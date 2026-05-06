import { type Request } from 'express'

export function getRouteParam(request: Request, name: string, fallbackName?: string): string {
    const value = request.params[name] ?? (fallbackName ? request.params[fallbackName] : undefined) ?? ''

    if (Array.isArray(value)) {
        return value[0] ?? ''
    }

    return value
}
