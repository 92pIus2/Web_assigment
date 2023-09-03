import bcrypt from 'bcryptjs';

const rounds = 10;

export async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(rounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

export function compareStringToHash(stringToCompare, storedHash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(stringToCompare, storedHash, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
