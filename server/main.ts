import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import listInsights from "./operations/list-insights.ts";
import createInsight from "./operations//create-Insight.ts";
import deleteInsight from "./operations//delete-Insight.ts";
import updateInsight from "./operations//update-inight.ts";

console.log("Loading configuration");

const env = {
  port: 5174,
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

//My Initiativve(Not included in the task): Created Updated function also this is not mentioned in the task but i took this initiative to complete the CRUD operartion.
router.put("/insights/:id", async (ctx) => {
  try {
    const id = Number(ctx.params.id);
    if (!id || isNaN(id)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid insight ID" };
      return;
    }

    const body = await ctx.request.body.json();
    // const data = await body.value;

    if (
      typeof body.brand !== "number" ||
      !Number.isInteger(body.brand) ||
      body.brand <= 0
    ) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid or missing brand" };
      return;
    }

    if (typeof body.text !== "string" || !body.text.trim()) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Insight text is required" };
      return;
    }

    const updated = await updateInsight({
      db,
      id,
      brand: body.brand,
      text: body.text,
    });

    ctx.response.status = 200;
    ctx.response.body = updated;
  } catch (error) {
    console.error("Update failed:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: error.message || "Failed to update insight" };
  }
});

//Task 1: Create Item function
router.post("/insights/create", async (ctx) => {
  try {
    const body = await ctx.request.body.json(); // ✅ FIXED for Oak v12+

    const insight = createInsight({
      db,
      brand: body.brand,
      createdAt: body.createdAt,
      text: body.text,
    });

    ctx.response.status = 201;
    ctx.response.body = insight;
  } catch (err) {
    console.error("Error creating insight:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: err.message };
  }
});

//Task 2: Delete Item function
router.delete("/insights/delete/:id", async (ctx) => {
  const id = Number(ctx.params.id);

  try {
    const result = await deleteInsight({ db, id });

    ctx.response.status = result.success ? 200 : 404;
    ctx.response.body = result;
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = { error: err.message };
  }
});

const app = new oak.Application();
app.use(oakCors({
  origin: "*",
  credentials: true,
}));

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Started server on port ${env.port}`);
await app.listen({ port: env.port });
