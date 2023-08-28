
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

// Add a user to Firebase
export function add_user(email, username, password) {
    const usersRef = database.ref('users');

    usersRef.push({
        email: email,
        username: username,
        password: password
    }, (error) => {
        if (error) {
            console.error('Error adding user:', error);
        } else {
            console.log('User added successfully');
        }
    });
}

// Update user by username in Firebase
export function update_user_by_username(username, new_username, new_password) {
    const usersRef = database.ref('users');

    usersRef.orderByChild('username').equalTo(username).once('value', snapshot => {
        snapshot.forEach(userSnapshot => {
            userSnapshot.ref.update({
                username: new_username,
                password: new_password
            }, (error) => {
                if (error) {
                    console.error('Error updating user:', error);
                } else {
                    console.log('User updated successfully');
                }
            });
        });
    });
}

// Delete user by username or email from Firebase
export function delete_user(identifier) {
    const usersRef = database.ref('users');
    const isEmail = identifier.includes('@');

    usersRef.orderByChild(isEmail ? 'email' : 'username').equalTo(identifier).once('value', snapshot => {
        snapshot.forEach(userSnapshot => {
            userSnapshot.ref.remove((error) => {
                if (error) {
                    console.error('Error deleting user:', error);
                } else {
                    console.log('User deleted successfully');
                }
            });
        });
    });
}

// Retrieve user by username from Firebase
export function get_user_by_username(username) {
    return new Promise((resolve, reject) => {
        const usersRef = database.ref('users');

        usersRef.orderByChild('username').equalTo(username).once('value', snapshot => {
            const user = snapshot.val();
            if (user) {
                resolve(Object.values(user)[0]);
            } else {
                resolve(null);
            }
        }, error => {
            console.error('Error getting user:', error);
            reject(error);
        });
    });
}

// Retrieve user by email from Firebase
export function get_user_by_email(email) {
    return new Promise((resolve, reject) => {
        const usersRef = database.ref('users');

        usersRef.orderByChild('email').equalTo(email).once('value', snapshot => {
            const user = snapshot.val();
            if (user) {
                resolve(Object.values(user)[0]);
            } else {
                resolve(null);
            }
        }, error => {
            console.error('Error getting user:', error);
            reject(error);
        });
    });
}

// Check if the provided password matches the stored password for the given username
export function checkPassword(username, password) {
    return new Promise((resolve, reject) => {
        const usersRef = database.ref('users');

        usersRef.orderByChild('username').equalTo(username).once('value', snapshot => {
            const user = snapshot.val();
            if (user) {
                const userData = Object.values(user)[0];
                if (userData.password === password) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        }, error => {
            console.error('Error checking password:', error);
            reject(error);
        });
    });
}
