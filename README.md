# Where and how can you use JQuery with the SDK?

jQuery can be used in CheerioCrawler for manipulating the DOM of a HTML page.

## What is the main difference between Cheerio and JQuery?

The context is where jQuery will search for the given selector, so in plain JS the equivalent would be

document.getElementById('#name')

where document is the context, and #name is the selector.

The default context in Cheerio is always document, unless another context is specifically given in the format

$(selector, context)
The selector only has context if it's two strings, separated by a comma, so something like this would still use document as context

$('#name, .name')

and it would search for both elements, not one inside the other etc. because it's just one string, containing a comma, so it's not the same thing.


## When would you use CheerioCrawler and what are its limitations?

I will use when I need simple HTTP requests,

4GB memory limit
Doesn't work on all sites
Can easily overload the target site with requests
Does not allow any manipulation of the site before parsing.



## What are the main classes for managing requests and when and why would you use one instead of another?

RequestList class it is a static, immutable list of URLs and other metadata

RequestQueue on the other hand, represents a dynamic queue of Requests. One that can be updated at runtime by adding more pages - Requests to process.


## How can you extract data from a page in Puppeteer without using JQuery?


querySelector or getElementById...


## What is the default concurrency/parallelism the SDK uses?

when default value  the concurrency will scale up automatically.
