# Assignment #2

## Topic 4: URL-based access control can be circumvented

This website has an unauthenticated admin panel at /admin, but a front-end system has been configured to block external access to that path. However, the back-end application is built on a framework that supports the X-Original-URL header.

Objective: access the admin panel and delete the user carlos.
