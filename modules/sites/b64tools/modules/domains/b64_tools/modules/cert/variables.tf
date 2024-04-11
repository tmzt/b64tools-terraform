
variable "aws_region" {
  description = "The AWS region to deploy to"
  default     = "us-east-1"
}

# Hosted zones

variable "root_hosted_zone_id" {
  description = "The ID of the hosted zone"
}

# PROD Domains

variable "root_domain" {
    description = "The root domain for the hosted zone"
}
