
# module s3_static {
#     source = "modules/s3_static"
#     version = "1.0.0"
    
#     s3_bucket_name = "${var.static_bucket_name}"
#     s3_bucket_acl = "private"
#     s3_bucket_policy = {
#         Version = "2012-10-17"
#         Statement = [
#             {
#                 Effect = "Allow"
#                 Principal = "*"
#                 Action = "s3:GetObject"
#                 Resource = "arn:aws:s3:::${var.static_bucket_name}/*"
#             }
#         ]
#     }
#     s3_bucket_policy_enabled = true

#     s3_bucket_tags = {
#         Name = "${var.static_bucket_name}"
#     }
#     s3_bucket_lifecycle_rule = {
#         id = "${var.static_bucket_name}-lifecycle-rule"
#         enabled = true
#         prefix = ""
#         tags = {
#             Expiration = "true"
#         }
#         noncurrent_version_expiration = {
#             days = 90
#         }
#         abort_incomplete_multipart_upload_days = 7
#     }
#     s3_bucket_logging = {
#         target_bucket = "${var.logging_bucket_name}"
#         target_prefix = "logs/"
#     }
#     # s3_bucket_notification = {
#     #     topic = "example-topic"
#     #     event = "s3:ObjectCreated:*"
#     # }
#     s3_bucket_website = {
#         index_document = "index.html"
#         error_document = "error.html"
#     }
#     s3_bucket_cors_rule = {
#         allowed_headers = ["*"]
#         allowed_methods = ["GET"]
#         allowed_origins = ["*"]
#         expose_headers = ["ETag"]
#         max_age_seconds = 3000
#     }
#     s3_bucket_cors_rule_status = "Enabled"
#     s3_bucket_cors_rule_enabled = true

#     s3_bucket_versioning_enabled = true
#     s3_bucket_logging_enabled = true
#     s3_bucket_notification_enabled = true
#     s3_bucket_website_enabled = true
#     s3_bucket_acceleration_enabled = true
#     s3_bucket_acceleration_status = "Enabled"
#     s3_bucket_policy_status = "Enabled"
#     s3_bucket_versioning_status = "Enabled"
#     s3_bucket_logging_status = "Enabled"
#     s3_bucket_notification_status = "Enabled"
#     s3_bucket_website_status = "Enabled"
# }

resource "aws_s3_bucket" "static_bucket" {
  bucket = var.static_bucket_name
}

# Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "static_bucket_origin_access_identity" {
  comment = "Allows CloudFront to reach the S3 bucket"
}

# # ACL
# resource "aws_s3_bucket_acl" "static_bucket_acl" {
#   bucket = aws_s3_bucket.static_bucket.id
#   acl    = "private"
# }

# Policy - allow access to the bucket with OAI

resource "aws_s3_bucket_policy" "static_bucket_policy" {
  bucket = aws_s3_bucket.static_bucket.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          # This should be using the aws_cloudfront_origin_access_identity.static_bucket_origin_access_identity.s3_canonical_user_id,

          # CanonicalUser = aws_cloudfront_origin_access_identity.static_bucket_origin_access_identity.s3_canonical_user_id,
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E3DLJ50E3GNR4B"
        },
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.static_bucket.arn}/*",
      },
    ],
  })
}

output "s3_bucket_id" {
  value = aws_s3_bucket.static_bucket.id
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.static_bucket.arn
}

output "s3_bucket_regional_domain_name" {
  value = aws_s3_bucket.static_bucket.bucket_regional_domain_name
}

output "s3_bucket_origin_id" {
  value = aws_cloudfront_origin_access_identity.static_bucket_origin_access_identity.id
}

output "s3_bucket_origin_access_identity" {
  value = aws_cloudfront_origin_access_identity.static_bucket_origin_access_identity.cloudfront_access_identity_path
}
