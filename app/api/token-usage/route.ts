const DASHBOARD_URL = "https://ai-teaching-dashboard.utah1974.chatgpt.site/api/cost-usage";
const ALLOWED = new Set(["j.c.catling@bham.ac.uk", "a.z.brzozowski@bham.ac.uk"]);
const email = (value: unknown) => typeof value === "string" ? value.trim().toLowerCase() : "";
export async function GET(request: Request) {
  const user = email(new URL(request.url).searchParams.get("email"));
  if (!ALLOWED.has(user)) return Response.json({ error: "Unauthorised email address." }, { status: 403 });
  const response = await fetch(`${DASHBOARD_URL}?email=${encodeURIComponent(user)}`, { cache: "no-store" });
  return new Response(response.body, { status: response.status, headers: { "content-type": "application/json" } });
}
export async function POST(request: Request) {
  const body = await request.json() as { action?: string; email?: string; tokens?: number };
  const user = email(body.email);
  if (!ALLOWED.has(user) || body.action !== "reset") return Response.json({ error: "Unauthorised request." }, { status: 403 });
  const response = await fetch(DASHBOARD_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "reset", email: user }) });
  return new Response(response.body, { status: response.status, headers: { "content-type": "application/json" } });
}
