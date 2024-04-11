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

    console.log(`Request: ${JSON.stringify(request)}`);

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

    const filePath = trimmedPath.split('/').pop();
    const isResourceFile = filePath.includes('.');

    const isAssetPath = trimmedPath.startsWith('/assets');

    const s3Prefix = '/sites/b64tools/apps/beta/b64tools-app-mantine';

    if (isAssetPath) {
        request.uri = `${s3Prefix}/${trimmedPath}`;
    } else {
        // Otherwise, serve index.html
        request.uri = `${s3Prefix}/${trimmedPath}/index.html`;
    }

    console.log(`Final request.uri: ${request.uri}`);

    return request;

}

// SSG handler (not supported yet)
async function ssgHandler(request) {
    const DOMAIN_NAME = 'b64.tools'

    const SLASHES = /(\/+)/g;
    const START_SLASH = /^\//;
    const END_SLASH = /\/$/;
    const QUERY_STRING = /\?.*$/;

    // for(const header in request.headers) {
    //     console.log(`Header: ${header}: ${request.headers[header].value}`);
    // }

    const hostHeader = (request.headers['host'] || {}).value;
    console.log(`Host: ${hostHeader}`);

    if (typeof hostHeader == 'undefined') {
        return response502;
    }

    if (hostHeader.toLowerCase() !== DOMAIN_NAME) {
        return response502;
    }
    
    console.log(`Request URI: ${request.uri}`);

    const originalPath = request.uri;
    const pathname = request.uri.trimStart('/').replace(SLASHES, '/').replace(QUERY_STRING, '');
    const trimmedPath = pathname
        .replace(START_SLASH, '')
        .replace(END_SLASH, '');

    console.log(`Pathname: ${pathname}`);
    console.log(`Trimmed Path: ${trimmedPath}`);

    if (trimmedPath.startsWith('wavy/') && trimmedPath !== 'wavy') {
        console.log('calling handleWavy()');
        return handleWavy(trimmedPath, request);
    }

    if (trimmedPath.startsWith('placeholder/') && trimmedPath !== 'placeholder') {
        console.log('calling handlePlaceholder');
        return handlePlaceholder(trimmedPath, request);
    }

    // Otherwise, serve a static path

    // site_name := b64tools
    // app_path := $(app_env)/b64tools-app-mantine

    // s3_path := sites/$(site_name)/apps/$(app_path)
    // s3_uri := s3://appsub-static-bucket/$(s3_path)

    // s3_path := sites/b64tools/apps/$(app_env)/b64tools-app-mantine

    const app_env = 'beta'
    const s3_path = `sites/b64tools/apps/${app_env}/b64tools-app-mantine/${trimmedPath}`;

    const filePath = trimmedPath.split('/').pop();
    const isResourceFile = filePath.includes('.');

    console.log(`File path: ${filePath}`);
    console.log(`Is resource file: ${isResourceFile}`);

    request.uri = `/${s3_path}`;
    console.log(`Request URI (before final): ${request.uri}`);

    if (!isResourceFile) {
        if (!request.uri.endsWith('/')) {
            request.uri += '/';
        }
        request.uri += 'index.html';
    }

    console.log(`Final request.uri: ${request.uri}`);

    return request;
}

// Wavy svg handler
function handleWavy(pathname, request) {
    const DEFAULT_STROKE_WIDTH = 0.0670897;
    const THIN_STROKE_WIDTH = 0.0670897;
    const THICK_STROKE_WIDTH = 0.134179;
    const DEFAULT_FILL = "#339af0";
    const DEFAULT_STROKE = "#b3b3b3";
    const DEFAULT_HIGHLIGHT1 = "#339af0";
    const DEFAULT_HIGHLIGHT2 = "#b9c1c7";

    const parsePathname = (pathname) => {
        // wavy/fontSize=16/hightlight1=red/hightlight2=blue/Hello,+World!

        const parts = pathname.split('/');
        parts.shift(); // remove the first element (wavy/)
        const text = parts.pop();

        const props = parts.reduce((acc, part) => {
            // const [key, raw] = part.split('=');
            const partParts = part.split('=');
            const key = partParts[0];
            const raw = partParts[1];
            const value = decodeURIComponent(raw);
            acc[key] = value;
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
    const wavyPath = pathname.replace('wavy/', '');
    const props = parsePathname(wavyPath);
    const svg = makeWavyTextSvg(props);

    return {
        status: 200,
        statusDescription: 'OK',
        headers: {
            'content-type': [{ key: 'Content-Type', value: 'image/svg+xml' }],
        },
        body: svg,
    };
};

// Placeholder image handler
const handlePlaceholder = (pathname, request) => {

    const DEFAULT_WIDTH = 300;
    const DEFAULT_HEIGHT = 200;

    const parsePathname = (pathname) => {
        // placeholder/300x200/ff0000/000000/Hello,+World!

        const parts = pathname.split('/');
        parts.shift(); // remove the first element (placeholder/)
        const text = parts.pop();

        // const [size, bg, fg] = parts;
        const size = parts[0];
        const bg = parts[1];
        const fg = parts[2];

        // const [width, height] = (size || '').split('x');
        const sizeParts = size.split('x');
        const width = sizeParts[0];
        const height = sizeParts[1];

        return {
            size,
            bg,
            fg,
            text,
        };
    }

    const makePlaceholderImage = (props) => {
        // const { size = '300x200', bg = 'ff0000', fg = '000000', text = 'Hello, World!' } = props;

        // const [width, height] = size.split('x');

        // const [size, bg, fg] = parts;
        // const size = parts[0];
        // const bg = parts[1];
        // const fg = parts[2];

        // const [width, height] = (size || '').split('x');
        const sizeParts = (props.size || '300x200').split('x');
        const width = sizeParts[0] || DEFAULT_WIDTH;
        const height = sizeParts[1] || DEFAULT_HEIGHT;

        const fg = props.fg || '000000';
        const bg = props.bg || 'lightgray';
        const text = `${width}x${height}`;

        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="#${bg}">
        <rect width="${width}" height="${height}" fill="#${bg}"/>
        <text x="50%" y="50%" dy=".3em" fill="#${fg}" font-family="Arial" font-size="20" text-anchor="middle">${text}</text>
    </svg>`;
    };

    // Process
    const placeholderPath = pathname.replace('placeholder/', '');
    const props = parsePathname(placeholderPath);
    const svg = makePlaceholderImage(props);

    return {
        status: 200,
        statusDescription: 'OK',
        headers: {
            'content-type': [{ key: 'Content-Type', value: 'image/svg+xml' }],
        },
        body: svg,
    };
};
