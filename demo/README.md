The DemoApplication does not represent existing best practices. Although the
demo-app code is organized in a Package.js package to make the concerns
separate, for the demostrantion purposes other good practices are skipped.

In fact, the scripts on the page are loaded with individual `<script>`
tags in order to be as explicit about what's going on as possible. And the
templates are inline on the page in order to make their usage more clear and
avoid any hard dependency that would otherwise load them.
