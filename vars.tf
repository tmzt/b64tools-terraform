
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

variable "root_domain" {
  description = "Root domain"
  default     = "b64.tools"
}
