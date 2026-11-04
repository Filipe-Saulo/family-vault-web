import type { ICategory } from '../types/category'
import type { ITransactionType } from '../types/transaction-type'

// A API devolve `code` (1 = despesa, 2 = receita) em category.purpose e em
// transactionType; a compatibilidade é decidida por ele, não pelo nome.
export function isCategoryCompatibleWithTransactionType(
    category: { purpose: Pick<ICategory['purpose'], 'code'> },
    transactionType: Pick<ITransactionType, 'code'>,
): boolean {
    return category.purpose.code === transactionType.code
}
