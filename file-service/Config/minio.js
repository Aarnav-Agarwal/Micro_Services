import * as Minio from 'minio';

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123'
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'file-uploads';

async function initBucket() {
    try {
        const exists = await minioClient.bucketExists(BUCKET_NAME);
        if (!exists) {
            await minioClient.makeBucket(BUCKET_NAME);
            console.log(`MinIO bucket "${BUCKET_NAME}" created successfully`);
        } else {
            console.log(`MinIO bucket "${BUCKET_NAME}" already exists`);
        }
    } catch (err) {
        console.error('Error initializing MinIO bucket:', err);
        throw err;
    }
}

export { minioClient, BUCKET_NAME, initBucket };
