# IFrame Demo

This project provides a demonsration of a technique that would allow applications like PiPedal to directly download files to the PiPedal server, 
instead of the current two-step process which requires a download to the local machine, and then an upload to the PiPedal server. 

The basic premise is that the target site would be hosted in an IFRAME within the PiPedal UI. The URL provided to the IFRAME would provide a marker of 
some kind indicating that the page is being embedded in an IFRAME within a host application. For the purposes of this demonstration, a query parameter ('?iframe_hosted') in 
the URL indicates that the site is being IFRAME-hosted. 

If the target site is being IFRAME-hosted, then instead of downloading the file directly, the target site application would post the download URL to its parent window
using the postMessage API. Cross-site hosted IFRAMEs cannot communicate with their parent window normally; the sole exception is the postMessage API which does work 
across cross-site boundaries. 

The child IFRAME posts a message to the parent window as follows: 

```
// Post to parent of the current IFRAME for app-specific handling.
function iframeParentDownload(url: string) {
    // convert url to an absolute ULR
    const absoluteUrl = new URL(url, window.location.origin).href;
    window.parent.postMessage({
        type: "download",
        url: absoluteUrl
    }, "*");
}

// Normal download 
function normalDownload(url: string) {
        const link = document.createElement("a");
        link.href = url;
        link.download = url.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
}

// Are we running inside a hosting IFRAME?
function isIframeHosted() {
    const url = new URL(window.location.href);
    return url.searchParams.get("iframe_hosted") !== null;
}

// Conditionally download a file based on whether we are hosted in an IFRAME or not.
function downloadFile(url: string)
{
    if (isIframeHosted()) {
        iframeParentDownload(url);
    } else {
        normalDownload(url);
    }
}

```
The parent window receives the message as follows:
```
    <script>
        var hostedUrl = 'http://127.0.0.1:5173/';

        window.addEventListener('message', function (event) {
            if (!event.origin.toString().startWith(hostedUrl)) {
                console.error('Received message from unauthorized origin:', event.origin);
                return;
            }
            alert('Message received from iframe:\n' + 
              "    event.data.type=" + event.data.type + "\n    event.data.url= " + event.data.url );
        });

        // display the target site in our IFRAME; The ?iframe_hosted parameter
        // to the target site that it should post messages instead of downloading
        /// directly.
        var iframe = document.getElementById('hostFrame');
        iframe.src = hostedUrl + '?iframe_hosted';

    </script>

```

This project contains a react app that emulates a target site that can download normally, or delegate to a hosting IFRAME application. 

The file `demoPage.html` provides a very basic emulation of an application that wants to handle downloads itself. 

To run the demo target site, start the VITE/React demo target site:
```
cd website
npm run dev
```

To run the demo hosting app, browse to the project root in a Navigator/Folder browser, and double-click on `demoPage.html` to launch the page 
in a web browser. Clicking on the download buttons in the target site will post messages back to the parent `demoPage.html` page. 

Pages that have addresses that start with `http://127.0.0.1:1573` and `file://`, respectively are definitely cross site. I have also double-checked that 
this scheme works using pages on different machines as well.

## Handling of Authentication

PiPedal would obtain access tokens using the existing scheme. 



