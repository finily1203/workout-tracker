output "api_gateway_url" {
  value = aws_apigatewayv2_stage.default.invoke_url
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.workout_pool.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.workout_client.id
}

output "s3_website_url" {
  value = aws_s3_bucket_website_configuration.workout_app.website_endpoint
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.workout_app.domain_name
}