export class ProductModel {
    id: number;
    name: string
    price: number;
    quantity: number;
    constructor(id?, name?, price?, quantity?) {
        this.id = id || 0;
        this.name = name || '';
        this.price = price || 0;
        this.quantity = quantity || 0;
    }
}