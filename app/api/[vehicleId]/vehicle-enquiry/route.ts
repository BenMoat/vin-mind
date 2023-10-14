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
    console.log(body);
    var config = {
      method: "post",
      url: dvlaApiUrlTest,
      headers: {
        "x-api-key": dvlaApiKeyTest,
        "Content-Type": "application/json",
      },
      data: body,
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
