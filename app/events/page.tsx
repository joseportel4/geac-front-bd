import { eventService } from "@/services/eventService";
import EventsContent from "./EventsContent";
import { Event } from "@/types/event";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: Event[] = [];

  try {
    events = await eventService.getAllEvents();
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
  }

  return <EventsContent initialEvents={events} />;
}
