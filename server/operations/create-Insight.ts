import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  brand: number;
  createdAt: string;
  text: string;
};

export default (input: Input): Insight => {
  try {
    console.log("Inserting new insight:", input);

    const createdAt = new Date(input.createdAt).toISOString(); // safer formatting

    const [row] = input.db.sql<insightsTable.Row>` 
      INSERT INTO insights (brand, createdAt, text)
      VALUES (${input.brand}, ${createdAt}, ${input.text})
      RETURNING * 
    `;

    if (!row) throw new Error("Failed to insert new insight");

    const result: Insight = {
      ...row,
      createdAt: new Date(row.createdAt),
    };

    console.log("Insight inserted:", result);
    return result;
  } catch (err) {
    console.error("Error inserting insight:", err);
    throw err;
  }
};
