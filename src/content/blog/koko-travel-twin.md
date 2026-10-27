---
title: "Building Koko, Your Travel Twin: The Engineering Behind a Travel Agent"
date: "2026-10-27"
slug: "koko-travel-twin"
excerpt: "My development journey building Koko: native mobile apps, travel-data integration, agent memory, itinerary checks, and the lessons behind an AWS deployment."
tags: "AI Agents, Full-stack, Travel, Hackathon, C#, AWS"
published: true
---

# Building Koko, Your Travel Twin: The Engineering Behind a Travel Agent

A travel itinerary is easy to describe and surprisingly difficult to make work. A museum might close before you arrive. Two recommendations might refer to the same place. A route that looks short on a map can become an exhausting afternoon when you add the walking inside each attraction.

These details shaped **Koko, Your Travel Twin**, a travel-planning application developed by our team, **Jackpot**. Koko combines a friendly mobile companion with a backend that brings together travel data, proposes itineraries, and exposes the things that still need checking.

This post focuses on the engineering decisions I worked through: connecting the app to real data, separating agent reasoning from calculations, handling memory, and making the system testable beyond the mobile interface.

> This is a development snapshot from 27 October 2026. Koko is a hackathon prototype under active development. Screenshots show actual application states, including incomplete drafts; they are not evidence of confirmed bookings or fully verified itineraries.

## The hackathon that gave the project its shape

