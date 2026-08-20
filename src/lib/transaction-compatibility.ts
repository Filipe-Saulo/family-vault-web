import type { ICategory } from '../types/category'
import type { ITransactionType } from '../types/transaction-type'

// category.purpose e transactionType não carregam um `code` confiável nos
// objetos aninhados (só o endpoint de lista completa devolve isso, e como
// número). O único campo presente nos dois lados e comparável entre os dois
// domínios é `name` ("Despesa"/"Receita"), que é o mesmo vocabulário nos dois.
export function isCategoryCompatibleWithTransactionType(
    category: Pick<ICategory, 'purpose'>,
    transactionType: Pick<ITransactionType, 'name'>,
): boolean {
    return category.purpose.name === transactionType.name
}
