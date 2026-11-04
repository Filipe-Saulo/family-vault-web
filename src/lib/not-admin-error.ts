// Login válido, mas sem o papel de Administrador
export class NotAdminError extends Error {
    constructor(message = 'Sem permissão') {
        super(message)
        this.name = 'NotAdminError'
    }
}
