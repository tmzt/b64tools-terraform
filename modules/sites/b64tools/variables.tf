
variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "static_bucket_name" {
  description = "Name of the static bucket"
  default     = "b64tools-static"
}

variable "logging_bucket_name" {
  description = "Name of the logging bucket"
  default     = "b64tools-logging"
}

# PROD Domains

variable "root_domain" {
  description = "The root domain for the hosted zone"
  default     = "b64.tools"
}

variable "alternate_root_domains" {
  description = "Alternate root domains for the hosted zone"
  type        = list(string)
  default     = [
    "b64.codes",
    "b64.xyz"
  ]
}

# Email forwarding validation

variable "email_forwarding_validation_by_domain" {
  description = "The email forwarding validation value by domain"
  type        = map(string)
}
