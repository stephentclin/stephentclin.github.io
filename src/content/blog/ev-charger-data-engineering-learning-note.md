---
title: "Learning note from COMP 5339 Group project Part 1: building an EV charger data engineering pipeline"
date: "2026-09-04"
slug: "ev-charger-data-engineering-learning-note"
excerpt: "A public-facing reflection on planning a reproducible data engineering workflow for NSW EV charger, spatial boundary, and augmentation data."
tags: "Data Engineering, Spatial Data, DuckDB, EV Infrastructure, Study"
published: true
---

# Learning note: building an EV charger data engineering pipeline

This note summarises how I am thinking about a data engineering project focused on electric vehicle charging infrastructure in New South Wales. The project combines open transport data, spatial boundary data, external charger information, and structured storage for later analysis.

The goal is to document the engineering thinking behind the work: how to design a reproducible pipeline, how to reason about data quality, and how to prepare data for spatial analysis.

## Project context

The task is centred on integrating several types of data:

- EV charger location data from Transport for NSW or data.gov.au
- SA4-level regional boundary data from the Australian Bureau of Statistics
- Additional charger details from operator websites or open APIs
- A structured database that supports analysis and future visualisation

The core challenge is not just downloading datasets. It is turning messy real-world data into a reliable, documented, and reusable data product.

For Part 1, we just need to focus on data retrieving, cleaning, and joining.

For Part 2, we need to do price monitor for EV Charger.

## What this project helps me practise

This project is a good opportunity to connect several data engineering skills:

- Automated data retrieval from public data sources
- Data cleaning and quality assessment
- Spatial joining between point data and regional boundary data
- Web or API-based data augmentation
- Relational database design
- DuckDB-based storage and querying
- Documentation of assumptions, limitations, and reproducibility steps

The most interesting part for me is the connection between data reliability and practical infrastructure analysis. EV charger coverage is a real-world topic where geography, data completeness, and source consistency all matter.

## Reproducibility as a design principle

One important requirement is that the workflow should be reproducible. Instead of relying on manual downloads, the data retrieval process should be automated as much as possible.

For a project like this, reproducibility means:

- Data sources are clearly listed
- Retrieval steps can be re-run in a clean environment
- Dependencies are documented
- Intermediate and final outputs are named consistently
- Assumptions are written down close to the data processing steps
- The same inputs should lead to the same final database or processed files

This is especially important when datasets are updated over time. If a pipeline depends on "the latest file", the version and retrieval date need to be recorded so later analysis can be interpreted correctly.

## Data quality questions

Before any analysis, I want to understand the quality of the charger dataset. Some useful questions include:

- Are there missing coordinates?
- Are charger names consistent across sources?
- Are there duplicate charger locations?
- Are charger types represented consistently?
- Do operator names appear in multiple formats?
- Are address fields clean enough for matching?
- Are there chargers near SA4 boundaries that require careful spatial handling?

These checks shape the rest of the project. Good data cleaning is not just about making a file look tidy. It is about understanding what can and cannot be trusted.

## Spatial integration

The spatial component adds another layer of reasoning. EV charger locations are point data, while SA4 regions are polygon boundaries. The integration step needs to determine which region each charger belongs to.

Conceptually, this is a point-in-polygon problem:

- Each charger has a geographic coordinate
- Each SA4 region has a boundary geometry
- The workflow assigns a regional label to each charger based on its location

This enables later questions such as:

- Which regions have more DC fast chargers?
- Are chargers concentrated in metropolitan areas?
- Which areas may have weaker charging infrastructure coverage?
- How does charger availability relate to regional geography?

Spatial joins are powerful, but they also require care. Coordinate reference systems, invalid geometries, and missing coordinates can all affect the result.

## Data augmentation strategy

The original dataset may not include every useful charger detail. Additional information might come from operator websites or public APIs, such as:

- Plug types
- Pricing information
- Operator details
- Number of charging bays
- Fast charger characteristics

The difficult part is matching external records back to the original charger locations. Possible matching signals include charger name, operator name, address, and coordinates.

For a clean project record, I would document:

- Which external sources were used
- How records were matched
- Which fields were added
- How many records were successfully augmented
- Where matching was uncertain
- What limitations remain

This documentation matters because augmented data can look authoritative even when the matching process is imperfect.

## Storage and modelling

The final dataset needs to be stored in a structured way that supports analysis. DuckDB is a good fit for this kind of project because it works well for local analytical workflows and can query structured files efficiently.

At a conceptual level, the database design should separate different ideas clearly:

- Charger locations
- Operators
- Charger characteristics
- Geographic regions
- Augmented external attributes

The design decision is a trade-off. A more normalised model can reduce duplication and make relationships clearer. A more denormalised model can sometimes make analysis simpler. The best choice depends on the expected queries and how stable the data relationships are.

## What I want the final workflow to show

By the end of this project, I want the workflow to demonstrate more than technical completion. I want it to show that I can:

- Work with public datasets responsibly
- Build repeatable data pipelines
- Handle spatial data integration
- Explain data quality limitations clearly
- Design storage for future analysis
- Communicate engineering decisions in a structured way

This connects strongly with my broader interest in industrial AI and data-driven systems. In real systems, the value of analysis depends heavily on the quality of the pipeline underneath it.

## Personal reflection

The project is a useful reminder that data engineering is not only about code. It is about judgement: choosing reliable sources, handling incomplete records, documenting uncertainty, and building outputs that someone else can reproduce.

For portfolio purposes, this kind of project can become a strong case study because it combines practical data work with clear engineering communication. The most valuable outcome is not just a final dataset, but a workflow that explains how the dataset became trustworthy enough to use.
