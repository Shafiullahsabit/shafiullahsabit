import {
  createContextClient,
  verifyAuth,
} from "@supabase/server/core";

const serverEnv = globalThis.process?.env ?? {};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const requestHeaders = new Headers();
  if (typeof req.headers.authorization === "string") {
    requestHeaders.set("Authorization", req.headers.authorization);
  }

  let auth;
  let authError;
  try {
    ({ data: auth, error: authError } = await verifyAuth(
      new Request("https://localhost/api/analytics", {
        headers: requestHeaders,
      }),
      { auth: "user" },
    ));
  } catch (error) {
    console.error("Unable to verify dashboard analytics session:", error);
    return res
      .status(500)
      .json({ message: "Could not verify dashboard access." });
  }

  if (authError) {
    return res
      .status(authError.status)
      .json({ message: "Sign in to view dashboard analytics." });
  }

  const domain = serverEnv.PLAUSIBLE_DOMAIN;
  const apiKey = serverEnv.PLAUSIBLE_API_KEY;
  if (!domain || !apiKey) {
    return res.status(503).json({
      code: "ANALYTICS_NOT_CONFIGURED",
      message: "Plausible Analytics is not configured.",
    });
  }

  const apiUrl = "https://plausible.io/api/v2/query";
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const aggregateQuery = {
    site_id: domain,
    date_range: "30d",
    metrics: ["pageviews"],
  };
  const timeseriesQuery = {
    ...aggregateQuery,
    dimensions: ["time:day"],
    include: { time_labels: true },
  };

  try {
    const supabase = createContextClient({
      auth: { token: auth.token, keyName: auth.keyName },
    });
    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_contact_admin");
    if (adminError) {
      console.error("Unable to verify dashboard analytics permissions:", adminError);
      return res
        .status(500)
        .json({ message: "Could not verify dashboard access." });
    }
    if (isAdmin !== true) {
      return res
        .status(403)
        .json({ message: "Administrator access is required." });
    }

    const [aggregateResponse, timeseriesResponse] = await Promise.all([
      fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(aggregateQuery),
        signal: AbortSignal.timeout(10000),
      }),
      fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(timeseriesQuery),
        signal: AbortSignal.timeout(10000),
      }),
    ]);

    if (!aggregateResponse.ok || !timeseriesResponse.ok) {
      console.error("Plausible API request failed:", {
        aggregateStatus: aggregateResponse.status,
        timeseriesStatus: timeseriesResponse.status,
      });
      return res.status(502).json({
        message:
          "Could not load Plausible data. Check the site domain and API key.",
      });
    }

    const [aggregate, timeseries] = await Promise.all([
      aggregateResponse.json(),
      timeseriesResponse.json(),
    ]);
    const pageViews = aggregate.results?.[0]?.metrics?.[0];
    const results = timeseries.results;
    const timeLabels = timeseries.meta?.time_labels;

    if (
      !Number.isFinite(pageViews) ||
      !Array.isArray(results) ||
      !Array.isArray(timeLabels) ||
      results.some(
        (item) =>
          !Array.isArray(item.dimensions) ||
          typeof item.dimensions[0] !== "string" ||
          !Array.isArray(item.metrics) ||
          !Number.isFinite(item.metrics[0]),
      )
    ) {
      console.error("Plausible API returned an unexpected response shape.");
      return res
        .status(502)
        .json({ message: "Plausible returned invalid analytics data." });
    }

    return res.status(200).json({
      pageViews,
      points: timeLabels.map((date) => {
        const row = results.find(
          (item) => item.dimensions[0].slice(0, 10) === date.slice(0, 10),
        );
        return {
          date,
          pageViews: row ? row.metrics[0] : 0,
        };
      }),
    });
  } catch (error) {
    console.error("Unable to retrieve Plausible analytics:", error);
    return res
      .status(502)
      .json({ message: "Plausible Analytics is temporarily unavailable." });
  }
}
