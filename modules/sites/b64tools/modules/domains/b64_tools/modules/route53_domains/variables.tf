
# PROD Domains

variable "root_domain" {
    description = "The root domain for the hosted zone"
}

# Cloudfront alias

variable "cloudfront_domain" {
    description = "The domain name for the Cloudfront distribution"
}

variable "cloudfront_domain_hosted_zone_id" {
    description = "The hosted zone ID for the Cloudfront distribution"
}

# ACM Certificate values

variable "acm_certificate_arn" {
    description = "The ARN of the ACM certificate"
    type       = string
}

# Email forwarding validation

variable "email_forwarding_validation_by_domain" {
    description = "The email forwarding validation value by domain"
    type        = map(string)
}
