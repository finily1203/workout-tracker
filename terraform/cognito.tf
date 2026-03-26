resource "aws_cognito_user_pool" "workout_pool" {
  name = "${var.app_name}-user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = {
    Name = "${var.app_name}-user-pool"
  }
}

resource "aws_cognito_user_pool_client" "workout_client" {
  name         = "${var.app_name}-client"
  user_pool_id = aws_cognito_user_pool.workout_pool.id

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED"
}