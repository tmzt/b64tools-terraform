
variable "aws_region" {
  description = "The AWS region to deploy to"
}

variable "static_bucket_name" {
  description = "The name of the S3 bucket to create for static files"
}

variable "logging_bucket_name" {
  description = "The name of the S3 bucket to create for logs"
}

variable "static_bucket_regional_domain_name" {
  description = "The regional domain name for the static bucket"
}

variable "static_bucket_origin_id" {
  description = "The origin ID for the static bucket"
}

variable "static_bucket_origin_access_identity" {
  description = "The origin access identity for the static bucket"
}

# ACM Certificates

variable "root_acm_certificate_arn" {
  description = "The ARN of the root (wildcard) ACM certificate"
}

# Domains

variable "root_domain" {
  description = "The root domain for the hosted zone"
}

# Cloudfront variables

variable "cloudfront_enabled" {
  description = "Whether to enable Cloudfront"
  default     = true
}

variable "cloudfront_price_class" {
  description = "The price class for the Cloudfront distribution"
  default     = "PriceClass_100"
}

variable "cloudfront_default_root_object" {
  description = "The default root object for the Cloudfront distribution"
  default     = "index.html"
}

# Tags

variable "cloudfront_s3_static_tags" {
  description = "A map of tags to add to all resources"
  type        = map
  default     = {}
}
