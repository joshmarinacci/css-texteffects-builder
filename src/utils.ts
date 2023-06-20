import {useEffect} from "react";
import {GOOGLE_FONTS} from "./model";

export function useGoogleFonts() {
    useEffect(() => {
        const links = document.querySelectorAll('link')
        const linkmap = new Map<string, HTMLLinkElement>()
        links.forEach(link => {
            if (link.hasAttribute('href')) {
                linkmap.set(link.getAttribute('href') as string, link)
            }
        })
        GOOGLE_FONTS.forEach(fnt => {
            const url = fnt.url
            if (!linkmap.has(url)) {
                const link = document.createElement('link')
                link.setAttribute('rel', 'stylesheet')
                link.setAttribute('href', url)
                document.head.appendChild(link)
                console.log("loading link", url)
            }
        })
    }, [])
}
