
module "route53_domains" {
  source = "./modules/route53_domains"

  root_domain            = var.root_domain

  email_forwarding_validation_by_domain = var.email_forwarding_validation_by_domain

  acm_certificate_arn = module.cert.acm_certificate_arn

  cloudfront_domain                = module.cloudfront_s3.cloudfront_domain
  cloudfront_domain_hosted_zone_id = module.cloudfront_s3.cloudfront_domain_hosted_zone_id
}

module "cert" {
  source = "./modules/cert"

  root_hosted_zone_id = module.route53_domains.root_hosted_zone_id

  root_domain         = var.root_domain
}

module "cloudfront_s3" {
  source = "./modules/cloudfront_s3"

  aws_region = var.aws_region

  static_bucket_name  = var.static_bucket_name
  logging_bucket_name = var.logging_bucket_name

  static_bucket_regional_domain_name = var.static_bucket_regional_domain_name
  static_bucket_origin_id            = var.static_bucket_origin_id
  static_bucket_origin_access_identity = var.static_bucket_origin_access_identity

  root_acm_certificate_arn = module.cert.acm_certificate_arn

  root_domain            = var.root_domain
}
