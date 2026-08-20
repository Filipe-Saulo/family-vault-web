export function hasRole(roles: string[], role: string): boolean {
    return roles.includes(role)
}

export function hasPermission(
    permissions: string[],
    permission: string,
): boolean {
    return permissions.includes(permission)
}
