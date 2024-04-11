
provider "aws" {
  region  = var.aws_region
  profile = "appsub"
}

# S3 State

terraform {
  backend "s3" {
    bucket  = "b64tools-terraform-state"
    key     = "b64tools-terraform.tfstate"
    region  = "us-east-1"
    profile = "appsub"
  }
}

# Enable versioning on the state bucket
# resource "aws_s3_bucket" "terraform_state" {
#   bucket = "b64tools-terraform-state"
# }

# Use the existing bucket
data "aws_s3_bucket" "terraform_state" {
  bucket = "b64tools-terraform-state"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = data.aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Sites

module "b64tools" {
  source = "./modules/sites/b64tools"
}
