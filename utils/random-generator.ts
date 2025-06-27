export function randomString(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    // Generate 4 random letters
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += letters[Math.floor(Math.random() * letters.length)];
    }

    // Generate 3 random numbers
    for (let i = 0; i < 3; i++) {
        result += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return result;
}

