import {create} from "./create.js";

const database = create();

// Add a product to Database
export async function add_product(artist, album, price, genre, image) {
    console.log('Adding product:', artist, album, price, genre);

    try {
        const productsRef = database.ref('products');
        const productsSnapshot = await productsRef.once('value');
        const existingProducts = productsSnapshot.val() || {};

        let maxProductId = 0; //finding new ID
        for (const productId in existingProducts) {
            const numericId = parseInt(productId);
            if (!isNaN(numericId) && numericId > maxProductId) {
                maxProductId = numericId;
            }
        }
        const newProductId = maxProductId + 1;

        // Add the new product
        productsRef.child(newProductId).set({
            id : newProductId,
            artist: artist,
            album: album,
            price: price,
            genre: genre,
            image: image
        }, (error) => {
            if (error) {
                console.error('Error adding product:', error);
            } else {
                console.log('Product added successfully');
            }
        });
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

// Delete product from Database
export function delete_product(id) {
    console.log('Deleting product with ID:', id);

    const productRef = database.ref('products').child(id);

    productRef.remove((error) => {
        if (error) {
            console.error('Error deleting product:', error);
        } else {
            console.log('Product deleted successfully');
        }
    })
}

// Get a product by ID
export function get_product_by_id(id) {
    console.log('Getting product:', id);

    return new Promise((resolve, reject) => {
        const productRef = database.ref('products').child(id);

        productRef.once('value', snapshot => {
            const product = snapshot.val();
            resolve(product);
        }, error => {
            console.error('Error getting product:', error);
            reject(error);
        });
    });
}

// Get all products
export function get_all_products() {
    console.log('Getting all products');

    return new Promise((resolve, reject) => {
        const productsRef = database.ref('products');

        productsRef.once('value', snapshot => {
            const products = snapshot.val();
            resolve(Object.values(products));
        }, error => {
            console.error('Error getting all products:', error);
            reject(error);
        });
    });
}
