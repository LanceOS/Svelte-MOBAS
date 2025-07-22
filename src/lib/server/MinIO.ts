/**
 * @file MinIO Client and File Management Utilities
 * @description
 * This file provides a client for interacting with the MinIO object storage server
 * and includes utility functions for common file operations such as uploading files
 * and generating presigned URLs for private access. It leverages environment variables
 * for secure configuration of MinIO credentials and endpoints.
 * 
 * @note For detailed documentation go the MinIO documentation at https://min.io/docs/minio/kubernetes/upstream/index.html
 */

import { PRIVATE_BUCKET_ACCESS_KEY, PRIVATE_BUCKET_SECRET_KEY, PRIVATE_MINIO_PORT } from '$env/static/private';
import { PUBLIC_BUCKET_NAME, PUBLIC_MINIO_ENDPOINT } from '$env/static/public';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

/**
 * @constant {Minio.Client} minioClient
 * @description
 * The initialized MinIO client instance. This client is configured with the necessary
 * credentials and endpoint details to interact with the MinIO server.
 *
 * @property {string} endPoint
 * @property {number} port
 * @property {boolean} useSSL - Specifies whether to use SSL/TLS (HTTPS) for connections to MinIO.
 * Set to `true` for production environments with HTTPS, `false` for local HTTP.
 * @property {string} accessKey
 * @property {string} secretKey
 * @property {string} region
 * @property {boolean} pathStyle - Ensures path-style access for buckets (e.g., `s3.example.com/bucketname/objectname`).
 * This is often necessary for self-hosted MinIO and sometimes required by older S3 clients.
 */
export const minioClient = new Minio.Client({
    endPoint: PUBLIC_MINIO_ENDPOINT,
    port: parseInt(PRIVATE_MINIO_PORT),
    useSSL: false,
    accessKey: PRIVATE_BUCKET_ACCESS_KEY,
    secretKey: PRIVATE_BUCKET_SECRET_KEY,
    region: "us-east-1",
    pathStyle: true
});

/**
 * @constant {string} bucketName
 * @description
 * The name of the MinIO bucket where files will be stored.
 */
export const bucketName = PUBLIC_BUCKET_NAME;


/**
 * Uploads a given `File` object to the configured MinIO bucket.
 * This function generates a unique ID for the file, converts the file into a buffer,
 * and then uploads it to MinIO.
 *
 * @param {File} file The `File` object to be uploaded. This typically comes from a browser's File API.
 * @returns {Promise<string>} A `Promise` that resolves to a `string`, which is the unique identifier (object name)
 * assigned to the file within the MinIO bucket. This ID can be used later to retrieve or delete the file.
 * @throws {Error} If the file upload to MinIO fails for any reason (e.g., connection issues,
 * permissions errors). The error will be logged to the console before being re-thrown.
 */
export async function uploadFile(file: File): Promise<string> {
    try {
        const fileId = uuidv4();
        const buffer = Buffer.from(await file.arrayBuffer());

        const metaData = {
            'Content-Type': file.type,
            'Original-Name': file.name
        };

        await minioClient.putObject(
            bucketName,
            fileId,
            buffer,
            buffer.length,
            metaData
        );

        console.log(`Successfully uploaded ${file.name} as ${fileId} to bucket ${bucketName}.`);
        return fileId;
    } catch (error) {
        console.error(`MinIO upload error for file "${file?.name || 'unknown'}":`, error);
        throw new Error(`Failed to upload file "${file?.name || 'unknown'}". Please try again.`);
    }
}


/**
 * Generates a presigned, time-limited URL for accessing a specific file stored in the MinIO bucket.
 * This URL allows temporary read access to a private MinIO object without requiring direct authentication credentials.
 * The generated URL is valid for 3600 seconds (1 hour) by default.
 *
 * @param {string} fileId The unique identifier (object name) of the file within the MinIO bucket
 * for which to generate the URL. This ID is typically returned by the `uploadFile` function.
 * @returns {Promise<string>} A `Promise` that resolves to a `string`, representing the presigned URL that can be used
 * to access the file.
 * @throws {Error} If there is an issue generating the presigned URL (e.g., the file does not exist,
 * MinIO connection problems). The error will be logged to the console before being re-thrown.
 */
export async function getFileUrl(fileId: string): Promise<string> {
    try {
        const url = await minioClient.presignedGetObject(bucketName, fileId, 3600);
        console.log(`Generated presigned URL for file ID ${fileId}.`);
        return url;
    } catch (error) {
        console.error(`MinIO URL generation error for file ID "${fileId}":`, error);
        throw new Error(`Failed to generate URL for file ID "${fileId}". The file might not exist or there's a server issue.`);
    }
}