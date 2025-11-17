import {NextRequest, NextResponse} from "next/server";
import {v2 as cloudinary} from "cloudinary";

// Validate environment variables
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
//     console.error('Missing Cloudinary environment variables:', {
//         CLOUDINARY_CLOUD_NAME: !!CLOUDINARY_CLOUD_NAME,
//         CLOUDINARY_API_KEY: !!CLOUDINARY_API_KEY,
//         CLOUDINARY_API_SECRET: !!CLOUDINARY_API_SECRET,
//     });
// }

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
            return NextResponse.json(
                { 
                    error: 'Cloudinary API credentials are not configured. Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables.' 
                },
                { status: 500 }
            );
        }

        const body = await request.json();
        const {paramsToSign} = body;

        if (!paramsToSign) {
            return NextResponse.json(
                { error: 'Missing paramsToSign in request body' },
                { status: 400 }
            );
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            CLOUDINARY_API_SECRET
        );

        
        return NextResponse.json({signature});
    } catch (error) {
        console.error('Error signing Cloudinary request:', error);
        return NextResponse.json(
            { error: 'Failed to sign request' },
            { status: 500 }
        );
    }
}

