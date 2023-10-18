import axios from "axios";
import { NextResponse } from "next/server";

//Test
const dvlaApiKeyTest = process.env.DVLA_API_KEY_TEST;
const dvlaApiUrlTest = process.env.DVLA_API_URL_TEST;

//Prod
const dvlaApiKey = process.env.DVLA_API_KEY_PROD;
const dvlaApiUrl = process.env.DVLA_API_URL_PROD;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    var config = {
      method: "post",
      url: dvlaApiUrl,
      headers: {
        "x-api-key": dvlaApiKey,
        "Content-Type": "application/json",
      },
      data: body,
    };

    const response = await axios(config);

    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      switch (error.response.status) {
        case 400:
          return new NextResponse(
            JSON.stringify({ message: "Invalid Reg Number" }),
            { status: 400 }
          );
        case 404:
          return new NextResponse(
            JSON.stringify({ message: "Vehicle Not Found" }),
            { status: 404 }
          );
        case 500:
          return new NextResponse(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
          );
        case 503:
          return new NextResponse(
            JSON.stringify({ message: "Service Unavailable" }),
            { status: 503 }
          );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
}
