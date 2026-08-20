export interface ITransactionType {
    transactionTypeId: number
    name: string
    // Só presente quando vem do endpoint /transactiontype (lista completa);
    // ausente no objeto aninhado ITransaction.transactionType.
    code?: number
}
