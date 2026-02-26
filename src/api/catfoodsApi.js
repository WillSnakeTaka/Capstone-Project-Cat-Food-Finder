import { supabase } from "../lib/supabaseClient";

const TABLE = "catfoods";

// REST shape equivalent: GET /catfoods?type=wet|dry
export async function listCatFoods(type = "all") {
  let query = supabase.from(TABLE).select("*").order("id", { ascending: false });
  if (type !== "all") {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// REST shape equivalent: POST /catfoods
export async function createCatFood(payload) {
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data;
}

// REST shape equivalent: PATCH /catfoods/:id
export async function updateCatFood(id, payload) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// REST shape equivalent: DELETE /catfoods/:id
export async function deleteCatFood(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
