
# Domains

module "domain_b64_tools" {
  source = "./modules/domains/b64_tools"

  root_domain            = "b64.tools"

  static_bucket_name  = "b64tools-static"
  logging_bucket_name = "b64tools-logs"

  email_forwarding_validation_by_domain = var.email_forwarding_validation_by_domain

  static_bucket_regional_domain_name = module.s3_static.s3_bucket_regional_domain_name
  static_bucket_origin_id            = module.s3_static.s3_bucket_origin_id
  static_bucket_origin_access_identity = module.s3_static.s3_bucket_origin_access_identity
}

# CloudWatch Logs

module "cloudwatch_logs" {
  source = "./modules/cloudwatch_logs"

  # aws_region = var.aws_region
}

# S3 Static bucket

module "s3_static" {
  source = "./modules/s3_static"

  static_bucket_name = var.static_bucket_name
  logging_bucket_name = var.logging_bucket_name
}
