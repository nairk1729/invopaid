import { supabase } from "./supabase";

export function getVisitorId() {
  let visitorId = localStorage.getItem("invopaid_visitor_id");

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("invopaid_visitor_id", visitorId);
  }

  return visitorId;
}

export async function trackEvent(eventType, currency = null) {
  const visitorId = getVisitorId();

  await supabase.from("analytics_events").insert({
    visitor_id: visitorId,
    event_type: eventType,
    currency
  });
}