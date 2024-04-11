
# ACM Certificate
resource "aws_acm_certificate" "cert_b64_tools" {
    domain_name = "${var.root_domain}"
    validation_method = "DNS"

    tags = {
        Name = "${var.root_domain}"
    }

    subject_alternative_names =  [
        "${var.root_domain}",
        "*.${var.root_domain}",
        "*.static.${var.root_domain}",
    ]
}

output "acm_certificate_arn" {
    value = "${aws_acm_certificate.cert_b64_tools.arn}"
}

# Validation records

# Remove duplicates
# see https://github.com/azavea/terraform-aws-acm-certificate/issues/12

locals {
    validation_options_raw = aws_acm_certificate.cert_b64_tools.domain_validation_options

    # Create a map
    validation_data = {
        for option in local.validation_options_raw : option["resource_record_name"] => {
            resource_record_name = option["resource_record_name"],
            resource_record_type = option["resource_record_type"],
            resource_record_value = option["resource_record_value"]
        }...
    }

    # Back to records
    validation_records = [
    for key in keys(local.validation_data) :
    {
      resource_record_name  = key
      resource_record_type  = lookup(lookup(local.validation_data, key)[0], "resource_record_type")
      resource_record_value = lookup(lookup(local.validation_data, key)[0], "resource_record_value")
    }
  ]
}

resource "aws_route53_record" "validation_record_b64_tools" {
    count = "${length(local.validation_records)}"
    zone_id = "${var.root_hosted_zone_id}"
    name = "${local.validation_records[count.index].resource_record_name}"
    type = "${local.validation_records[count.index].resource_record_type}"
    records = ["${local.validation_records[count.index].resource_record_value}"]
    ttl = 60
}
