import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
  brand: number;
  text: string;
};

export default async (input: Input): Promise<Insight> => {
  if (typeof input.text !== "string" || !input.text.trim()) {
    throw new Error("Insight text is required");
  }
  if (!Number.isInteger(input.brand) || input.brand <= 0) {
    throw new Error("Invalid brand");
  }

  const [row] = await input.db.sql<insightsTable.Row>`
    UPDATE insights
    SET brand = ${input.brand},
        text = ${input.text}
    WHERE id = ${input.id}
    RETURNING *
  `;

  if (!row) throw new Error(`No insight found with id ${input.id}`);

  return {
    ...row,
    createdAt: new Date(row.createdAt),
  };
};
