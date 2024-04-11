
var_files := $(wildcard *.tfvars)
var_file_args := $(foreach f,$(var_files),--var-file=$(f))

plan_file := ".tfplan"

# This file is not included, you will need to build your own from secrets.tfvars.example
secrets := secrets.tfvars
secrets_arg := $(if $(wildcard $(secrets)),--var-file=$(secrets),)

# Run this after changing the module references, and when first cloning the repo
init:
	terraform init

fmt:
	terraform fmt

# Create the DNS zone
plan-dns:
	terraform plan ${secrets_arg} -out=$(plan_file) $(var_file_args) -target=module.b64tools.module.domain_b64_tools.module.route53_domains.aws_route53_zone.b64_tools-root

# Create the ACM certificate, but not the DNS validation records
plan-cert:
	terraform plan ${secrets_arg} -out=$(plan_file) $(var_file_args) -target module.b64tools.module.domain_b64_tools.module.cert.aws_acm_certificate.cert_b64_tools

# Destroy the ACM certificate, use this if the validate fails to complete.
# You will be prompted to confirm the destruction.
destroy-cert:
	terraform destroy $(var_file_args) -target module.b64tools.module.domain_b64_tools.module.cert.aws_acm_certificate.cert_b64_tools

# Create the DNS validation records
plan-cert-dns:
	terraform plan ${secrets_arg} -out=$(plan_file) $(var_file_args) -target=module.b64tools.module.domain_b64_tools.module.cert.aws_route53_record.validation_record_b64_tools

# Create the full plan, which should be done after the other steps have been applied
plan:
	terraform plan ${secrets_arg} -out=$(plan_file) $(var_file_args)

# Apply the plan, use this after each of the previous steps
apply:
	terraform apply $(plan_file)
