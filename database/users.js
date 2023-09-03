import {create} from "./create.js";

const database = create();

// Add a user to Database
export function add_user(email, username, password) {
    console.log('Adding user: ', email, username)

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

// Update user by username
export function update_user_by_username(username, new_username, new_password) {
    console.log('Updating user: ', username)
    
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
