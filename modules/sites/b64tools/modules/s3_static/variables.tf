
variable "aws_region" {
  description = "The AWS region to deploy to"
  default     = "us-east-1"
}

variable "static_bucket_name" {
  description = "The name of the S3 bucket to create for static files"
  default     = "example-static-bucket"
}

variable "logging_bucket_name" {
  description = "The name of the S3 bucket to create for logs"
  default     = "example-logging-bucket"
}
