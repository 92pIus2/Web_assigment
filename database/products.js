
import firebase from "firebase/compat/app";
import {} from "firebase/compat/database";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAORF8cH1QIAuYICrYMtgAwb5UCz4OKgxQ",
    authDomain: "webvinyl-4912c.firebaseapp.com",
    databaseURL: "https://webvinyl-4912c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "webvinyl-4912c",
    storageBucket: "webvinyl-4912c.appspot.com",
    messagingSenderId: "1017529934891",
    appId: "1:1017529934891:web:7d3448757b9bc14376b66e",
    measurementId: "G-KDPE4VBBJM"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Add a product to Firebase
export async function add_product(artist, album, price, genre, image) {
    try {
        const productsRef = database.ref('products');

        // Retrieve existing product data
        const productsSnapshot = await productsRef.once('value');
        const existingProducts = productsSnapshot.val() || {};

        // Find the maximum existing product ID
        let maxProductId = 0;
        for (const productId in existingProducts) {
            const numericId = parseInt(productId);
            if (!isNaN(numericId) && numericId > maxProductId) {
                maxProductId = numericId;
            }
        }

        // Calculate the new product ID
        const newProductId = maxProductId + 1;
        console.log(newProductId)

        // Add the new product with the calculated ID
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



// Update a product in Firebase
export function update_product(id, new_artist, new_album, new_price, new_genre) {
    const productRef = database.ref('products').child(id);

    productRef.update({
        artist: new_artist,
        album: new_album,
        price: new_price,
        genre: new_genre
    }, (error) => {
        if (error) {
            console.error('Error updating product:', error);
        } else {
            console.log('Product updated successfully');
        }
    });
}

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


// Get a product by its ID from Firebase
export function get_product_by_id(id) {
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

// Get products by artist from Firebase
export function get_products_by_artist(artist) {
    return new Promise((resolve, reject) => {
        const productsRef = database.ref('products');

        productsRef.orderByChild('artist').equalTo(artist).once('value', snapshot => {
            const products = snapshot.val();
            resolve(Object.values(products));
        }, error => {
            console.error('Error getting products by artist:', error);
            reject(error);
        });
    });
}

// Get products by genre from Firebase
export function get_products_by_genre(genre) {
    return new Promise((resolve, reject) => {
        const productsRef = database.ref('products');

        productsRef.orderByChild('genre').equalTo(genre).once('value', snapshot => {
            const products = snapshot.val();
            resolve(Object.values(products));
        }, error => {
            console.error('Error getting products by genre:', error);
            reject(error);
        });
    });
}

// Get all products from Firebase
export function get_all_products() {
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

//add_product('Morgenshtern', 'Last One', 30, 'Hip-Hop', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Solid_black.svg/548px-Solid_black.svg.png')