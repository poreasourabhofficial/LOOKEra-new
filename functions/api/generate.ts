import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context) {

  try {

    const body = await context.request.json();

    const ai = new GoogleGenAI({

      apiKey: context.env.GEMINI_API_KEY

    });

    const response = await ai.models.generateContent({

      model: body.model,

      contents: body.contents,

      config: body.config

    });

    return new Response(JSON.stringify(response), {

      headers: {

        "Content-Type": "application/json"

      }

    });

  }

  catch (error) {

    return new Response(

      JSON.stringify({

        error: error.message

      }),

      { status: 500 }

    );

  }

}
