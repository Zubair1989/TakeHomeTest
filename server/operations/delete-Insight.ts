import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

export default async (
  input: Input,
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Attempting to delete insight with id=${input.id}`);

    const result = await input.db.sql`
      DELETE FROM insights WHERE id = ${input.id}
      RETURNING *
    `;

    if (result.length === 0) {
      // No row found with this ID
      console.log("Insight not found.");
      return { success: false, message: "Insight with given ID not found." };
    }

    // Row found and deleted
    console.log("Insight deleted successfully.");
    return { success: true, message: "Insight deleted successfully." };
  } catch (err) {
    console.error("Error deleting insight:", err);
    return {
      success: false,
      message: "Internal error occurred while deleting insight.",
    };
  }
};