We developed Koko for the **Open Agent Hackathon 2026**, an online event running from 22–27 October over 144 hours. Our project aligns with its **Solving Fragmented Intelligence** track: useful information is scattered across systems, and an agent needs to make those pieces work together. The [official event page](https://hackathon.genai.works/event/open-agent-hackathon-2026) describes the competition, tracks, and submission requirements.

Travel made this challenge concrete. A traveler does not think in terms of database connectors or model providers. They ask: “Can I do this comfortably, in this weather, with the time and money I have?” Answering that requires much more than a list of attractive places.

## What I wanted Koko to feel like

I wanted a traveler to begin with a small idea rather than a long form: a destination, a few interests, a rough budget, and an honest description of their energy level. Koko should help turn that into an editable plan while keeping the traveler in control.

The koala companion gives that interaction a recognizable face. Behind it, the product needs to remember preferences only with consent, distinguish suggestions from commitments, and explain uncertainty without turning every screen into a technical report.

![Koko’s Trips home screen, captured from the running iOS Simulator. An existing draft remains separate from saved trips.](/images/koko/app-home.png)

The home screen captures the direction I wanted: a clear starting action, a visible draft, and confirmation before saving. Getting the rest of the system to support that simple interaction became the real work.

## From a map of places to a usable travel-data layer

One of the first lessons was that a place visible on an Apple Maps basemap is not automatically a record in our own searchable catalog. The map and the application’s dataset have different sources and coverage. Without making that distinction, a missing marker looks like a broken category filter.

I worked through importing and classifying places, matching names and locations, and connecting results to the map. Selecting a place should move the camera to its position. Zoom controls should help the traveler understand the search area. Dense results need clustering rather than a wall of overlapping pins.

![The current Explore screen: category filters, clustered markers, zoom controls, and a nearby-place drawer. Map and dataset attribution remain visible.](/images/koko/app-explore.png)

The data layer also needed more careful semantics. A nearby activity is not necessarily sold by the restaurant whose detail page is open. A ticket price for an Opera House tour should not become the cost of every nearby attraction.

For food and activities, I separated information that is often mixed together:

| Information | Meaning in the application |
| --- | --- |
| Menu price | A specific item’s listed price, with a source and observation date |
| Reported spending | What one author says they spent on one visit; party size and original context matter |
| Estimated budget | A calculation based on selected items or stated assumptions |
| Activity ticket | A particular ticket type, date context, and official source |
| Recommendation | Someone’s attributed opinion, rather than an invented aggregate rating |

An unknown price must remain unknown. Treating missing data as zero makes a plan look affordable for the wrong reason.

### The same place can arrive under several names

Another difficult issue was identity. “Museum of Contemporary Art” and “Museum of Contemporary Art Australia” may describe one destination, while similarly named restaurants can be different branches.

The approach is to resolve candidate identity using source identifiers, aliases, and geographic context, then avoid repeating the same canonical destination across the trip. Name similarity alone is insufficient. Raw source evidence still needs to be retained so a merge can be explained and corrected.

This remains an area that needs adversarial examples and end-to-end checks. During screenshot capture, an existing draft still exposed two similar museum names. That is a useful reminder: adding a deduplication rule is not the same as proving every stored draft has been normalized.

## The architecture: agents supported by explicit rules

The product design separates three responsibilities:

| Component | Responsibility |
| --- | --- |
| Profile Agent | Capture and retrieve preferences the traveler agrees to remember |
| Planning Agent | Propose a trip using the request, candidate inventory, and planning Skill |
| Feasibility Agent | Independently review the proposed or edited plan and identify unresolved issues |

The separation matters because an agent that writes an itinerary can be too willing to justify its own answer. An independent review creates another opportunity to catch missing information or conflicts.

![The agent and data architecture from our product deck. This diagram is a design snapshot; its own notes distinguish implemented review APIs from legacy save flows still being integrated.](/images/koko/product-architecture.png)

The model proposes choices from known candidates. The C# backend then schedules and evaluates those choices: travel time, opening windows, costs, walking estimates, required visits, and other constraints. When evaluation fails, structured feedback can be used to request a repair. A deterministic fallback is identified as a fallback rather than presented as a successful model run.

The boundary I kept returning to was simple: **the model can suggest; the application must calculate and check.**

### What each platform actually does

**Zetaris** provides an integrated query layer over registered travel data. It helps bring fragmented sources into a consistent view for the backend. **PostgreSQL** stores application records, trip state, and supporting evidence. Import parsing, place matching, and business rules belong in the application layer rather than being delegated to a database name in an architecture diagram.

**Meterless H-MEM** supplies the preference-memory engine through a Node.js bridge. The current cloud-model configuration calls **NVIDIA’s model API** for inference. The application’s World Model state is implemented in **C# and PostgreSQL**; it should not be confused with a separately hosted Meterless World Model service. The optional Meterless Runtime adapter is a different integration path.

Being precise about those boundaries helped me explain the system without overstating what any individual tool was doing.

## Planning a day that someone can actually follow

The planning Skill grew as real questions appeared. Must-visit places, non-repetition, opening hours, meal times, weather, transport, and hotel locations all interact. A rule that improves one part of the day can make another part worse.

A booked hotel becomes an anchor for the route. Without a booking, accommodation results are suggestions with unverified availability, not reservations. If the traveler has substantial luggage, the plan needs a plausible morning drop-off and a later pickup before moving regions or returning to the hotel.

Weather needs context too. Rain can favor indoor activities, but a traveler who loves nature should not automatically receive a day of unrelated museums. Indoor/outdoor suitability, personal interests, and forecast confidence all matter. Dates beyond the forecast horizon must stay marked as unknown.

For transport, I moved the planning guidance toward public transport where practical, adjusted by traveler preference, with walking used for sensible connections. That depends on real route information: an attractive transit suggestion is not proof that a service runs at the required time.

### Walking is more than the distance between pins

I initially had to confront an easy mistake: using route distance as the entire walking estimate. A visitor can spend an hour walking inside a museum, garden, or precinct even when the next destination is nearby.

The estimate therefore needs separate contributions from travel legs and walking during visits. Conceptually:

```text
Estimated steps = walking-leg distance / assumed step length
                + walking time within visits × assumed cadence
```

Visit duration is not automatically walking duration. A seated lunch should not accumulate steps as if the traveler were walking continuously. Meals, afternoon tea, and meaningful rests can break a continuous walking segment, while the total daily estimate remains visible.

The Skill uses energy and feedback to guide the day, including rough low/high-energy references around 8,000 and 15,000 steps. These are planning assumptions, not measured fitness limits. Backend validation and any explicit user limits still need to be respected; editing prompt text does not silently change those checks.

I also added a goal of returning to the hotel around **20:00** where feasible, while removing a rigid four-attraction template. The aim is a useful, well-paced day with meals and travel included. Filling every minute with attractions is not a substitute for a feasible schedule.

![The existing draft review screen, captured from the iOS Simulator. Prices and opening hours are still unconfirmed, and the displayed return time falls short of the 20:00 target—visible gaps rather than hidden successes.](/images/koko/app-review.png)

This screen is especially important to the story. It shows that the application can expose incomplete work, but it also shows the remaining gap between planning intentions and the actual itinerary. The independent review API exists; integrating its approval requirements consistently across all older save flows is still work in progress.

## The infrastructure detour: Oracle to AWS

I started with an Oracle Always Free VM to make the backend reachable from simulators and physical phones. That was useful for learning the deployment path, but memory pressure and unreliable management access made iteration difficult. Even operating-system memory reservations mattered on a small machine.

The next experiment was to deploy the backend alongside the existing Zetaris installation on AWS in Sydney, using its existing EKS node. “Alongside” means separate workloads sharing a host—not inserting the application into the Zetaris process.

![Simplified cloud deployment: mobile clients connect to one ASP.NET Core backend; provider connections and credentials remain on the server.](/images/koko/cloud-architecture.svg)

The mobile app only needs the backend’s HTTPS address and its App access code. The backend owns the Zetaris connection, NVIDIA calls, and transit configuration. This makes local/cloud switching easier and keeps provider credentials out of the mobile application.

Sharing a host avoided another compute machine for this trial, but it introduced resource contention. I treat it as a low-load deployment experiment, not proof of production capacity or guaranteed performance improvement. Private configuration, persistent storage, and rollback procedures matter just as much as getting a container to start.

## Languages and tools behind the product

| Layer | Languages and tools | What I used them for |
| --- | --- | --- |
| iOS | Swift, SwiftUI, MapKit | Native screens, map interaction, draft review |
| Android | Kotlin, Jetpack Compose | Native Android application |
| Backend | C#, ASP.NET Core, .NET 10 | HTTP APIs, scheduling, validation, agent orchestration |
| Persistence | PostgreSQL, Entity Framework Core, SQL | Trips, application state, evidence, data access |
| Integrated data | Zetaris, SQL | Querying registered travel datasets |
| Memory bridge | JavaScript / Node.js, Meterless H-MEM | Consented preference memory |
| Model access | NVIDIA cloud API, JSON | Structured planning proposals and reviews |
| Operations | Python, Docker, Kubernetes, AWS EKS | Imports, test helpers, packaging, deployment |
| Planning policy | Markdown, JSON, Postman | Versioned Skills and repeatable API experiments |

### Making planning testable without tapping through the app

I added a planning test endpoint that accepts raw JSON or a multipart JSON file and can return a downloadable result. The handler uses the same draft-creation path as the application and does not save a trip.

This is an excerpt of the C# endpoint, with its routing and response logic shortened for readability:

```csharp
routes.MapPost("/planning/test", async (
    HttpContext context,
    Planner planner,
    PaidServicePolicy paidServices,
    PlanningAgent agent) =>
{
    var input = await ReadInputAsync(context);
    var draft = await PlanningEndpoints.CreateDraftAsync(
        input, planner, paidServices, agent,
        context.RequestAborted);

    return Results.Json(new { saved = false, draft });
});
```

The complete implementation also returns run and Skill metadata, validates upload size and format, and supports downloading the result. That makes it possible to compare changes to budget, dates, interests, and walking limits through Postman rather than repeatedly recreating a trip on a phone.

A small request fragment illustrates the contract; it is not a complete runnable request:

```json
{
  "days": 2,
  "mode": "assisted",
  "language": "en",
  "budget": 180,
  "maxSteps": 10000,
  "startMinute": 600,
  "endMinute": 1200,
  "accommodationStatus": "unknown"
}
```

Time is represented as minutes after midnight: `600` is 10:00 and `1200` is 20:00. Tests still need dates, location context, and the other fields appropriate to the scenario. The response must be inspected for warnings and unresolved requirements, not just a successful HTTP status.

### Treating the Skill as a versioned part of the system

I wanted to adjust planning guidance quickly without rebuilding the mobile app. The Skill-management API supports inspecting the active content, uploading a candidate, reviewing it, activating a version with concurrency protection, and explicitly rolling back.

Management uses a separate credential in addition to the App access code. Request snapshots and fingerprints make it possible to identify which instructions a planning run used. Chinese and English versions need to stay aligned, and edits should preserve existing requirements unless their removal is deliberate and reviewed.

This turned the Skill from a block of prompt text into something I could test and operate. It also made failures easier to discuss: was the problem missing evidence, a model choice, a scheduling rule, or a policy change?

## What this project changed about how I build agents

The most demanding part was connecting a friendly interface to facts that were incomplete, inconsistent, or unavailable. Each visible issue pushed a deeper engineering question. A missing map marker led to coverage and source identity. A sparse day led to timing and activity-duration rules. A convincing itinerary led to the need for independent review.

I learned to make uncertainty part of the product: unknown prices, unverified hours, provisional hotel endpoints, and forecasts outside their useful range should remain visible. I also learned to keep prompt rules and executable checks aligned. A sentence in a Skill is an intention; it becomes a dependable feature only when the data and application behavior support it.

My next priorities are stronger place-identity regression cases, consistent review enforcement across save paths, better evidence freshness, and resource and latency measurements under realistic concurrent use. I also want the interface to show these checks more compactly without hiding the information a traveler needs to make a decision.

Koko started as a travel-planning idea. Building it became a practical lesson in data engineering, native mobile design, cloud operations, and the limits of language-model reasoning. That combination is what makes me want to keep working on it.

## Project and sources

- [Project repository: f1sh11/hackathon](https://github.com/f1sh11/hackathon)
- [Open Agent Hackathon 2026: official event and FAQ](https://hackathon.genai.works/event/open-agent-hackathon-2026)
- Product overview and agent architecture: our **Koko Travel Twin – Current App** deck, team Jackpot.
- Home, Explore, and draft-review images: captured from the running iOS Simulator for this article. The architecture image is reproduced from the product deck; the cloud deployment diagram was prepared for this post.

The app screenshots retain the displayed map/data credits. Features, data coverage, and deployment choices described here belong to this development checkpoint and may change as the project evolves.
