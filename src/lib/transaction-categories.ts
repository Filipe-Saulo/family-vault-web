import type { ICategory } from '../types/category'

// Garante que a categoria atual da transação em edição esteja nas opções,
// mesmo quando o lookup não a traz (ex.: categoria pessoal do dono).
export function withCurrentCategory(
    categories: ICategory[],
    current?: ICategory,
): ICategory[] {
    if (!current || categories.some((c) => c.categoryId === current.categoryId))
        return categories
    return [...categories, current]
}
