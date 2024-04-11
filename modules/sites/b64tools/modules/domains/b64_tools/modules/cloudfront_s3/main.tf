
# Cloudfront functions

resource "aws_cloudfront_function" "viewer_func" {
    name = "viewer-request-b64tools"
    runtime = "cloudfront-js-2.0"
    comment = "Viewer request function (b64tools)"
    publish = true
    code = file("${path.module}/functions/viewer-request-b64tools.js")
}

# Cloudfront distribution

resource "aws_cloudfront_distribution" "cloudfront_s3_static" {
    enabled = var.cloudfront_enabled
    price_class = var.cloudfront_price_class
    default_root_object = var.cloudfront_default_root_object

    aliases = [
        var.root_domain,
        "static.${var.root_domain}",
    ]

    # acm_certificate_arn = var.root_acm_certificate_arn

    # Error -> index.html
    custom_error_response {
        error_code = 404
        response_code = 200
        response_page_path = "/index.html"
    }

    # Bucket origin
    origin {
        domain_name = var.static_bucket_regional_domain_name
        origin_id = "b64tools-origin"
        # origin_path = "/"

        # custom_origin_config {
        #     http_port = 80
        #     https_port = 443
        #     origin_protocol_policy = "https-only"
        #     origin_ssl_protocols = ["TLSv1.2"]
        # }

        s3_origin_config {
            origin_access_identity = var.static_bucket_origin_access_identity
        }
    }

    default_cache_behavior {
        target_origin_id = "b64tools-origin"
        allowed_methods = ["GET", "HEAD", "OPTIONS"]
        cached_methods = ["GET", "HEAD"]
        viewer_protocol_policy = "redirect-to-https"
        forwarded_values {
            query_string = false
            cookies {
                forward = "none"
            }
        }
        min_ttl = 0
        default_ttl = 3600
        max_ttl = 86400

        function_association {
            event_type = "viewer-request"
            function_arn = aws_cloudfront_function.viewer_func.arn
        }
    }

    # # Viewer Request Function
    # lambda_function_association {
    #     event_type = "viewer-request"
    #     include_body = false
    #     lambda_arn = aws_cloudfront_function.viewer_func.arn
    # }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }
    viewer_certificate {
        # ACM Certificate
        acm_certificate_arn = var.root_acm_certificate_arn
        ssl_support_method = "sni-only"
    }
    # logging_config {
    #     bucket = var.logging_bucket_name
    #     include_cookies = false
    #     prefix = "cloudfront/"
    # }
    # web_acl_id = var.web_acl_id
    tags = var.cloudfront_s3_static_tags
}

output "cloudfront_domain" {
    value = aws_cloudfront_distribution.cloudfront_s3_static.domain_name
}

output "cloudfront_domain_hosted_zone_id" {
    value = aws_cloudfront_distribution.cloudfront_s3_static.hosted_zone_id
}
