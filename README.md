
# b64.tools collection DevOps scripts and Terraform setup

![https://licensebuttons.net/p/zero/1.0/88x31.png](CC0 1.0)

## License

This repo is licensed under the [https://creativecommons.org/publicdomain/zero/1.0/](CC0 1.0) license, essentially public domain. For more information see that page.

## AWS Deployment

This repo is meant to deploy b64.tools to AWS using the following basic architecture:

### Route 53

Used for the DNS zone, contains an alias to the CloudFront Distro, TXT records