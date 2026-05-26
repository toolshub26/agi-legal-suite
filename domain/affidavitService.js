import { nameSchema } from "../validation/zodSchemas.js";
import { debounce } from "../utils/debounce.js";

const DRAFT_KEY = "agi_name_draft";

let isHydrating = false;

// Restore saved draft
export function restoreDraft() {
  try {
    isHydrating = true;

    const saved = localStorage.getItem(DRAFT_KEY);

    if (!saved) return "";

    const parsed = JSON.parse(saved);

    if (
      parsed &&
      typeof parsed.name === "string"
    ) {
      return parsed.name;
    }

    return "";
  } catch (error) {
    console.error("[restoreDraft error]", error);
    return "";
  } finally {
    isHydrating = false;
  }
}

// Internal save function
async function save(name) {
  try {
    if (isHydrating) return;

    const result = nameSchema.safeParse({
      name
    });

    if (!result.success) {
      console.warn("[validation failed]");
      return;
    }

    const payload = {
      name: result.data.name,
      updatedAt: Date.now()
    };

    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify(payload)
    );

    console.log(
      "[draft saved]",
      payload.name
    );
  } catch (error) {
    console.error("[saveDraft error]", error);
  }
}

// Debounced public save
export const saveNameDraft = debounce(save, 300);
