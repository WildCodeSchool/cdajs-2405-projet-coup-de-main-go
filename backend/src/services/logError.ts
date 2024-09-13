const messages: string[] = [
    "email is already in use",
    "incorrect identifiers",
    "invalid JWT secret",
    "user not found",
];

export default function logError(error: unknown, message: string): void {
    if (error instanceof Error) {
        console.log(error.message);
        console.log(message);
        if (messages.includes(error.message)) {
            throw new Error(error.message);
        } else {
            console.error(
                `${message}: ${error.message}\nStack Trace: ${error.stack}`
            );
        }
    } else {
        console.error(message);
    }
}
