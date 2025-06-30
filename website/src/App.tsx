import './App.css'
import IconButton from './IconButton';

interface DownloadItem {
    url: string,
    name: string,
    description: string
};
const downloadItems: DownloadItem[] = [
    { url: "/img/image1.svg", name: "File 1", description: "Description for File 1" },
    { url: "/img/image2.svg", name: "File 2", description: "Description for File 2" },
    { url: "/img/image3.svg", name: "File 3", description: "Description for File 3" },
];


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


function App() {

    return (
        <>
            <div style={{
                position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
                display: "flex", flexFlow: "column nowrap", alignItems: "stretch", gap: 16,
                padding: 16
            }}>
                
                <div style={{
                    position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
                    display: "flex", flexFlow: "column nowrap", alignItems: "stretch", gap: 16
                }}>
                    <h3>IFrame Demo App</h3>
                    <div style={{ flex: "1 1 auto", display: "flex", flexFlow: "column nowrap", justifyContent: "start", gap: 16, overflowY: "auto" }}>
                        {downloadItems.map((item) => (
                            <div key={item.url} style={{ flex: "0 0 auto", display: "flex", flexFlow: "row nowrap", alignItems: " start", gap: 8, marginLeft: 24, marginRight: 24 }}>
                                <a href={item.url} download={item.name}>
                                    <img src={item.url} alt={item.name} style={{ width: 100, height: 100, marginRight: 16 }} />
                                </a>
                                <div style={{ flex: "1 1 auto", display: "flex", flexFlow: "column nowrap", alignItems: "start", justifyContent: "start", gap: 4 }}>
                                    <h4 style={{ padding: 0, margin: 0 }}>{item.name}</h4>
                                    <p style={{ padding: 0, margin: 0 }}>{item.description}</p>
                                    <IconButton icon="download_2" onClick={()=>{downloadFile(item.url)}} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            </>
            )
}

            export default App
