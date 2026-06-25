---
id: "15"
title: "Working with HTTP and REST APIs"
slug: "working-with-http-and-rest-apis"
imageUrl: "https://picsum.photos/seed/http/800/600"
excerpt: "Consuming REST APIs in Flutter with proper error handling and loading states."
publishedAt: "2026-04-28"
---

Use the http package for simple requests or dio for more control. Always handle errors: network failures, non-200 responses, and JSON parsing exceptions all need distinct handling.

Model API responses as sealed classes with success and failure variants. This forces call sites to handle both cases at compile time, eliminating forgotten error states.

For the repository pattern, the infrastructure adapter handles HTTP and maps JSON to domain entities. The domain never knows the transport format — only the adapter does.
