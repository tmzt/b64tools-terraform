
# Route53 Hosted Zone
resource "aws_route53_zone" "b64_tools-root" {
  name = "${var.root_domain}"
}

# Third-party validations/records

resource "aws_route53_record" "b64_tools-root-forwardemailtxt" {
  zone_id = "${aws_route53_zone.b64_tools-root.zone_id}"
  name = "${var.root_domain}"
  type = "TXT"
  records = [lookup(var.email_forwarding_validation_by_domain, var.root_domain)]
  ttl = 300
}

resource "aws_route53_record" "b64_tools-root-forwardemailmx" {
  zone_id = "${aws_route53_zone.b64_tools-root.zone_id}"
  name = "${var.root_domain}"
  type = "MX"
  records = [
    "10 mx1.forwardemail.net",
    "10 mx2.forwardemail.net",
  ]
  ttl = 300
}

resource "aws_route53_record" "b64_tools-root-cloudfront" {
  zone_id = "${aws_route53_zone.b64_tools-root.zone_id}"
  name = "${var.root_domain}"
  type = "A"

  alias {
    name = "${var.cloudfront_domain}"
    zone_id = "${var.cloudfront_domain_hosted_zone_id}"
    evaluate_target_health = false
  }
}

# TODO: restore these

# locals {
#   cloudfront_aliases = [
#     "static.${var.root_domain}",
#   ]
# }

# resource "aws_route53_record" "b64_tools-root-cloudfront-aliases" {
#   count = "${length(local.cloudfront_aliases)}"
#   zone_id = "${aws_route53_zone.b64_tools-root.zone_id}"
#   name = "${element(local.cloudfront_aliases, count.index)}"
#   type = "A"

#   alias {
#     name = aws_route53_record.b64_tools-root-cloudfront.name
#     zone_id = aws_route53_zone.b64_tools-root.zone_id
#     evaluate_target_health = false
#   }
# }

output "root_hosted_zone_id" {
  value = "${aws_route53_zone.b64_tools-root.zone_id}"
}

output "root_hosted_zone_name_servers" {
  value = "${aws_route53_zone.b64_tools-root.name_servers}"
}
