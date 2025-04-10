import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export function getEnvVariable(variableName: string): string {
    const value = process.env[variableName];
    if (!value) {
        throw new Error(`Environment variable "${variableName}" is not defined.`);
    }
    return value;
}