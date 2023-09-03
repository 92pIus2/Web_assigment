import {create} from "./create.js";
import {compareStringToHash, hashPassword} from "./hash.js";

const database = create();

// Add a user to Database
export async function add_user(email, username, password) {
    console.log('Adding user: ', email, username)

    const usersRef = database.ref('users');

    usersRef.push({
        email: email,
        username: username,
        password: await hashPassword(password)
    }, (error) => {
        if (error) {
            console.error('Error adding user:', error);
        } else {
            console.log('User added successfully');
        }
    });
}

// Update user by username
export function update_user_by_username(username, new_username, new_password) {
    console.log('Updating user: ', username)
    
    const usersRef = database.ref('users');

    usersRef.orderByChild('username').equalTo(username).once('value', async snapshot => {
        for (const userSnapshot of snapshot) {
            userSnapshot.ref.update({
                username: new_username,
                password: await hashPassword(new_password)
            }, (error) => {
                if (error) {
                    console.error('Error updating user:', error);
                } else {
                    console.log('User updated successfully');
                }
            });
        }
    });
}

// Get user by username
export function get_user_by_username(username) {
    console.log('Getting user: ', username)
    
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

// Check password of user
export function checkPassword(username, password) {
    console.log('Checking password of user: ', username)
    
    return new Promise((resolve, reject) => {
        const usersRef = database.ref('users');

        usersRef.orderByChild('username').equalTo(username).once('value', snapshot => {
            const user = snapshot.val();
            if (user) {
                const userData = Object.values(user)[0];
                resolve(compareStringToHash(password, userData.password))
            } else {
                resolve(false);
            }
        }, error => {
            console.error('Error checking password:', error);
            reject(error);
        });
    });
}
