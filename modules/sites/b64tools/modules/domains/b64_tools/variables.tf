
variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "static_bucket_name" {
  description = "The name of the S3 bucket to create for static files"
  type       = string
}

variable "logging_bucket_name" {
  description = "The name of the S3 bucket to create for logs"
  type       = string
}

variable "root_domain" {
  description = "Root domain"
  default     = "b64.tools"
}

variable "email_forwarding_validation_by_domain" {
  description = "The email forwarding validation value by domain"
  type        = map(string)
}

variable "static_bucket_regional_domain_name" {
  description = "The regional domain name for the static bucket"
  type        = string
}

variable "static_bucket_origin_id" {
  description = "The origin ID for the static bucket"
  type        = string
}

variable "static_bucket_origin_access_identity" {
  description = "The origin access identity for the static bucket"
  type        = string
}
