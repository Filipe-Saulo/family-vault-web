import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { extractApiErrorMessage } from '../lib/api-error'
import type { IBaseResponse } from '../types/base-response'

type QueryKey = readonly unknown[]
type MaybeResponse = IBaseResponse<unknown> | null | undefined

interface CrudService<TId, TCreate, TUpdate> {
    create: (data: TCreate) => Promise<MaybeResponse>
    update: (id: TId, data: TUpdate) => Promise<MaybeResponse>
    delete: (id: TId) => Promise<MaybeResponse>
}

interface UseCrudMutationsOptions<TId, TCreate, TUpdate> {
    service: CrudService<TId, TCreate, TUpdate>
    /** textos de sucesso usados quando a API não devolve `message` */
    messages: { created: string; updated: string; deleted: string }
    /** keys invalidadas após criar, editar ou excluir */
    invalidate: readonly QueryKey[]
    /** keys invalidadas só após editar (ex.: dados embutidos em outra lista) */
    invalidateOnUpdate?: readonly QueryKey[]
    /** chamado após criar ou editar com sucesso (ex.: voltar para a lista) */
    onSaved?: () => void
    /** chamado após excluir com sucesso (ex.: voltar uma página se esvaziou) */
    onDeleted?: () => void
}

export function useCrudMutations<TId, TCreate, TUpdate>({
    service,
    messages,
    invalidate,
    invalidateOnUpdate = [],
    onSaved,
    onDeleted,
}: UseCrudMutationsOptions<TId, TCreate, TUpdate>) {
    const queryClient = useQueryClient()

    const invalidateKeys = (keys: readonly QueryKey[]) => {
        keys.forEach((queryKey) =>
            queryClient.invalidateQueries({ queryKey, exact: false }),
        )
    }

    const onError = (error: unknown) => {
        toast.error(extractApiErrorMessage(error))
    }

    const createMutation = useMutation({
        mutationFn: (data: TCreate) => service.create(data),
        onSuccess: (response) => {
            toast.success(response?.message ?? messages.created)
            invalidateKeys(invalidate)
            onSaved?.()
        },
        onError,
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: TId; data: TUpdate }) =>
            service.update(id, data),
        onSuccess: (response) => {
            toast.success(response?.message ?? messages.updated)
            invalidateKeys([...invalidate, ...invalidateOnUpdate])
            onSaved?.()
        },
        onError,
    })

    const deleteMutation = useMutation({
        mutationFn: (id: TId) => service.delete(id),
        onSuccess: (response) => {
            toast.success(response?.message ?? messages.deleted)
            invalidateKeys(invalidate)
            onDeleted?.()
        },
        onError,
    })

    return {
        createMutation,
        updateMutation,
        deleteMutation,
        isSaving: createMutation.isPending || updateMutation.isPending,
        /** id da linha em exclusão, ou undefined quando não há exclusão em curso */
        deletingId: deleteMutation.isPending
            ? deleteMutation.variables
            : undefined,
    }
}
