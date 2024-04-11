
# b64.tools collection DevOps scripts and Terraform setup

![CC0 1.0](https://licensebuttons.net/p/zero/1.0/88x31.png)

## License

This repo is licensed under the [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) license, essentially public domain. For more information see that page.

## AWS Deployment

This repo is meant to deploy b64.tools to AWS using the following basic architecture:

### S3

The compiled site and assets are deployed to S3 under a path.

This path is referenced by the CloudFront origin and the content retrieved securely using the Origin Access Identity.

### CloudFront Functions

This site uses a CloudFront Function (similar to Lambda@Edge) to execute routing logic.

You can see the source for the function here:

[viewer-request-b64tools.js](./modules/sites/b64tools/modules/domains/b64_tools/modules/cloudfront_s3/functions/viewer-request-b64tools.js)

### CloudFront Distribution

This Terraform project will create a new CloudFront distribution configured to serve content from the S3 bucket using the viewer function.

### Route 53

Used for the DNS zone, contains an alias to the CloudFront Distro, TXT records (for certificate, email forwarding, and site verification)

## Other deployment options

The site can also be deployed to other hosting providers, though scripts are not included to do this.

By running `make build` in the application repo [b64tools-app-mantine](https://github.com/tmzt/b64tools-app-mantine), you will get a full built version in *dist*.

This can be deployed to any static host that supports rewriting missing URLs to `/index.html`.
