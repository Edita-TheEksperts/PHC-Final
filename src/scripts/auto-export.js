import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const RENDER_EXPORT_URL = `https://api.render.com/v1/services/${process.env.RENDER_DB_SERVICE_ID}/exports`;

export async function triggerDatabaseExport() {
  try {
    const response = await fetch(RENDER_EXPORT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RENDER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    
    return data;
    
  } catch (err) {
    throw err;
  }
}
