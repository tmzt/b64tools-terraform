
variable "email_forwarding_validation_by_domain" {
  description = "Validation codes for forwardemail.net"
  type       = map(string)
  sensitive   = true
}
