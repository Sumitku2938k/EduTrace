const FACE_API_BASE_URL = process.env.PYTHON_FACE_API_URL || 'http://127.0.0.1:8001';
const FACE_API_TIMEOUT_MS = Number(process.env.PYTHON_FACE_API_TIMEOUT_MS || 8000);

const toBase64 = (buffer) => buffer.toString('base64');

const postToFaceService = async (path, payload) => { // Node → HTTP POST → Python API
    const controller = new AbortController(); //agar Python slow → request cancel
    const timer = setTimeout(() => controller.abort(), FACE_API_TIMEOUT_MS);

    try {
        const response = await fetch(`${FACE_API_BASE_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) { //Python gives error → throw
            const upstreamMessage = data.message || data.detail || 'Face service request failed';
            const error = new Error(upstreamMessage);
            error.statusCode = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        if (error.name === 'AbortError') { //8 sec cross → custom error
            const timeoutError = new Error('Face recognition service timeout. Please try manual attendance.');
            timeoutError.statusCode = 504;
            throw timeoutError;
        }

        throw error;
    } finally {
        clearTimeout(timer);
    }
};

// student ka face register karne ke liye || buffer → base64 → Python API call
const enrollFaceFromBuffer = async ({ imageBuffer, mimeType }) => {
    const data = await postToFaceService('/enroll-face', {
        imageBase64: toBase64(imageBuffer),
        mimeType,
    });

    if (!Array.isArray(data.embedding) || data.embedding.length === 0) { //agar Python ne galat data diya → error
        const error = new Error('Face service returned invalid embedding');
        error.statusCode = 502;
        throw error;
    }

    return {
        embedding: data.embedding,
        modelVersion: data.modelVersion,
    };
};

//face identify karne ke liye || buffer → base64 → Python API call with candidates → match result
const recognizeFaceFromBuffer = async ({ imageBuffer, mimeType, candidates }) => {
    const data = await postToFaceService('/recognize-face', {
        imageBase64: toBase64(imageBuffer),
        mimeType,
        candidates,
    });

    return {
        isMatch: Boolean(data.isMatch),
        studentId: data.studentId || null,
        confidence: typeof data.confidence === 'number' ? data.confidence : null,
    };
};

module.exports = {
    enrollFaceFromBuffer,
    recognizeFaceFromBuffer,
};
