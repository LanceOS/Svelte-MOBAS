import { PRIVATE_BUCKET_ACCESS_KEY, PRIVATE_BUCKET_SECRET_KEY, PRIVATE_MINIO_PORT } from '$env/static/private';
import { PUBLIC_BUCKET_NAME, PUBLIC_MINIO_ENDPOINT } from '$env/static/public';
import * as Minio from 'minio'
import { v4 as uuidv4 } from 'uuid';



export const minioClient = new Minio.Client({
    endPoint: PUBLIC_MINIO_ENDPOINT,
    port: parseInt(PRIVATE_MINIO_PORT),
    useSSL: true,
    accessKey: PRIVATE_BUCKET_ACCESS_KEY,
    secretKey: PRIVATE_BUCKET_SECRET_KEY,
    region: "us-east-1",
    pathStyle: true
});

export const bucketName = PUBLIC_BUCKET_NAME


/**
 * Uploads a given `File` object to the configured MinIO bucket.
 * This function generates a unique ID for the file, converts the file into a buffer,
 * and then uploads it to MinIO. It also logs the success of the upload to the console.
 *
 * @param file The `File` object to be uploaded. This typically comes from a browser's File API.
 * @returns A `Promise` that resolves to a `string`, which is the unique identifier (object name)
 * assigned to the file within the MinIO bucket. This ID can be used later to retrieve or delete the file.
 * @throws {Error} If the file upload to MinIO fails for any reason (e.g., connection issues,
 * permissions errors). The error will be logged to the console before being re-thrown.
 */
export async function uploadFile(file: File): Promise<string> {
    try {
        const fileId = uuidv4();
        const buffer = Buffer.from(await file.arrayBuffer());

        // Note: The `metaData` object is defined but not used in the `putObject` call.
        // If metadata is intended to be stored with the object, it should be passed as the fourth argument:
        // await minioClient.putObject(bucketName, fileId, buffer, metaData);
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
 * This URL allows temporary access to the private MinIO object without requiring authentication credentials.
 * The generated URL is valid for 3600 seconds (1 hour) by default.
 *
 * @param fileId The unique identifier (object name) of the file within the MinIO bucket
 * for which to generate the URL. This ID is typically returned by the `uploadFile` function.
 * @returns A `Promise` that resolves to a `string`, representing the presigned URL that can be used
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