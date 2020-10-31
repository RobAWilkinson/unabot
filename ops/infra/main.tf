resource "aws_ses_domain_identity" "oddball_unanet" {
  domain = "oddballunanet.com"
}

resource "aws_route53_record" "oddball_unanet_amazonses_verification_record" {
  zone_id = data.aws_route53_zone.oddball_unanet.zone_id
  name    = "_amazonses.${aws_ses_domain_identity.oddball_unanet.id}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.oddball_unanet.verification_token]
}


resource "aws_route53_record" "oddball_unanet_mx_record" {
  zone_id = data.aws_route53_zone.oddball_unanet.zone_id
  name    = "oddballunanet.com"
  type    = "MX"
  ttl     = "600"
  records = ["10 inbound-smtp.us-east-1.amazonaws.com"]
}

resource "aws_ses_domain_identity_verification" "oddball_unanet_verification" {
  domain = aws_ses_domain_identity.oddball_unanet.id

  depends_on = [aws_route53_record.oddball_unanet_amazonses_verification_record]
}

data "aws_route53_zone" "oddball_unanet" {
  name = "oddballunanet.com"
}

resource "aws_ses_receipt_rule_set" "main" {
  rule_set_name = "primary-rules"
}
resource "aws_ses_receipt_rule" "store" {
  name          = "store"
  rule_set_name = aws_ses_receipt_rule_set.main.id
  recipients    = ["test@oddballunanet.com"]
  enabled       = true
  scan_enabled  = true

sns_action {
  topic_arn = aws_sns_topic.unabot_topic.id
  position = 1
}

}

resource "aws_sns_topic" "unabot_topic" {
  name = "unabot_topic"
}