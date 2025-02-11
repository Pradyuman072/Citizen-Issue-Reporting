import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAddressFromCoordinates(latitude, longitude) {
  try {

    // Using OpenStreetMap's Nominatim service instead of Google Maps
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': process.env.APP_NAME || 'CivicIssueReporter/1.0',
        'Accept-Language': 'en' // Request English results
      }
    });
    
    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.display_name) {
      return data.display_name;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { issueType, description, location } = body;

    // Input validation
    if (!issueType || !location) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract latitude & longitude
    const [latitude, longitude] = location.split(',').map(coord => coord.trim());

    // Input validation for coordinates
    if (isNaN(latitude) || isNaN(longitude) ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { message: 'Invalid coordinates provided.' },
        { status: 400 }
      );
    }

    // Convert Lat-Long to Address
    const address = await getAddressFromCoordinates(latitude, longitude);
    if (!address) {
      return NextResponse.json(
        { message: 'Unable to determine a valid address from coordinates.' },
        { status: 400 }
      );
    }

    // Initialize Gemini Model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Updated Prompt
    const prompt = `You are an AI assistant helping users report civic issues to the correct local authorities.
A user has reported an issue with the following details:
- **Issue Type:** ${issueType}
- **Location:** ${address}
- **Description:** ${description}
### Task:
- Identify the **official government department** responsible for handling this issue in this locality.
- Provide **verified** contact details (phone, email) from local **municipal or government websites**.
- If official sources are unavailable, clearly state that **you couldn't find verified data**.
### Expected JSON Response:
{
  "department": "string",
  "contactNumber": "string",
  "email": "string",
  "additionalInfo": "string"
}`;

    // Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('API Response:', text); // Log API response

    try {
      const authorityInfo = JSON.parse(text);
      // Ensure essential fields are present
      if (!authorityInfo.department || !authorityInfo.contactNumber) {
        return NextResponse.json(
          {
            message: 'No verified authority information found. Please check local municipal websites.'
          },
          { status: 404 }
        );
      }
      return NextResponse.json(authorityInfo);
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      return NextResponse.json(
        {
          message: 'Error parsing authority information',
          error: parseError.message
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error detecting authorities:', error);
    return NextResponse.json(
      {
        message: 'Error detecting authorities',
        error: error.message
      },
      { status: 500 }
    );
  }
}

