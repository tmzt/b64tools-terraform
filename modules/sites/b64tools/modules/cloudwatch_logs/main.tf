
# Imported
resource "aws_cloudwatch_log_group" "b64tools-cloudfront-function-viewer-request-logs" {
  skip_destroy      = true
  name              = "/aws/cloudfront/function/viewer-request-b64tools"
  retention_in_days = 3
}
