// Cloudfront Function cloudfront-js-v2


const response502 = Object.freeze({
    statusCode: 502,
    statusDescription: 'Gateway error',
    body: 'Gateway error: invalid host',
});

// Main handler (entry point)
async function handler(event) {
    const DOMAIN_NAME = 'b64.tools'

    const EXTRA_SLASHES = /(\/+)/g;

    const request = event.request;
    const response = event.response;

    console.log(`Request: ${JSON.stringify(request)}`);
    console.log(`Response: ${JSON.stringify(response)}`);

    if (!request.method) {
        request.method = 'GET';
    }

    const hostHeader = (request.headers['host'] || {}).value;
    console.log(`Host: ${hostHeader}`);

    if (typeof hostHeader == 'undefined') {
        return response502;
    }

    if (hostHeader.toLowerCase() !== DOMAIN_NAME) {
        return response502;
    }

    // SSG
    // return ssgHandler(request);

    const originalPath = request.uri;

    // Remove extra slashes and trailing slash
    const trimmedPath = originalPath
        .replace(EXTRA_SLASHES, '/')
        .replace(/\/$/, '');

    // Handle wavy text and placeholder images
    if (trimmedPath.startsWith('/wavy/')) {
        return handleWavy(trimmedPath, request, response);
    } else if (trimmedPath.startsWith('/placeholder/')) {
        return handlePlaceholder(trimmedPath, request, response);
    }

    // const filePath = trimmedPath.split('/').pop();
    // const isResourceFile = filePath.includes('.');

    const isAssetPath = trimmedPath.startsWith('/assets');

    const s3Prefix = '/sites/b64tools/apps/beta/b64tools-app-mantine';

    const withoutSlash = trimmedPath.replace(/^\//, '');
    console.log(`Without slash: ${withoutSlash}`);

    if (isAssetPath) {
        request.uri = `${s3Prefix}/${withoutSlash}`;
    } else {
        // Otherwise, serve index.html
        request.uri = `${s3Prefix}/index.html`;
    }

    console.log(`Final request.uri: ${request.uri}`);

    return request;

}

function returnSVG(svg) {
    return {
        statusCode: 200,
        statusDescription: 'OK',
        headers: {
            'content-type': { value: 'image/svg+xml' },
        },
        body: {
            encoding: 'text',
            data: svg,
        },
    };
}

// Wavy svg handler
function handleWavy(pathname, request, response) {
    const DEFAULT_STROKE_WIDTH = 0.0670897;
    const THIN_STROKE_WIDTH = 0.0670897;
    const THICK_STROKE_WIDTH = 0.134179;
    const DEFAULT_FILL = "#339af0";
    const DEFAULT_STROKE = "#b3b3b3";
    const DEFAULT_HIGHLIGHT1 = "#339af0";
    const DEFAULT_HIGHLIGHT2 = "#b9c1c7";

    const parsePathname = (pathname) => {
        // wavy/fontSize=16/hightlight1=red/hightlight2=blue/Hello,+World!

        const parts = (pathname || '').split('/');
        parts.shift(); // remove the first element (wavy/)
        const text = parts.pop();

        const props = parts.reduce((acc, part) => {
            // const [key, raw] = part.split('=');
            const partParts = part.split('=');
            const key = partParts[0];
            const raw = partParts[1];
            if (key === 'sw' && raw === 'thin') {
                acc[key] = THIN_STROKE_WIDTH;
            } else if (key === 'sw' && raw === 'thick') {
                acc[key] = THICK_STROKE_WIDTH;
            } else {
                const value = decodeURIComponent(raw);
                acc[key] = value;
            }
            return acc;
        }, {});

        return withDefaults(props);
    }

    // const withDefaults = (props) => ({
    //     size: 300,
    //     fontSize: 16,
    //     fill: DEFAULT_FILL,
    //     stroke: DEFAULT_STROKE,
    //     sw: DEFAULT_STROKE_WIDTH,
    //     highlight1: DEFAULT_HIGHLIGHT1,
    //     highlight2: DEFAULT_HIGHLIGHT2,
    //     ...props,
    // });

    const defaults = {
        text: 'Hello, World!',
        size: 300,
        fontSize: 16,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE,
        sw: DEFAULT_STROKE_WIDTH,
        highlight1: DEFAULT_HIGHLIGHT1,
        highlight2: DEFAULT_HIGHLIGHT2,
    };

    const withDefaults = (props) => {
        return Object.assign({}, defaults, props);
    };

    const makeWavyTextSvg = (props) => {
        // const { text = 'Hello, World!', size = 300, fontSize = 16, fill = "#339af0", stroke = "#b3b3b3", sw = DEFAULT_STROKE_WIDTH, highlight1 = DEFAULT_HIGHLIGHT1, highlight2 = DEFAULT_HIGHLIGHT2 } = props;

        const makeTextStylesCss = (props) => {
            // const { size = 300, fontSize = 16, sw = DEFAULT_STROKE_WIDTH, fill = "#339af0", stroke = "#b3b3b3", highlight1 = "" } = props;

            const styles = {
                // ['font-size']: `${size / 17.7}px`,
                ['font-size']: `${props.fontSize}pt`,
                ['font-family']: "'American Typewriter'",
                ['fill']: props.fill,
                ['stroke']: props.stroke,
                ['stroke-width']: props.sw,
                ['filter']: "url(#a)",
                ['image-rendering']: "crisp-edges",
            };

            // return Object.entries(styles).map(([key, value]) => `${key}:${value}`).join(';');
            return Object.entries(styles).map((kv => kv.join(':'))).join(';');
        }

        const textStyles = makeTextStylesCss(props);

        return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="150" viewBox="0 0 800 150" style="width: 100%; height: auto;">
        <defs>
            <filter id="a" width="1.25" height="1.56" x="-.03" y="-.2" overflow="display">
                <feTurbulence baseFrequency=".04" lightingColor="${props.highlight1}" numOctaves="5"
                    result="result4" type="fractalNoise" />
                <feDisplacementMap in="SourceGraphic" in2="result4" result="result3" scale="10"
                    xChannelSelector="R" yChannelSelector="G" />
                <feDiffuseLighting in="result4" lightingColor="${props.highlight2}" result="result1"
                    surfaceScale="2">
                    <feDistantLight azimuth="235" elevation="40" />
                </feDiffuseLighting>
                <feComposite in="result3" in2="result1" operator="in" result="result2" />
                <feComposite in2="result1" k1="1.7" operator="arithmetic" result="result5" />
                <feBlend in="result5" in2="result3" mode="lighten" />
            </filter>
        </defs>
        <text aria-label="${props.text}" x="0" y="80" style="${textStyles}">
            <tspan x="0" y="80">${props.text}</tspan>
        </text>
    </svg>`;
    };

    // Process
    const wavyPath = (pathname || '').replace('wavy/', '');
    const props = parsePathname(wavyPath);
    console.log(`Props: ${JSON.stringify(props)}`);
    const options = withDefaults(props);
    console.log(`Options: ${JSON.stringify(options)}`);
    const svg = makeWavyTextSvg(options);

    return {
        statusCode: 200,
        statusDescription: 'OK',
        headers: {
            'content-type': { value: 'image/svg+xml' },
        },
        body: {
            encoding: 'text',
            data: svg,
        },
    };

};

// Placeholder image handler
const handlePlaceholder = (pathname, request, response) => {

    const DEFAULT_WIDTH = 300;
    const DEFAULT_HEIGHT = 200;
    const DEFAULT_FILL = 'lightgray';
    const DEFAULT_OUTLINE = 'darkgray';
    const DEFAULT_TEXT_COLOR = 'black';

    const parsePathname = (pathname) => {
        // placeholder/300x200/ff0000/000000/Hello,+World!

        const parts = (pathname || '').split('/');
        parts.shift(); // remove the first element (placeholder/)
        // const text = parts.pop();

        // const [size, bg, fg] = parts;
        const size = parts[0];
        const fill = parts[1] || DEFAULT_FILL;
        const outline = parts[2] || DEFAULT_OUTLINE;
        const textColor = parts[3] || DEFAULT_TEXT_COLOR;

        // const [width, height] = (size || '').split('x');
        const sizeParts = (size || '').split('x');
        const width = sizeParts[0] || DEFAULT_WIDTH;
        const height = sizeParts[1] || DEFAULT_HEIGHT;

        return {
            size,
            width,
            height,
            fill,
            outline,
            textColor,
        };
    }

    const makePlaceholderImage = (props) => {
        // const { size = '300x200', bg = 'ff0000', fg = '000000', text = 'Hello, World!' } = props;

        const width = props.width || DEFAULT_WIDTH;
        const height = props.height || DEFAULT_HEIGHT;
        const outline = props.outline || DEFAULT_OUTLINE;
        const fill = props.fill || DEFAULT_FILL;
        const textColor = props.textColor || DEFAULT_TEXT_COLOR;
        const text = `${width}x${height}`;

        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="${width}" height="${height}" stroke="${outline}" stroke-width="3px" fill="${fill}"/>
<text x="50%" y="50%" dy=".3em" fill="${textColor}" font-family="Arial" font-size="20" text-anchor="middle">${text}</text>
</svg>`;
    };

    // Process
    const placeholderPath = (pathname || '').replace('placeholder/', '');
    const props = parsePathname(placeholderPath);
    const svg = makePlaceholderImage(props);

    return returnSVG(svg);
};
