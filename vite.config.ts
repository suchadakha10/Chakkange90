import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { extractGeminiApiKeys, generateGeminiContentPack, generateGeminiTopicIdeas } from "./src/server/geminiContent";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    base: "/Chakkange90/",
    plugins: [react(), contentStudioGeminiApi(env)]
  };
});

function contentStudioGeminiApi(env: Record<string, string>): Plugin {
  return {
    name: "content-studio-gemini-api",
    configureServer(server) {
      server.middlewares.use("/api/content-studio/topics", async (request, response, next) => {
        const devRequest = request as any;
        if (devRequest.method !== "POST") {
          next();
          return;
        }

        try {
          const body = JSON.parse(await readRequestBody(devRequest)) as { brief?: unknown };
          const apiKeys = extractGeminiApiKeys(env);
          const pack = await generateGeminiTopicIdeas({
            brief: typeof body.brief === "object" && body.brief !== null ? body.brief : {},
            apiKeys,
            model: env.GEMINI_MODEL || "gemini-2.5-flash",
          });

          sendJson(response, 200, pack);
        } catch (error) {
          sendJson(response, 503, {
            error: error instanceof Error ? error.message : "Gemini API unavailable",
          });
        }
      });

      server.middlewares.use("/api/content-studio/generate", async (request, response, next) => {
        const devRequest = request as any;
        if (devRequest.method !== "POST") {
          next();
          return;
        }

        try {
          const body = JSON.parse(await readRequestBody(devRequest)) as { brief?: unknown };
          const apiKeys = extractGeminiApiKeys(env);
          const pack = await generateGeminiContentPack({
            brief: typeof body.brief === "object" && body.brief !== null ? body.brief : {},
            apiKeys,
            model: env.GEMINI_MODEL || "gemini-2.5-flash",
          });

          sendJson(response, 200, pack);
        } catch (error) {
          sendJson(response, 503, {
            error: error instanceof Error ? error.message : "Gemini API unavailable",
          });
        }
      });
    },
  };
}

function readRequestBody(request: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk: unknown) => {
      body += String(chunk);
    });
    request.on("end", () => resolve(body || "{}"));
    request.on("error", reject);
  });
}

function sendJson(response: any, statusCode: number, payload: unknown) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}
